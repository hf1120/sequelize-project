'use strict';

const Controller = require('egg').Controller;

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class UserController extends Controller {
  // 列表
  async index() {
    const ctx = this.ctx;
    const { limit = 10, page = 1 } = ctx.query;
    const limitTmp = toInt(limit);
    const pageTmp = toInt(page);
    const query = { limit: limitTmp, offset: (pageTmp - 1) * limitTmp };
    const Users = ctx.model.User;
    const user = await Users.findAndCountAll({
      ...query,
    });
    if (!user) {
      ctx.helper.error(ctx, 200, '查询错误');
      return;
    }
    ctx.helper.success(ctx, { list: user.rows, pagination: { page: pageTmp, limit: limitTmp, total: user.count } }, '成功');

  }

  // 详情
  async show() {
    const ctx = this.ctx;
    ctx.body = await ctx.model.User.findById(toInt(ctx.params.id));
  }

  // 添加
  async create() {
    const ctx = this.ctx;
    const { phone, username, email, ...rest } = ctx.request.body;
    const Users = ctx.model.User;
    await Users.sync();
    const user = await Users.findAll({
      where: {
        $or: [
          { phone },
          { username },
          { email },
        ],
      },
    });
    if (user && user.length > 0) {
      ctx.helper.error(ctx, 200, '数据重复');
      return;
    }
    const User = await ctx.model.User.create({ phone, username, email, ...rest, userType: 'C' });
    ctx.helper.success(ctx, User, '成功');
  }

  // 更新
  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const User = await ctx.model.User.findById(id);
    if (!User) {
      ctx.helper.error(ctx, 200, '当前数据不存在');
      return;
    }
    const { abbreviation, title, description } = ctx.request.body;
    await User.update({ abbreviation, title, description });
    ctx.helper.success(ctx, User, '成功');
  }

  // 删除
  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const User = await ctx.model.User.findById(id);
    if (!User) {
      ctx.helper.error(ctx, 200, '当前数据不存在');
      return;
    }
    await User.destroy();
    ctx.helper.success(ctx, User, '成功');
  }
}

module.exports = UserController;
