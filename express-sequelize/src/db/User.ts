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
  
  return User
}
