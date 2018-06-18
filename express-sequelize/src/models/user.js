'use strict';

module.exports = (sequelize, DataTypes) => {

  let user = sequelize.define('user', {
    username: DataTypes.STRING,
    email: DataTypes.STRING
  }, {})

  user.associate = db => {
    user.posts = user.hasMany(db.post, {
      hooks: true,
      onDelete: 'CASCADE'
    })
  }

  return user
}