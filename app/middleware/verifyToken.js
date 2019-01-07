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
    const userId = 1; // 去查数据库的用户id
    if (userId !== verifyResult.message.id) {
      ctx.helper.error(ctx, 401, '用户 ID 与 Token 不一致');
      return false;
    }
    await next();
    return true;
  };
};

