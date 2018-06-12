import {User} from "../entity/user"
import * as Application from "koa"
const Router = require("koa-router")

export const connectRouter = (app: Application): void => {
  app.use(router.routes())
}

const router = new Router()

router
  .get("/", async ctx => {
    const userCount = await ctx.db.getRepository(User).count()
    ctx.body = { meta: `Hello world! There are ${userCount} users.` }
  })
  .get("/users/:id", async ctx => {
    const user = await ctx.db.getRepository(User).findOne({
      id: ctx.params.id ,
      relations: ["posts"],
    })
    ctx.body = {
      data: {
        user: {
          ...user,
          posts: user.posts.map(
            p => `localhost:8081/users/${user.id}/posts/${p.id}`,
          ),
        },
      },
    }
  })
