'use strict';

module.exports = (sequelize, DataTypes) => {

  const following = sequelize.define('following', {
    followerId: DataTypes.INTEGER,
    followeeId: DataTypes.INTEGER
  }, {})

  following.associate = db => {
  }

  return following
}
