'use strict';

module.exports = app => {
  const Menu = app.model.import('../domain/menu');
  return Menu;
};
