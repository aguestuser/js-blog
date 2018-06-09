import "reflect-metadata"
import {expect} from "chai"
import {User} from "../main/entity/user"
import {forEach, get, clone} from "lodash"
import {createConnection, getRepository} from "typeorm"
import {stripId} from "./helpers/db"
import {Post} from "../main/entity/post"
import {userFields} from "./fixtures/users"
import {postFields} from "./fixtures/posts"

describe("User entity", () => {
  let connection, userRepo, postRepo

  before(async () => {
    // TODO: make a test config that doesn't log all sql, pass it here
    connection = await createConnection()
    userRepo = getRepository(User)
    postRepo = getRepository(Post)
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
    beforeEach(async () => {
      await userRepo.save({
        ...clone(userFields),
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
