'use strict';

exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};

// 解决跨域
exports.cors = {
  enable: true,
  package: 'egg-cors',
};

// token
exports.jwt = {
  enable: true,
  package: 'egg-jwt',
};
