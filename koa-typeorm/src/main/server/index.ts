import "reflect-metadata"
import cfg from "../../config"
import {connectRouter} from "../router"
import {Server} from "http"
import * as Application from "koa"
import {connectDb} from "../db"
import {connectLogger} from "../logger"
import {RunningApplication} from "../../type"

const Koa = require("koa")

export const run = async (): Promise<RunningApplication> => {
  const app: Application = new Koa()
  
  connectLogger(app)
  const db = await connectDb(app)
  connectRouter(app)
  const server = await connectServer(app)

  return {app, server, db }
}

const connectServer = async (app: Application): Promise<Server> =>
  app.listen(cfg.port).on("error", console.error)
