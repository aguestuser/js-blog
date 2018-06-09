import {expect} from "chai"
import {server} from "../../main/server"
import request = require("supertest")
import {pick} from "lodash"

describe("server", () => {
  after(() => server.close())

  it("says hello", async () => {
    const resp = await request(server).get("/")
    expect(pick(resp, ["status", "type", "body"]))
    .to.eql({
      status: 200,
      type: "application/json",
      body: { meta: "Hello world!" },
    })
  })
})
