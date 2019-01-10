'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const verifyToken = app.middleware.verifyToken();
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // router.resources('users', '/users', verifyToken, controller.users);
  app.resources('signIn', '/signIn', app.controller.shop.signIn);
  app.resources('login', '/login', app.controller.shop.login);
  router.post('/logout', app.controller.shop.account.logout);

  // 用户列表
  app.resources('user', '/users', verifyToken, app.controller.shop.user);
  app.resources('userGroup', '/usergroups', verifyToken, app.controller.shop.userGroup);
  // router.resources('users', '/users', app.jwt, controller.users);
  // router.resources('users', '/haha', controller.users);
};
