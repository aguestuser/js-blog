import "reflect-metadata"
import {expect} from "chai"
import {forEach, omit, clone} from "lodash"
import {createConnection, getRepository} from "typeorm"
import {Post} from "../main/entity/post"
import {User} from "../main/entity/user"

describe("Post entity", () => {
  const userFields = { username: "pynchon" }
  const postFields = { title: "gravity's rainbow...", body: "a screaming came across the sky" }
  let connection, postRepo, userRepo

  before(async () => {
    // TODO: make a test config that doesn't log all sql, pass it here
    connection = await createConnection()
    postRepo = getRepository(Post)
    userRepo = getRepository(User)
    await postRepo.delete({})
    expect(await postRepo.count()).to.eql(0)
  })

  after(async () => await connection.close())

  it("has correct fields", async () => {
    const post = await postRepo.save(postFields)
    forEach(postFields, (v, k) => expect(post[k]).to.eql(v))
  })

  describe("associations", () => {
    before(async () => {
      const author = await userRepo.save(clone(userFields))
      await postRepo.save(
        postRepo.create({...postFields, author })
      )
    })

    it("has one author", async () => {
      const post = await postRepo.findOne({...postFields, relations: ["author"] })
      expect(omit(post.author, ["id"])).to.eql(userFields)
    })
  })
})
