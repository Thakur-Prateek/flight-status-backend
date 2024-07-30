'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('flights', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      flight_number: {
        type: Sequelize.STRING
      },
      departure_time: {
        type: Sequelize.DATE
      },
      arrival_time: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.STRING
      },
      gate: {
        type: Sequelize.STRING
      },
      terminal: {
        type: Sequelize.STRING
      },
      boarding_time: {
        type: Sequelize.DATE
      },
      destination: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('flights');
  }
};
