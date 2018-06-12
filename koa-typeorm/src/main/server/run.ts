import "reflect-metadata"
import cfg from "../../config"
const Koa = require("koa")
const Router = require("koa-router")

import {User} from "../entity/user"
import {Connection, createConnection} from "typeorm"
import {Server} from "http"

export interface RunningServer {
  db: Connection,
  server: Server,
}

export const run = async (): Promise<RunningServer> => {

  const app = new Koa()
  console.log("server running")

  try {
    console.log(`connecting to db ${cfg.dbName}...`)
    app.context.db = await createConnection(cfg.dbName)
  } catch {
    console.error("OOPS! could not connect to db. exiting.")
    process.exit(1)
  }
  console.log(`... connected to db: ${cfg.dbName}`)

  // logging
  app.use(async (ctx, next) => {
    const start = Date.now()
    console.log(`received request: ${ctx.method} ${ctx.url}`)

    await next()

    const elapsed = Date.now() - start
    console.log(`processed request in ${elapsed} ms`)
  })

// routes

  const router = new Router()

  router.get("/", async ctx => {
    const userCount = await ctx.db.getRepository(User).count()
    ctx.body = { meta: `Hello world! There are ${userCount} users.` }
  })

  app.use(router.routes())

  const server = await app.listen(cfg.port).on("error", console.error)
  return {server, db: app.context.db }
}
