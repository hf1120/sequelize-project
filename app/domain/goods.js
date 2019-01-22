'use strict';

/* 商品 */
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('goods', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    category_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    pic: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    thumb: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: { // 0：下架 1：上架
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: '1',
    },
    channel: { // 0：不推荐 1：推荐
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: '0',
    },
    anum: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    sort: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '1',
    },
    description: {
      type: DataTypes.STRING(255),
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
    tableName: 'goods',
  });
};
