'use strict';

module.exports = (sequelize, DataTypes) => {
  const post = sequelize.define('post', {
    title: DataTypes.STRING,
    body: DataTypes.STRING
  }, {})

  post.associate = (db) => {
    post.user = post.belongsTo(db.user)
  }

  return post
}