'use strict';

/* 用户表 */
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    group_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    username: { // 用户名
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    nickname: { // 别名
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    userType: { // 用户类型 A:管理员 C:普通用户
      type: DataTypes.CHAR(1),
      allowNull: false,
    },
    status: { // 0：冻结 1：正常
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: '1',
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      fields: [ 'email' ],
    },
    phone: {
      type: DataTypes.STRING(100),
      allowNull: true,
      fields: [ 'phone' ],
    },
    qq: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    weChat: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    nationality: { // 国籍
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    birthdate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    marriage: { // 婚姻
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: '0',
    },
    gender: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: '0',
    },
    education: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: '0',
    },
    province: { // 省
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    city: { // 市
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    town: { // 镇
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    addr: { // 详细地址
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    loginNum: {
      type: DataTypes.INTEGER(11),
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
    tableName: 'user',
  });
};
