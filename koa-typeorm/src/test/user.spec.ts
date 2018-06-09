import "reflect-metadata"
import {expect} from "chai"
import {User} from "../main/entity/user"
import {forEach, get, omit, clone} from "lodash"
import {createConnection, getRepository} from "typeorm"
import {stripId} from "./helpers/db"
import {Post} from "../main/entity/post"

describe("User entity", () => {
  const userFields = { username: "pynchon" }
  const postFields = { title: "gravity's rainbow...", body: "a screaming came across the sky" }

  let connection, userRepo, postRepo

  before(async () => {
    // TODO: make a test config that doesn't log all sql, pass it here
    connection = await createConnection()
    userRepo = getRepository(User)
    postRepo = getRepository(Post)
    await userRepo.delete({})
    expect(await userRepo.count()).to.eql(0)
  })

  after(async () => await connection.close())

  it("has correct fields", async () => {
    const user = await userRepo.save(userFields)
    forEach(userFields, (v, k) => expect(get(user, k)).to.eql(v))
  })

  describe("associations", () => {
    before(async () => {
      await userRepo.save({
        ...userFields,
        posts: [clone(postFields)],
      })
    })

    it("has many posts", async () => {
      const user = await userRepo.findOne({...userFields, relations: ["posts"] })
      expect(stripId(user.posts[0])).to.eql(postFields)
    })

    it("deletes associated posts when deleted", async () => {
      const postCount = await postRepo.count()
      await userRepo.delete(userFields)
      expect(await postRepo.count()).to.equal(postCount - 1)
    })
  })
})
