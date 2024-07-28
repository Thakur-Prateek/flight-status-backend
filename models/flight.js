'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Flight extends Model {
    static associate(models) {
      // define association here
    }
  }
  Flight.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    flight_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    departure_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    arrival_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gate: DataTypes.STRING,
    terminal: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Flight',
    tableName: 'flights',
    timestamps: false  // Disable timestamps
  });
  return Flight;
};
