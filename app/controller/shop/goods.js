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
      include: [
        { model: ctx.model.Category, attributes: [ 'id', 'title' ], required: true },
      ],
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
    const data = await ctx.model.Goods.findById(toInt(ctx.params.id));
    ctx.helper.success(ctx, data, '成功');
  }

  // 添加
  async create() {
    const ctx = this.ctx;
    const { title, ...rest } = ctx.request.body;
    const Goodss = ctx.model.Goods;
    await Goodss.sync();
    const goods = await Goodss.findOne({
      where: { title },
    });
    if (goods && goods.length > 0) {
      ctx.helper.error(ctx, 200, '名称已存在');
      return;
    }
    const Goods = await ctx.model.Goods.create({ title, ...rest });
    ctx.helper.success(ctx, Goods, '成功');
  }

  // 更新
  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const { title, ...rest } = ctx.request.body;
    const Goods = ctx.model.Goods;
    const goods = await Goods.findById(id);
    if (!goods) {
      ctx.helper.error(ctx, 200, '当前数据不存在');
      return;
    }
    try {
      await goods.update({ title, ...rest });
      ctx.helper.success(ctx, Goods, '编辑成功');
    } catch (error) {
      const res = await Goods.findOne({
        where: { title, id: { $ne: id } },
      });
      if (res) {
        const { dataValues } = res;
        let ele = null;
        const dataValueKeys = Object.keys(dataValues);
        for (let i = 0; i < dataValueKeys.length; i++) {
          const item = dataValueKeys[i];
          switch (item) {
            case 'title':
              if (dataValues[item] === title) {
                ele = '名称已存在';
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
    const Goods = await ctx.model.Goods.findById(id);
    if (!Goods) {
      ctx.helper.error(ctx, 200, '当前数据不存在');
      return;
    }
    await Goods.destroy();
    ctx.helper.success(ctx, Goods, '成功');
  }

  // 推荐
  async channel() {
    const ctx = this.ctx;
    const { limit = 10, page = 1 } = ctx.query;
    const limitTmp = toInt(limit);
    const pageTmp = toInt(page);
    const query = { limit: limitTmp, offset: (pageTmp - 1) * limitTmp };
    const Goodss = ctx.model.Goods;
    const goods = await Goodss.findAndCountAll({
      ...query,
      where: { channel: '1' },
      order: [[ 'sort', 'ASC' ]],
      include: [
        { model: ctx.model.Category, attributes: [ 'id', 'title' ], required: true },
      ],
    });
    if (!goods) {
      ctx.helper.error(ctx, 200, '查询错误');
      return;
    }
    ctx.helper.success(ctx, { list: goods.rows, pagination: { page: pageTmp, limit: limitTmp, total: goods.count } }, '成功');
  }
}

module.exports = GoodsController;
