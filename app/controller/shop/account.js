'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class AccountController extends Controller {
  // 登出
  async logout() {
    const { ctx } = this;
    try {
      const token = ctx.helper.getAccessToken(ctx);
      const verifyResult = await ctx.service.token.verifyToken(token);
      const userLogin = await ctx.model.UserLogin.findOne({ where: { uid: verifyResult.message.uid } });
      if (userLogin) {
        userLogin.update({
          loginLogType: 'O',
          token: '',
          updated_at: moment(),
        });
      }
      ctx.helper.success(ctx, {}, '登出成功!');
    } catch (error) {
      ctx.helper.success(ctx, {}, '登出成功!');
    }
  }
}

module.exports = AccountController;
