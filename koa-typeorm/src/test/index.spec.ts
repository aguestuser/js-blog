import {expect} from "chai"
import {main} from "../main"

describe("app", () => {
  it("says hello", () => {
    expect(main()).to.equal("Hello world!")
  })
})
