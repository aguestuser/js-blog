import cfg from "../../config"
import {Connection, createConnection} from "typeorm"

export const connectDb = async (app): Promise<Connection|void> => {
  const db = await createConnection(cfg.dbName).catch(err => {
    console.error("OOPS! could not connect to db. exiting.")
    console.error(err)
    process.exit(1)
  })
  app.context.logger.log(`--- server running, connected to db ${cfg.dbName}`)
  app.context.db = db
  return db
}
