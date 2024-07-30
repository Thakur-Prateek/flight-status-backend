'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    mobile_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    pushSubscription: DataTypes.JSON
  }, {
    underscored: false,
    freezeTableName: true,
    tableName: 'users'
  });

  User.associate = function(models) {
    User.hasMany(models.Flight, {
      foreignKey: 'user_id'
    });
    User.hasOne(models.Notification, {
      foreignKey: 'user_id'
    });
  };

  return User;
};
