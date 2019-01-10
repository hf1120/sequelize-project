'use strict';

module.exports = app => {
  const goods = app.model.import('../domain/goods');
  return goods;
};
