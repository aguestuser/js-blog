import {expect} from "chai"
import {initDb} from "../../src/models"
import {postAttrs, userAttrs} from "../fixtures"
import {pick, keys, clone} from "lodash"
import {describe, before, beforeEach, after, afterEach, it} from "mocha"

describe("Post model", () => {
  let db
  before(() => db = initDb())
  after(async () => await db.sequelize.close())

  describe("fields", () => {
    let post
    before(async () => post = await db.Post.create(postAttrs))
    after(async () => await db.Post.destroy({where: {}}))

    it("has a title", () => {
      expect(post.title).to.eql(postAttrs.title)
    })

    it("has a body", () => {
      expect(post.body).to.eql(postAttrs.body)
    })
  })

  describe("associations", () => {
    let post
    beforeEach(async () => {
      post = await db.Post.create({
        ...postAttrs,
        author: clone(userAttrs),
      }, {
        include: [{
          model: db.User, as: "author",
        }],
      })
    })
    afterEach(async () => {
      await Promise.all([
        db.Post.destroy({where: {}}),
        db.User.destroy({where: {}}),
      ])
    })

    it("belongs to an author (eager-loaded)", () => {
      expect(pick(post.author, keys(userAttrs)))
        .to.eql(userAttrs)
    })

    it("belongs to an author (lazy-loaded)", async () => {
      expect(await post.getAuthor())
        .to.eql(await db.User.findOne({ where: userAttrs }))
    })

    it("does not delete author when deleted", async () => {
      const userCount = await db.User.count()
      post.destroy().catch(console.error)
      expect(await db.User.count()).to.eql(userCount)
    })
  })
})
