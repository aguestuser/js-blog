import {DataTypes, Instance, Model, Sequelize} from 'sequelize'
import {BaseAttributes} from "../types/sequelize"
import {UserAttributes} from './User'

export type PostAttributes = BaseAttributes & {
  title: string,
  body: string,
  authorId?: string,
  author?: UserAttributes,
}

export type PostInstance = Instance<PostAttributes> & PostAttributes

export default (sq: Sequelize, dt: DataTypes) => {
  
  const Post = sq.define<PostInstance, PostAttributes>("Post", {
    title: dt.STRING,
    body: dt.STRING,
    authorId: dt.STRING,
  }, {
    tableName: "posts",
  })
  
  Post.associate = (db): void => {
    Post.belongsTo(db.User, { as: "author" })
  }
  
  return Post
}