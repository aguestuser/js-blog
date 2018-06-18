import {expect} from "chai"
import db, {sequelize, Sequelize} from "../../src/models"
import {postAttrs, userAttrs} from "../fixtures"
import {pick, keys, get, clone} from "lodash"

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
        author: clone(userAttrs),
      },{
        include: [{
          association: db.post.author,
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

    it("belongs to an author (eager-loaded)", () => {
      expect(pick(post.author, keys(userAttrs)))
        .to.eql(userAttrs)
    })

    it("belongs to an author (lazy-loaded)", async () => {
      expect(await post.getAuthor())
        .to.eql(await db.user.findOne({ where: userAttrs }))
    })

    it("does not delete author when deleted", async () => {
      const userCount = await db.user.count()
      post.destroy()
      expect(await db.user.count()).to.eql(userCount)
    })
  })
})
