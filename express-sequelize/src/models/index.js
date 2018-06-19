'use strict';

import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'
import {values, forEach} from "lodash"

const env       = process.env.NODE_ENV || 'development'
const config    = require(__dirname + '/../config/db.json')[env]

const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config)

// helpers --v

const isModel = (file) =>
  (file.indexOf('.') !== 0) &&
  (file !== path.basename(__filename)) &&
  (file.slice(-3) === '.js')

const addModel = (db, file) => {
  const model = sequelize['import'](path.join(__dirname, file))
  db[model.name] = model
  return db
}

// ^--- helpers

const db = fs
  .readdirSync(__dirname)
  .filter(isModel)
  .reduce(addModel, {})

forEach(values(db), model => model.associate && model.associate(db))

module.exports = {
  ...db,
  sequelize,
  Sequelize
}
