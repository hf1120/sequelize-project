'use strict';

module.exports = app => {
  const Banner = app.model.import('../domain/banner');
  return Banner;
};
