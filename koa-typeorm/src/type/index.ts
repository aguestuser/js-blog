import * as Application from "koa"
import {Connection} from "typeorm"
import {Server} from "http"

export interface RunningApplication {
  app: Application,
  db?: Connection | void,
  server?: Server | void,
}
