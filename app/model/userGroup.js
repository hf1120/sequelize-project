'use strict';

module.exports = app => {
  const userGroup = app.model.import('../domain/userGroup');
  return userGroup;
};
