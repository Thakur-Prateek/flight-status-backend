'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      // define association here
    }
  }
  Notification.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    notify_sms: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    notify_email: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    notify_whatsapp: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    notify_browser: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    timestamps: false  // Disable timestamps
  });
  return Notification;
};
