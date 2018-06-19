import {Op} from 'sequelize'

module.exports = (sequelize, DataTypes) => {

  const following = sequelize.define('following', {
    followerId: DataTypes.INTEGER,
    followeeId: DataTypes.INTEGER
  }, {
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

  return following
}
