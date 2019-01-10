'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('userlogin', {
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true,
    },
    uid: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      unique: true,
      fields: [ 'uid' ],
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    loginLogType: { // L：登录 O：登出
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: 'O',
    },
    status: { // 0：冻结 1：正常
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: '0',
    },
    token: { // 截取token后10位
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
  },
  {
    tableName: 'userlogin',
  });
};
