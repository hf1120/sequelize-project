'use strict';

/* 商品功能 */
const Controller = require('egg').Controller;

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class GoodsController extends Controller {
  // 列表
  async index() {
    const ctx = this.ctx;
    const { limit = 10, page = 1 } = ctx.query;
    const limitTmp = toInt(limit);
    const pageTmp = toInt(page);
    const query = { limit: limitTmp, offset: (pageTmp - 1) * limitTmp };
    const Goodss = ctx.model.Goods;
    const goods = await Goodss.findAndCountAll({
      ...query,
    });
    if (!goods) {
      ctx.helper.error(ctx, 200, '查询错误');
      return;
    }
    ctx.helper.success(ctx, { list: goods.rows, pagination: { page: pageTmp, limit: limitTmp, total: goods.count } }, '成功');

  }

  // 详情
  async show() {
    const ctx = this.ctx;
    ctx.body = await ctx.model.Goods.findById(toInt(ctx.params.id));
  }

  // 添加
  async create() {
    const ctx = this.ctx;
    const { abbreviation, title, ...rest } = ctx.request.body;
    const Goodss = ctx.model.Goods;
    await Goodss.sync();
    const goods = await Goodss.findAll({
      where: {
        $or: [
          { abbreviation },
          { title },
        ],
      },
    });
    if (goods && goods.length > 0) {
      ctx.helper.error(ctx, 200, '标识或名称已存在');
      return;
    }
    const Goods = await ctx.model.Goods.create({ abbreviation, title, ...rest });
    ctx.helper.success(ctx, Goods, '成功');
  }

  // 更新
  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const Goods = await ctx.model.Goods.findById(id);
    if (!Goods) {
      ctx.helper.error(ctx, 200, '当前数据不存在');
      return;
    }
    const { abbreviation, title, description } = ctx.request.body;
    await Goods.update({ abbreviation, title, description });
    ctx.helper.success(ctx, Goods, '成功');
  }

  // 删除
  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const Goods = await ctx.model.Goods.findById(id);
    if (!Goods) {
      ctx.helper.error(ctx, 200, '当前数据不存在');
      return;
    }
    await Goods.destroy();
    ctx.helper.success(ctx, Goods, '成功');
  }
}

module.exports = GoodsController;
