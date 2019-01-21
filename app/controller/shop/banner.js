'use strict';

/* 跑马灯 */
const Controller = require('egg').Controller;

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class BannerController extends Controller {
  // 列表
  async index() {
    const ctx = this.ctx;
    const { limit = 10, page = 1 } = ctx.query;
    const limitTmp = toInt(limit);
    const pageTmp = toInt(page);
    const query = { limit: limitTmp, offset: (pageTmp - 1) * limitTmp };
    const Banners = ctx.model.Banner;
    const res = await Banners.findAndCountAll({
      ...query,
      order: [[ 'sort', 'ASC' ]],
    });
    if (!res) {
      ctx.helper.error(ctx, 200, '查询错误');
      return;
    }
    ctx.helper.success(ctx, { list: res.rows, pagination: { page: pageTmp, limit: limitTmp, total: res.count } }, '成功');
  }

  // 获取全部
  async all() {
    const ctx = this.ctx;
    const data = await ctx.model.Banner.findAll({ order: [[ 'sort', 'ASC' ]] });
    ctx.helper.success(ctx, data, '成功');
  }

  // 详情
  async show() {
    const ctx = this.ctx;
    const data = await ctx.model.Banner.findById(toInt(ctx.params.id));
    ctx.helper.success(ctx, data, '成功');
  }

  // 添加
  async create() {
    const ctx = this.ctx;
    const data = ctx.request.body;
    const Banners = ctx.model.Banner;
    await Banners.sync();
    const Banner = await ctx.model.Banner.create({ ...data });
    ctx.helper.success(ctx, Banner, '添加成功');
  }

  // 更新
  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const res = await ctx.model.Banner.findById(id);
    if (!res) {
      ctx.helper.error(ctx, 200, '当前数据不存在');
      return;
    }
    const data = ctx.request.body;
    await res.update({ ...data });
    ctx.helper.success(ctx, res, '编辑成功');
  }

  // 删除
  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const res = await ctx.model.Banner.findById(id);
    if (!res) {
      ctx.helper.error(ctx, 200, '当前数据不存在');
      return;
    }
    await res.destroy();
    ctx.helper.success(ctx, res, '成功');
  }
}

module.exports = BannerController;
