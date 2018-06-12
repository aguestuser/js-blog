import {User} from "../entity/user"
import * as Application from "koa"
const Router = require("koa-router")

export const connectRouter = (app: Application): void => {
  app.use(router.routes())
}

const router = new Router()

router.get("/", async ctx => {
  const userCount = await ctx.db.getRepository(User).count()
  ctx.body = { meta: `Hello world! There are ${userCount} users.` }
})
