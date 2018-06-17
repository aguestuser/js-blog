import {expect} from "chai"
import {pick, keys, map, slice, times} from 'lodash'
import db, {sequelize, Sequelize} from "../../src/models"
import {userAttrs, usersAttrs} from "../fixtures"
const {Op} = Sequelize

describe("UserService", () => {
  let userCount
  before(async () => {
    await sequelize.authenticate()
    userCount = await db.User.count()
  })

  after(async () => {
    expect(await db.User.count()).to.eql(0)
    await sequelize.close()
  })

  describe("CRUD operations", () => {
    let user
    beforeEach(async () => user = await db.User.create(userAttrs))
    afterEach(async () => await db.User.destroy({ where: {}}))

    it("creates a user", async () => {
      expect(await db.User.count()).to.eql(userCount + 1)
      expect(pick(user.dataValues, keys(userAttrs))).to.eql(userAttrs);
      ["id", "createdAt", "updatedAt"].forEach(attr => expect(user[attr]).to.exist)
    })

    it("retrieves a user", async () => {
      const foundUser = await db.User.findOne({ where: { id: user.id }})
      expect(pick(foundUser, keys(userAttrs))).to.eql(userAttrs)
    })

    describe("updating a user", () => {
      it("updates a user via an instance method", async () => {
        await user.update({ username: "oedipa" })
        expect(user.username).to.eql("oedipa")
      })

      it("updates a user via a static method", async () => {
        await db.User.update(
          { username: "oedipa" },
          { where: { id: user.id } },
        )
        const newUsername = await db.User
          .findOne({where: {id: user.id}})
          .then(u => u.username)

        expect(newUsername).to.eql("oedipa")
      })
    })

    describe("deleting a user", async () => {
      let userCount
      beforeEach(async () => userCount = await db.User.count())

      it("deletes a user with an instance method", async () => {
        await user.destroy()
        expect(await db.User.count()).to.eql(userCount -1)
      })

      it("deletes a user with a static method", async () => {
        await db.User.destroy({ where: { id: user.id}})
        expect(await db.User.count()).to.eql(userCount - 1)
      })
    })
  })

  describe("bulk CRUD operations", () => {
    let users
    beforeEach(async () => users = await db.User.bulkCreate(usersAttrs))
    afterEach(async () => await db.User.destroy({ where: {}}))

    it("creates many users", async () => {
      expect(await db.User.count()).to.eql(userCount + 3)
    })

    it("retrieves all users", async () => {
      const foundUsers = await db.User.findAll()
      expect(
        map(foundUsers, u => pick(u.dataValues, keys(userAttrs)))
      ).to.eql(usersAttrs)
    })

    it("retrieves all users matching search criteria", async () => {
      const foundUsers = await db.User.findAll({
        where: { email: { [Op.like]: "%riseup%" } }
      })
      expect(
        map(foundUsers, u => pick(u.dataValues, keys(userAttrs)))
      ).to.eql(slice(usersAttrs,0,2))
    })

    it("updates all users", async () => {
      await db.User.update(
        { email: "foo@bar.com" },
        { where: {} }
      )
      expect(map(await db.User.findAll(), u => u.email))
        .to.eql(times(3, () => "foo@bar.com"))
    })

    it("updates many users", async () => {
      const updatedUsers = await db.User.findAll({
        where: { email: { [Op.like]: "%riseup%" } }
      }).then(users => Promise.all(
          map(users, u => u.update({email: u.email.replace("riseup", "microsoft")}))
        )
      )

      expect(map(updatedUsers, u => u.email)).to.eql([
        "pynchon@microsoft.net",
        "egoldman@microsoft.net"
      ])

      expect(await db.User.count({
        where: { email: { [Op.like]: "%microsoft%" }}
      })).to.eql(2)
    })

    it("deletes many users", async () => {
      await db.User.destroy({
        where: { email: { [Op.like]: "%riseup%" } }
      })
      expect(await db.User.count()).to.eql(1)
    })
  })
})