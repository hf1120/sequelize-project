'use strict';

module.exports = app => {
  const Goods = app.model.import('../domain/goods');
  const Category = app.model.import('../domain/category');
  Goods.belongsTo(Category, { foreignKey: 'category_id' });
  return Goods;
};
