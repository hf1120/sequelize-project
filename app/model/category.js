'use strict';

module.exports = app => {
  const Category = app.model.import('../domain/category');
  return Category;
};
