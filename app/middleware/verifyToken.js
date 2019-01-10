'use strict';

/* 验证token是否正确 options app */
module.exports = () => {
  return async (ctx, next) => {
    const token = ctx.helper.getAccessToken(ctx);
    const verifyResult = await ctx.service.token.verifyToken(token);
    if (!verifyResult.verify) {
      ctx.helper.error(ctx, 401, verifyResult.message);
      return false;
    }
    const userLogin = await ctx.model.UserLogin.findOne({ where: { uid: verifyResult.message.uid } });
    const { loginLogType, token: tokenTmp } = userLogin;
    if (loginLogType !== 'L' || tokenTmp !== token.substr(token.length - 10)) {
      ctx.helper.error(ctx, 401, 'token已过期');
      return false;
    }
    await next();
    return true;
  };
};

