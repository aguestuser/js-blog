'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'posts',
      'userId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'cascade',
      },
    )
  },
  
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('posts', 'userId')
  }
}