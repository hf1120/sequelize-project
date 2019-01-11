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

  // 上传
  router.post('/users/:id/avatar', app.controller.shop.upload.index);

  // 用户列表
  app.resources('user', '/users', verifyToken, app.controller.shop.user);
  app.resources('userGroup', '/usergroups', verifyToken, app.controller.shop.userGroup);

  // 分类
  app.get('/categorys/all', verifyToken, app.controller.shop.category.all);
  app.resources('category', '/categorys', verifyToken, app.controller.shop.category);
  app.resources('categoryMember', '/category/:id/members', verifyToken, app.controller.shop.categoryMember);
  app.resources('categoryMember', '/category/members', verifyToken, app.controller.shop.categoryMember);

  // 商品
  app.resources('goods', '/goods', verifyToken, app.controller.shop.goods);

  // router.resources('users', '/users', app.jwt, controller.users);
  // router.resources('users', '/haha', controller.users);
};
