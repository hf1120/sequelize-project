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
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: '0',
    },
  },
  {
    tableName: 'userlogin',
  });
};
