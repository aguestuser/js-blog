import {expect} from "chai"
import {pick, keys, omit} from 'lodash'
import UserService from "../../src/services/userService"
import db, {sequelize} from "../../src/models"

describe("UserService", () => {
  const userAttrs = { username: "pynchon", email: "pynchon@risup.net" }
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
          { where: {id: user.id} },
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
})