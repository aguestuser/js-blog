import {expect} from "chai"
import {run} from "../../main/server/run"
import request = require("supertest")
import {pick} from "lodash"

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
})
