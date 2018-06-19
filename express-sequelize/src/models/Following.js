import {Op} from 'sequelize'

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Following', {
    followerId: DataTypes.INTEGER,
    followeeId: DataTypes.INTEGER
  },{
    tableName: "followings",
    scopes: {
      forUser: (u) => ({
        where: {
          [Op.or]: [{
            followerId: u.id,
          }, {
            followeeId: u.id,
          }]
        }
      }),
    }
  })
}
