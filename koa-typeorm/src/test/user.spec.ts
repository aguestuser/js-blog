import "reflect-metadata"
import {expect} from "chai"
import {User} from "../main/entity/user"
import {clone, forEach, get, pick} from "lodash"
import {createConnection} from "typeorm"
import {stripId} from "./helpers/db"
import {Post} from "../main/entity/post"
import {followeesFields, followersFields, userFields} from "./fixtures/users"
import {postFields, postsFields} from "./fixtures/posts"

describe("User entity", () => {
  let connection, userRepo, postRepo

  before(async () => {
    connection = await createConnection("test")
    userRepo = connection.getRepository(User)
    postRepo = connection.getRepository(Post)
    expect(await userRepo.count()).to.eql(0)
    expect(await postRepo.count()).to.eql(0)
  })

  afterEach(async () => {
    await postRepo.delete({})
    await userRepo.delete({})
  })

  after(async () => {
    await connection.close()
  })

  it("has correct fields", async () => {
    const user = await userRepo.save(clone(userFields))
    forEach(userFields, (v, k) => expect(get(user, k)).to.eql(v))
  })

  describe("associations", () => {
    let user
    beforeEach(async () => {
      user = await userRepo.save(userRepo.create({
        ...clone(userFields),
        posts: clone(postsFields),
        followers: clone(followersFields),
        followees: clone(followeesFields),
      }))
    })

    it("creates nested resources", async () => {
      expect(await userRepo.count()).to.equal(5)
      expect(await postRepo.count()).to.equal(2)
    })

    it("has many posts", async () => {
      expect(stripId(user.posts[0])).to.eql(postFields)
    })

    it("deletes associated posts when deleted", async () => {
      const postCount = await postRepo.count()
      await userRepo.delete({id: user.id })
      expect(await postRepo.count()).to.equal(postCount - 2)
    })

    it("has many followers", async () => {
      expect(user.followers.map(stripId)).to.eql(followersFields)
    })

    it("has many followees", async () => {
      expect(user.followees.map(stripId)).to.eql(followeesFields)
    })

    it("treats following as bidirectional", async () => {
      // TODO: investigate tree entities for graph-like relations: http://typeorm.io/#/tree-entities
      const follower = await userRepo.findOne({
        id: user.followers[0].id,
        relations: ["followees"],
      })
      expect(follower.followees).to.eql([pick(user, ["id", "username"])])
    })
  })
})
