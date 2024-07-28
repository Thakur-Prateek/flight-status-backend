'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('notifications', 'createdat', 'createdAt');
    await queryInterface.renameColumn('notifications', 'updatedat', 'updatedAt');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('notifications', 'createdAt', 'createdat');
    await queryInterface.renameColumn('notifications', 'updatedAt', 'updatedat');
  }
};
