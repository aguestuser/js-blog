'use strict';
module.exports = (sequelize, DataTypes) => {

  let User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});

  User.associate = function(models) {
    // associations can be defined here
  };

  return User;
};