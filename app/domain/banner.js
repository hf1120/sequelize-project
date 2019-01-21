'use strict';

/* 跑马灯 */
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('banner', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    pic: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    thumb: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: { // 0：下架 1：上架
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: '1',
    },
    sort: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '1',
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
    tableName: 'banner',
  });
};
