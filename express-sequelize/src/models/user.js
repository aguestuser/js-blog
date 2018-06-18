'use strict';

module.exports = (sequelize, DataTypes) => {

  let user = sequelize.define('user', {
    username: DataTypes.STRING,
    email: DataTypes.STRING
  }, {})

  user.associate = db => {

    user.posts = user.hasMany(db.post, {
      hooks: true,
      onDelete: 'CASCADE',
      foreignKey: 'authorId',
    })

    user.followingsOf = user.hasMany(db.following, {
      as: "followingsOf",
      onDelete: 'CASCADE',
      foreignKey: 'followeeId',
    })

    user.followingsBy = user.hasMany(db.following, {
      as: "followingsBy",
      onDelete: 'CASCADE',
      foreignKey: 'followerId',
    })

    user.followers = user.belongsToMany(
      db.user, {
        as: 'followers',
        through: 'followings',
        foreignKey: 'followeeId',
        otherKey: 'followerId',
      }
    )

    user.followees = user.belongsToMany(
      db.user, {
        as: 'followees',
        through: 'followings',
        foreignKey: 'followerId',
        otherKey: 'followeeId',
      }
    )
  }

  return user
}
