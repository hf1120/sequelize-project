'use strict';

/* 菜单 */
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('menu', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    p_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    hideInBreadcrumb: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    hideInMenu: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
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
    tableName: 'menu',
  });
};
