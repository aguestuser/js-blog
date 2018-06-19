import {expect} from "chai"
import {pick, keys, map, slice, times} from 'lodash'
import db, {Sequelize} from "../../src/models"
import {followeesAttrs, followersAttrs, postAttrs, postsAttrs, userAttrs, usersAttrs} from "../fixtures"
const {Op} = Sequelize

describe("user model", () => {
  let userCount
  before(async () => {
    userCount = await db.user.count()
  })
  
  describe("CRUD operations", () => {
    let user
    beforeEach(async () => user = await db.user.create(userAttrs))
    afterEach(async () => await db.user.destroy({ where: {}}))

    it("creates a user", async () => {
      expect(await db.user.count()).to.eql(userCount + 1)
      expect(pick(user.dataValues, keys(userAttrs))).to.eql(userAttrs);
      ["id", "createdAt", "updatedAt"].forEach(attr => expect(user[attr]).to.exist)
    })

    it("retrieves a user", async () => {
      const foundUser = await db.user.findOne({ where: { id: user.id }})
      expect(pick(foundUser, keys(userAttrs))).to.eql(userAttrs)
    })

    describe("updating a user", () => {
      it("updates a user via an instance method", async () => {
        await user.update({ username: "oedipa" })
        expect(user.username).to.eql("oedipa")
      })

      it("updates a user via a static method", async () => {
        await db.user.update(
          { username: "oedipa" },
          { where: { id: user.id } },
        )
        const newUsername = await db.user
          .findOne({where: {id: user.id}})
          .then(u => u.username)

        expect(newUsername).to.eql("oedipa")
      })
    })

    describe("deleting a user", async () => {
      let userCount
      beforeEach(async () => userCount = await db.user.count())

      it("deletes a user with an instance method", async () => {
        await user.destroy()
        expect(await db.user.count()).to.eql(userCount -1)
      })

      it("deletes a user with a static method", async () => {
        await db.user.destroy({ where: { id: user.id}})
        expect(await db.user.count()).to.eql(userCount - 1)
      })
    })
  })

  describe("bulk CRUD operations", () => {
    let users
    beforeEach(async () => users = await db.user.bulkCreate(usersAttrs))
    afterEach(async () => await db.user.destroy({ where: {}}))

    it("creates many users", async () => {
      expect(await db.user.count()).to.eql(userCount + 3)
    })

    it("retrieves all users", async () => {
      const foundUsers = await db.user.findAll()
      expect(
        map(foundUsers, u => pick(u.dataValues, keys(userAttrs)))
      ).to.eql(usersAttrs)
    })

    it("retrieves all users matching search criteria", async () => {
      const foundUsers = await db.user.findAll({
        where: { email: { [Op.like]: "%riseup%" } }
      })
      expect(
        map(foundUsers, u => pick(u.dataValues, keys(userAttrs)))
      ).to.eql(slice(usersAttrs,0,2))
    })

    it("updates all users", async () => {
      await db.user.update(
        { email: "foo@bar.com" },
        { where: {} }
      )
      expect(map(await db.user.findAll(), u => u.email))
        .to.eql(times(3, () => "foo@bar.com"))
    })

    it("updates many users", async () => {
      const updatedUsers = await db.user.findAll({
        where: { email: { [Op.like]: "%riseup%" } }
      }).then(users => Promise.all(
          map(users, u => u.update({email: u.email.replace("riseup", "microsoft")}))
        )
      )

      expect(map(updatedUsers, u => u.email)).to.eql([
        "pynchon@microsoft.net",
        "egoldman@microsoft.net"
      ])

      expect(await db.user.count({
        where: { email: { [Op.like]: "%microsoft%" }}
      })).to.eql(2)
    })

    it("deletes many users", async () => {
      await db.user.destroy({
        where: { email: { [Op.like]: "%riseup%" } }
      })
      expect(await db.user.count()).to.eql(1)
    })
  })

  describe("associations", () => {
    let user

    beforeEach(async () => {
      user = await db.user.create({
        ...userAttrs,
        posts: postsAttrs,
        followers: followersAttrs,
        followees: followeesAttrs,
      },{
        include: [{
          association: db.user.posts,
        },{
          association: db.user.followers,
        }, {
          association: db.user.followees,
        }]
      })
    })

    afterEach(async () => {
      await Promise.all([
        db.post.destroy({where: {}}),
        db.user.destroy({where: {}})
      ])
    })

    it("has many posts", () => {
      expect(
        user.posts.map(p => pick(p, keys(postAttrs)))
      ).to.eql(postsAttrs)
    })

    it("deletes associated posts when deleted", async () => {
      const count = await db.post.count()
      await user.destroy()
      expect(await db.post.count()).to.eql(count - 3)
    })

    it("has many followers", () => {
      expect(
        user.followers.map(_ => pick(_, keys(userAttrs)))
      ).to.eql(followersAttrs)
    })

    it("has many followees", () => {
      expect(
        user.followees.map(_ => pick(_, keys(userAttrs)))
      ).to.eql(followeesAttrs)
    })

    it("does not delete followers or followees when deleting user", async () => {
      const count = await db.user.count()
      await user.destroy()
      expect(await db.user.count()).to.eql(count - 1)
    })

    it("has many followingsOf", async () => {
      expect((await user.getFollowingsOf()).length).to.eql(2)
    })
  
    it("has many followingsBy", async () => {
      expect((await user.getFollowingsOf()).length).to.eql(2)
    })

    it("has many followings", async () => {
      expect(await db.user.followings(db, user).count()).to.eql(4)
      // TODO: test this on following model
      expect(await db.following.scope({ method: ['forUser', user]}).count()).to.eql(4)
    })
  })
})
