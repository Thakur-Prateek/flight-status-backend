'use strict';
module.exports = (sequelize, DataTypes) => {
  const Flight = sequelize.define('Flight', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    flight_number: DataTypes.STRING,
    departure_time: DataTypes.DATE,
    arrival_time: DataTypes.DATE,
    status: DataTypes.STRING,
    gate: DataTypes.STRING,
    terminal: DataTypes.STRING,
    boarding_time: DataTypes.DATE,
    destination: DataTypes.STRING
  }, {
    underscored: false,
    freezeTableName: true,
    tableName: 'flights'
  });

  Flight.associate = function(models) {
    Flight.belongsTo(models.User, {
      foreignKey: 'user_id'
    });
  };

  return Flight;
};
