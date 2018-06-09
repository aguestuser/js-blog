import "reflect-metadata"
const Koa = require("koa")
const Router = require("koa-router")

const app = new Koa()
const router = new Router()

// TODO: move to configs
const PORT = process.env.PORT || 8081

router.get("/", async ctx => {
  ctx.body = { meta: "Hello world!" }
})

app.use(router.routes())

export const server = app.listen(PORT).on("error", console.error)
