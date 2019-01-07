'use strict';

/**
 * @description 注册功能
 */

// const JSEncrypt = require('node-jsencrypt');
module.exports = app => {
  return class SignInController extends app.Controller {
    async create(ctx) {
      const { username, password } = ctx.request.body;
      // const jsEncrypt = new JSEncrypt();
      // jsEncrypt.setPrivateKey(app.config.private_key);
      // const _content = jsEncrypt.decrypt(content);
      // if (!_content) {
      //   this.failure('验证失败！');
      //   return;
      // }
      // const json = JSON.parse(_content);
      // const { username, password } = json;
      // if (code !== ctx.session.captcha) {
      //   this.failure('验证码错误!');
      //   return;
      // }
      await ctx.model.User.sync();

      const user = await ctx.model.User.findOne({ where: { username } });
      if (user) {
        ctx.helper.error(ctx, 200, '用户名已存在！');
        return;
      }
      await ctx.model.User.add(username, password);
      ctx.helper.success(ctx, 200, '注册成功!');
    }
  };
};
