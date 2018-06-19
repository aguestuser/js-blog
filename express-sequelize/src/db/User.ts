import {DataTypes, IncludeAssociation, Instance, Model, Sequelize} from "sequelize"
import {BaseAttributes} from "../types/sequelize"
import {PostAttributes} from "./Post"

export interface UserAttributes extends BaseAttributes {
  username: string,
  email: string,
  posts?: PostAttributes[],
  followers?: UserAttributes[],
  followees?: UserAttributes[]
}
export type UserInstance = Instance<UserAttributes> & UserAttributes

export const userFactory =  (sq: Sequelize, dt: DataTypes) => {
  
  const User = sq.define<UserInstance, UserAttributes>("User", {
    username: dt.STRING,
    email: dt.STRING,
  }, {
    tableName: "users",
  })
  
  User.associate = db => {
    
    User.hasMany(db.Post, {
      as: "posts",
      hooks: true,
      onDelete: "CASCADE",
      foreignKey: "authorId",
    })
    
    User.hasMany(db.Following, {
      as: "followingsOf",
      onDelete: "CASCADE",
      foreignKey: "followeeId",
    })

    User.hasMany(db.Following, {
      as: "followingsBy",
      onDelete: "CASCADE",
      foreignKey: "followerId",
    })

    User.belongsToMany(
      db.User, {
        as: "followers",
        through: "followings",
        foreignKey: "followeeId",
        otherKey: "followerId",
      },
    )

    User.belongsToMany(
      db.User, {
        as: "followees",
        through: "followings",
        foreignKey: "followerId",
        otherKey: "followeeId",
      },
    )
  }
  
  // User.followings = (db, user) =>
  //   db.Following.scope({ method: ["forUser", user]})
  
  return User
}

// 'use strict';
//
// module.exports = (sequelize, DataTypes) => {
//
//   let User = sequelize.define('User', {
//     username: DataTypes.STRING,
//     email: DataTypes.STRING
//   }, {
//     tableName: "users"
//   })
//
//   User.associate = db => {
//
//     User.posts = User.hasMany(db.Post, {
//       as: "posts",
//       hooks: true,
//       onDelete: 'CASCADE',
//       foreignKey: 'authorId',
//     })
//
//     User.followingsOf = User.hasMany(db.Following, {
//       as: "followingsOf",
//       onDelete: 'CASCADE',
//       foreignKey: 'followeeId',
//     })
//
//     User.followingsBy = User.hasMany(db.Following, {
//       as: "followingsBy",
//       onDelete: 'CASCADE',
//       foreignKey: 'followerId',
//     })
//
//     User.followers = User.belongsToMany(
//       db.User, {
//         as: 'followers',
//         through: 'followings',
//         foreignKey: 'followeeId',
//         otherKey: 'followerId',
//       }
//     )
//
//     User.followees = User.belongsToMany(
//       db.User, {
//         as: 'followees',
//         through: 'followings',
//         foreignKey: 'followerId',
//         otherKey: 'followeeId',
//       }
//     )
//   }
//
//   User.followings = (db, user) =>
//     db.Following.scope({ method: ['forUser', user]})
//
//
//   return User
// }
