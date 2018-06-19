'use strict';

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: DataTypes.STRING,
    body: DataTypes.STRING
  }, {
    tableName: 'posts'
  })

  Post.associate = (db) => {
    Post.author = Post.belongsTo(db.User, { as: "author" })
  }

  return Post
}
