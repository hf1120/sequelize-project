'use strict';

/* 用户组功能 */
const Controller = require('egg').Controller;

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class UserGroupController extends Controller {
  // 列表
  async index() {
    const ctx = this.ctx;
    const { limit = 10, page = 1 } = ctx.query;
    const limitTmp = toInt(limit);
    const pageTmp = toInt(page);
    const query = { limit: limitTmp, offset: (pageTmp - 1) * limitTmp };
    const UserGroups = ctx.model.UserGroup;
    const userGroup = await UserGroups.findAndCountAll({
      ...query,
    });
    if (!userGroup) {
      ctx.helper.error(ctx, 200, '查询错误');
      return;
    }
    ctx.helper.success(ctx, { list: userGroup.rows, pagination: { page: pageTmp, limit: limitTmp, total: userGroup.count } }, '成功');

  }

  // 详情
  async show() {
    const ctx = this.ctx;
    ctx.body = await ctx.model.UserGroup.findById(toInt(ctx.params.id));
  }

  // 添加
  async create() {
    const ctx = this.ctx;
    const { abbreviation, title, ...rest } = ctx.request.body;
    const UserGroups = ctx.model.UserGroup;
    await UserGroups.sync();
    const userGroup = await UserGroups.findAll({
      where: {
        $or: [
          { abbreviation },
          { title },
        ],
      },
    });
    if (userGroup && userGroup.length > 0) {
      ctx.helper.error(ctx, 200, '标识或名称已存在');
      return;
    }
    const UserGroup = await ctx.model.UserGroup.create({ abbreviation, title, ...rest });
    ctx.helper.success(ctx, UserGroup, '成功');
  }

  // 更新
  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const UserGroup = await ctx.model.UserGroup.findById(id);
    if (!UserGroup) {
      ctx.helper.error(ctx, 200, '当前数据不存在');
      return;
    }
    const { abbreviation, title, description } = ctx.request.body;
    await UserGroup.update({ abbreviation, title, description });
    ctx.helper.success(ctx, UserGroup, '成功');
  }

  // 删除
  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const UserGroup = await ctx.model.UserGroup.findById(id);
    if (!UserGroup) {
      ctx.helper.error(ctx, 200, '当前数据不存在');
      return;
    }
    await UserGroup.destroy();
    ctx.helper.success(ctx, UserGroup, '成功');
  }
}

module.exports = UserGroupController;
