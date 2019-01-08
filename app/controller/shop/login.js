'use strict';

const ms = require('ms');
const bcrypt = require('bcryptjs');
// const JSEncrypt = require('node-jsencrypt');
const moment = require('moment');
module.exports = app => {
  return class LoginController extends app.Controller {
    async create(ctx) {

      const { username, password, remember } = ctx.request.body;
      /* const jsEncrypt = new JSEncrypt();
      jsEncrypt.setPrivateKey(app.config.private_key);
      const _content = jsEncrypt.decrypt(content);
      if (!_content) {
        this.failure('验证失败!');
        return;
      }
      const json = JSON.parse(_content);
      const { username, password, remember } = json; */
      const user = await ctx.model.User.findOne({ where: { username } });
      if (!user) {
        ctx.helper.error(ctx, 200, '用户名不存在!');
        return;
      }
      if (user.status === 'C') {
        ctx.helper.error(ctx, 200, '该用户已禁止登录!');
        return;
      }
      const userLogin = await ctx.model.UserLogin.findOne({ where: { username } });
      if (!userLogin) {
        ctx.helper.error(ctx, 200, '用户登录信息不存在!');
        return;
      }
      const res = bcrypt.compareSync(password, userLogin.password);
      if (res) {
        ctx.session.uid = user.id;
        ctx.session.username = username;
        ctx.session.nickname = user.nickname;
        if (remember) {
          ctx.session.maxAge = ms('7d');
        } else {
          ctx.session.maxAge = ms('2h');
        }
        // 调用 rotateCsrfSecret 刷新用户的 CSRF token
        ctx.rotateCsrfSecret();
        // 记录登录记录
        await ctx.model.UserLoginL.sync();
        await ctx.model.UserLoginL.create({ uid: user.id, username, loginLogType: 'L' });
        user.update({
          loginNum: user.loginNum + 1,
          lastLoginTime: moment(),
        });
        const token = await ctx.service.token.createToken({ uid: user.id });
        ctx.helper.success(ctx, { token, uid: user.id, expires_in: ms('1d') }, '登录成功!');
      } else {
        ctx.helper.error(ctx, 200, '密码错误!');
      }
    }
  };
};
