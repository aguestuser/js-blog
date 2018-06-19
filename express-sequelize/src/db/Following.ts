import {Model, Op} from "sequelize"

import {DataTypes, Instance, Sequelize} from "sequelize"
import {BaseAttributes} from "../types/sequelize"

export type FollowingAttributes = BaseAttributes & {
  followerId: number,
  followeeId: number,
}

export type FollowingInstance = Instance<FollowingAttributes> & FollowingAttributes

export const followingFactory = (sq: Sequelize, dt: DataTypes) => {
  return sq.define<FollowingInstance, FollowingAttributes>("Following", {
    followerId: dt.INTEGER,
    followeeId: dt.INTEGER,
  }, {
    tableName: "followings",
    scopes: {
      forUser: (u) => ({
        where: {
          [Op.or]: [{
            followerId: u.id,
          }, {
            followeeId: u.id,
          }],
        },
      }),
    },
  })
}
