'use strict';

/* 用户成员功能 */
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
      include: [
        { model: ctx.model.UserGroup, attributes: [ 'id', 'title' ], required: true },
      ],
    });
    if (!user) {
      ctx.helper.error(ctx, 200, '查询错误');
      return;
    }
    ctx.helper.success(ctx, { list: user.rows, pagination: { page: pageTmp, limit: limitTmp, total: user.count } }, '成功');

  }

  // 详情
  async show(ctx) {
    const data = await ctx.model.User.findById(toInt(ctx.params.id));
    ctx.helper.success(ctx, data, '成功');
  }

  // 添加
  async create() {
    const ctx = this.ctx;
    const { phone, username, email, ...rest } = ctx.request.body;
    const Users = ctx.model.User;
    await Users.sync();
    try {
      const User = await ctx.model.User.create({ phone, username, email, ...rest, userType: 'C' });
      ctx.helper.success(ctx, User, '成功');
    } catch (error) {
      const res = await Users.findOne({
        where: {
          $or: [
            { phone },
            { username },
            { email },
          ],
        },
      });
      if (res) {
        const { dataValues } = res;
        let ele = null;
        const dataValueKeys = Object.keys(dataValues);
        for (let i = 0; i < dataValueKeys.length; i++) {
          const item = dataValueKeys[i];
          switch (item) {
            case 'username':
              if (dataValues[item] === username) {
                ele = '用户名已存在';
              }
              break;
            case 'phone':
              if (dataValues[item] === phone) {
                ele = '手机号已存在';
              }
              break;
            case 'email':
              if (dataValues[item] === email) {
                ele = '邮箱已存在';
              }
              break;
            default:
          }
          if (ele) {
            break;
          }
        }
        ctx.helper.error(ctx, 200, ele);
        return;
      }
      ctx.helper.error(ctx, 200, '未知错误');
    }
  }

  // 更新
  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const { phone, username, email, ...rest } = ctx.request.body;
    const Users = ctx.model.User;
    await Users.sync();
    const User = await Users.findById(id);
    if (!User) {
      ctx.helper.error(ctx, 200, '当前数据不存在');
      return;
    }
    try {
      await User.update({ phone, username, email, ...rest });
      ctx.helper.success(ctx, User, '成功');
    } catch (error) {
      const res = await Users.findOne({
        where: {
          $or: [
            { phone },
            { username },
            { email },
          ],
        },
      });
      if (res) {
        const { dataValues } = res;
        let ele = null;
        const dataValueKeys = Object.keys(dataValues);
        for (let i = 0; i < dataValueKeys.length; i++) {
          const item = dataValueKeys[i];
          switch (item) {
            case 'username':
              if (dataValues[item] === username) {
                ele = '用户名已存在';
              }
              break;
            case 'phone':
              if (dataValues[item] === phone) {
                ele = '手机号已存在';
              }
              break;
            case 'email':
              if (dataValues[item] === email) {
                ele = '邮箱已存在';
              }
              break;
            default:
          }
          if (ele) {
            break;
          }
        }
        ctx.helper.error(ctx, 200, ele);
        return;
      }
      ctx.helper.error(ctx, 200, '未知错误');
    }
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
