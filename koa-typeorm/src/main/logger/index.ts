export const connectLogger = (app): void => {
  app.context.logger = loggers[process.env.NODE_ENV]
  app.use(async (ctx, next) => {
    const start = Date.now()
    ctx.logger.log(`--- received request: ${ctx.method} ${ctx.url}`)

    await next()

    const elapsed = Date.now() - start
    ctx.logger.log(`--- processed request in ${elapsed} ms`)
  })
}

const loggers = {
  dev: console,
  test: {
    log: (_: string): void => null,
    error: console.error,
  },
}
