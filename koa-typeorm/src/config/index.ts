import {get} from "lodash"

const common = {
  port: process.env.PORT || 8081,
  hostname: "localhost",
}

const dev = {
  ...common,
  dbName: "dev",
}

const test = {
  ...common,
  dbName: "test",
}

const configs = { dev, test }

if (!process.env.NODE_ENV) {
  console.error("OOOPS! NODE_ENV not set. Cannot configure application.")
  process.exit(1)
}

export default get(configs, [process.env.NODE_ENV])
