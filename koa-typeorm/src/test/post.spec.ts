import "reflect-metadata"
import {expect} from "chai"
import {forEach, omit, clone} from "lodash"
import {createConnection, getRepository} from "typeorm"
import {Post} from "../main/entity/post"
import {User} from "../main/entity/user"
import {postFields} from "./fixtures/posts"
import {userFields} from "./fixtures/users"
import {stripId} from "./helpers/db"

describe("Post entity", () => {
  let connection, postRepo, userRepo

  before(async () => {
    // TODO: make a test config that doesn't log all sql, pass it here
    connection = await createConnection()
    postRepo = getRepository(Post)
    userRepo = getRepository(User)
    expect(await postRepo.count()).to.eql(0)
    expect(await userRepo.count()).to.eql(0)
  })

  afterEach(async () => {
    await postRepo.delete({})
    await userRepo.delete({})
  })

  after(async () => {
    await connection.close()
  })

  it("has correct fields", async () => {
    const post = await postRepo.save(clone(postFields))
    forEach(postFields, (v, k) => expect(post[k]).to.eql(v))
  })

  describe("associations", () => {
    beforeEach(async () => {
      const author = await userRepo.save(clone(userFields))
      await postRepo.save(postRepo.create({...clone(postFields), author }))
    })

    it("has one author", async () => {
      const post = await postRepo.findOne({ ...postFields, relations: ["author"] })
      expect(stripId(post.author)).to.eql(userFields)
    })
  })
})
