'use strict';

module.exports = app => {
  const category = app.model.import('../domain/category');
  return category;
};
