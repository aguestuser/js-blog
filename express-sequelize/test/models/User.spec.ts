import {describe, beforeEach, afterEach, it, before, after} from 'mocha'
import {expect} from "chai"
import {pick, keys, map, slice, times} from "lodash"
import {initDb} from "../../src/models"
import {Op} from "sequelize"
import {followeesAttrs, followersAttrs, postAttrs, postsAttrs, userAttrs, usersAttrs} from "../fixtures"
import {UserAttributes} from "../../src/models/User"

describe("User model", () => {
  let db
  before( async () => db = initDb())
  after(async () => await db.sequelize.close())
  
  describe("CRUD operations", () => {
    let user
    beforeEach(async () => {
      user = await db.User.create(userAttrs)
    })
    afterEach(async () => await db.User.destroy({ where: {}}))

    it("creates a user", async () => {
      expect(await db.User.count()).to.eql(1)
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
        expect(await db.User.count()).to.eql(userCount - 1)
      })

      it("deletes a user with a static method", async () => {
        await db.User.destroy({ where: { id: user.id}})
        expect(await db.User.count()).to.eql(userCount - 1)
      })
    })
  })

  describe("bulk CRUD operations", () => {
    let users, userCount
    beforeEach(async () => {
      userCount = await db.User.count()
      users = await db.User.bulkCreate(usersAttrs)
    })
    afterEach(async () => await db.User.destroy({ where: {}}))

    it("creates many users", async () => {
      expect(await db.User.count()).to.eql(userCount + 3)
    })

    it("retrieves all users", async () => {
      const foundUsers = await db.User.findAll()
      expect(
        map(foundUsers, u => pick(u, keys(userAttrs))),
      ).to.eql(usersAttrs)
    })

    it("retrieves all users matching search criteria", async () => {
      const foundUsers = await db.User.findAll({
        where: { email: { [Op.like]: "%riseup%" } },
      })
      expect(
        map(foundUsers, u => pick(u, keys(userAttrs))),
      ).to.eql(slice(usersAttrs, 0, 2))
    })

    it("updates all users", async () => {
      await db.User.update(
        { email: "foo@bar.com" },
        { where: {} },
      )
      expect(map(await db.User.findAll(), u => u.email))
        .to.eql(times(3, () => "foo@bar.com"))
    })

    it("updates many users", async () => {
      const updatedUsers = await db.User.findAll({
        where: { email: { [Op.like]: "%riseup%" } },
      }).then(us => Promise.all(
          map(us, u => u.update({email: u.email.replace("riseup", "microsoft")})),
        ),
      )

      expect(map(updatedUsers, (u: UserAttributes) => u.email)).to.eql([
        "pynchon@microsoft.net",
        "egoldman@microsoft.net",
      ])

      expect(await db.User.count({
        where: { email: { [Op.like]: "%microsoft%" }},
      })).to.eql(2)
    })

    it("deletes many users", async () => {
      await db.User.destroy({
        where: { email: { [Op.like]: "%riseup%" } },
      })
      expect(await db.User.count()).to.eql(1)
    })
  })

  describe("associations", () => {
    let user

    beforeEach(async () => {
      user = await db.User.create({
        ...userAttrs,
        posts: postsAttrs,
        followers: followersAttrs,
        followees: followeesAttrs,
      }, {
        include: [{
          model: db.Post, as: "posts",
        }, {
          model: db.User, as: "followers",
        }, {
          model: db.User, as: "followees",
        }],
      })
    })

    afterEach(async () => {
      await Promise.all([
        db.Post.destroy({where: {}}),
        db.User.destroy({where: {}}),
      ])
    })

    it("has many posts", () => {
      expect(
        user.posts.map(p => pick(p, keys(postAttrs))),
      ).to.eql(postsAttrs)
    })

    it("deletes associated posts when deleted", async () => {
      const count = await db.Post.count()
      await user.destroy()
      expect(await db.Post.count()).to.eql(count - 3)
    })

    it("has many followers", () => {
      expect(
        user.followers.map(_ => pick(_, keys(userAttrs))),
      ).to.eql(followersAttrs)
    })

    it("has many followees", () => {
      expect(
        user.followees.map(_ => pick(_, keys(userAttrs))),
      ).to.eql(followeesAttrs)
    })

    it("does not delete followers or followees when deleting user", async () => {
      const count = await db.User.count()
      await user.destroy()
      expect(await db.User.count()).to.eql(count - 1)
    })

    it("has many followingsOf", async () => {
      expect((await user.getFollowingsOf()).length).to.eql(2)
    })
  
    it("has many followingsBy", async () => {
      expect((await user.getFollowingsOf()).length).to.eql(2)
    })

    it("has many followings", async () => {
      // TODO: test this on following model
      expect(await db.Following.scope({ method: ["forUser", user]}).count()).to.eql(4)
    })
  })
})
