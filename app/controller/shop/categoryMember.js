'use strict';

/* 分类功能 */
const Controller = require('egg').Controller;

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class CategoryController extends Controller {
  // 列表
  async index() {
    const ctx = this.ctx;
    const { id } = ctx.params;
    const Categorys = ctx.model.Category;
    const res = await Categorys.findAll({
      where: {
        p_id: id,
      },
    });
    if (!res) {
      ctx.helper.error(ctx, 200, '查询错误');
      return;
    }
    ctx.helper.success(ctx, res, '获取成功');
  }

  // 详情
  async show() {
    const ctx = this.ctx;
    const data = await ctx.model.Category.findById(toInt(ctx.params.id));
    ctx.helper.success(ctx, data, '获取成功');
  }

  // 添加
  async create() {
    const ctx = this.ctx;
    const { title, ...rest } = ctx.request.body;
    const Categorys = ctx.model.Category;
    await Categorys.sync();
    const res = await Categorys.findOne({ where: { title } });
    if (res && res.length > 0) {
      ctx.helper.error(ctx, 200, '名称已存在');
      return;
    }
    const Category = await ctx.model.Category.create({ title, ...rest });
    ctx.helper.success(ctx, Category, '添加成功');
  }

  // 更新
  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const res = await ctx.model.Category.findById(id);
    if (!res) {
      ctx.helper.error(ctx, 200, '当前数据不存在');
      return;
    }
    const { title, description } = ctx.request.body;
    await res.update({ title, description });
    ctx.helper.success(ctx, res, '编辑成功');
  }

  // 删除
  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const res = await ctx.model.Category.findById(id);
    if (!res) {
      ctx.helper.error(ctx, 200, '当前数据不存在');
      return;
    }
    await res.destroy();
    ctx.helper.success(ctx, res, '删除成功');
  }
}

module.exports = CategoryController;
