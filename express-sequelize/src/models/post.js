'use strict';

module.exports = (sequelize, DataTypes) => {
  const post = sequelize.define('post', {
    title: DataTypes.STRING,
    body: DataTypes.STRING
  }, {})

  post.associate = (db) => {
    post.author = post.belongsTo(db.user, { as: "author" })
  }

  return post
}