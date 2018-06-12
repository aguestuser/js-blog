import {expect} from "chai"
import {run} from "../../main/server"
import request = require("supertest")
import {pick, clone} from "lodash"
import {User} from "../../main/entity/user"
import {userFields} from "../fixtures/users"
import {postFields} from "../fixtures/posts"

describe("server", () => {
  let db, server
  before (async () => ({db, server} = await run()))
  after( async () => { db.close(); server.close() })

  it("says hello", async () => {
    const resp = await request(server).get("/")
    expect(pick(resp, ["status", "type", "body"]))
    .to.eql({
      status: 200,
      type: "application/json",
      body: { meta: "Hello world! There are 0 users." },
    })
  })
  
  describe("user router", () => {
    let user
    before(async () => {
      user = await db.getRepository(User).save({
        ...clone(userFields),
        posts: [clone(postFields)],
      })
    })
    after(async () => await db.getRepository(User).delete(userFields))

    it("returns a user and their posts", async () => {
      const response = await request(server).get(`/users/${user.id}`)
      expect(response.body).to.eql({
        data: {
          user: {
            ...userFields,
            id: user.id,
            posts: user.posts.map(
              post => `localhost:8081/users/${user.id}/posts/${post.id}`,
            ),
          },
        },
      })
    })
  })
})
