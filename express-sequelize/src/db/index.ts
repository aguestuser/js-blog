"use strict"

import * as Sequelize from "sequelize"
import {followingFactory} from "./Following"
import {postFactory} from "./Post"
import {userFactory} from "./User"

const env       = process.env.NODE_ENV || "development"
const config    = require(__dirname + "/../config/db.json")[env]

export const initDb = () => {
  
  const sequelize = config.use_env_variable
    ? new Sequelize(process.env[config.use_env_variable], config)
    : new Sequelize(config.database, config.username, config.password, config)

  const db = {
    Following: followingFactory(sequelize, Sequelize),
    Post: postFactory(sequelize, Sequelize),
    User: userFactory(sequelize, Sequelize),
  }
  
  Object
    .values(db)
    .forEach((model: any) => model.associate && model.associate(db))
  
  return {
    ...db,
    sequelize,
    Sequelize,
  }
}

export default initDb()
