import {expect} from "chai"
import db, {sequelize, Sequelize} from "../../src/models"
import {postAttrs, userAttrs} from "../fixtures"
import {pick, keys} from "lodash"

describe("post model", () => {
  // before(async () => { await sequelize.authenticate() })
  // after(async () => { await sequelize.close() })

  describe("fields", () => {
    let post
    before(async () => post = await db.post.create(postAttrs))
    after(async () => await db.post.destroy({where: {}}))

    it("has a title", () => {
      expect(post.title).to.eql(postAttrs.title)
    })

    it("has a body", () => {
      expect(post.body).to.eql(postAttrs.body)
    })
  })

  describe("associations", () => {
    let post
    before(async () => {
      post = await db.post.create({
        ...postAttrs,
        user: userAttrs
      },{
        include: [{
          association: db.post.user,
          include: [ db.user.posts ]
        }]
      })
    })
    after(async () => {
      await Promise.all([
        db.post.destroy({where: {}}),
        db.user.destroy({where: {}})
      ])
    })

    it("belongs to a user", () => {
      expect(pick(post.user.dataValues, keys(userAttrs))).to.eql(userAttrs)
    })
  })
})