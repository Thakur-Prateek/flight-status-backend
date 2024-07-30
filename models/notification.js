'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    notify_sms: DataTypes.BOOLEAN,
    notify_email: DataTypes.BOOLEAN,
    notify_whatsapp: DataTypes.BOOLEAN,
  }, {
    underscored: false,
    freezeTableName: true,
    tableName: 'notifications'
  });

  Notification.associate = function(models) {
    Notification.belongsTo(models.User, {
      foreignKey: 'user_id'
    });
  };

  return Notification;
};
