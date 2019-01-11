'use strict';

/* 分类功能 */
const Controller = require('egg').Controller;

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}


function parseList(list) {
  // 创建一个对象命名为map
  const map = {};
  // 通过遍历把list中的元素放到map对象中
  list.forEach(item => {
    if (!map[item.id]) {
      // 核心步骤1：map中的'item.id'属性指向list数组中的对象元素
      map[item.id] = item;
    }
  });
  // 再次遍历为了对map属性所指的对象进行处理
  list.forEach(item => {
    // 过滤父级id不是null的元素
    if (item.p_id !== null) {
      // map[item.p_id]为该元素的父级元素
      map[item.p_id].dataValues.children ? map[item.p_id].dataValues.children.push(item) : map[item.p_id].dataValues.children = [ item ];
    }
  });
  // 过滤后仅剩下根节点
  return list.filter(item => {
    if (item.p_id === null) {
      return item;
    }
    return null;
  });
}

class CategoryController extends Controller {
  // 列表
  async index() {
    const ctx = this.ctx;
    const { limit = 10, page = 1 } = ctx.query;
    const limitTmp = toInt(limit);
    const pageTmp = toInt(page);
    const query = { limit: limitTmp, offset: (pageTmp - 1) * limitTmp };
    const Categorys = ctx.model.Category;
    const res = await Categorys.findAndCountAll({
      ...query,
      where: {
        p_id: null,
      },
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
    const data = await ctx.model.Category.findAll();
    const list = parseList(data);
    ctx.helper.success(ctx, list, '成功');
  }

  // 详情
  async show() {
    const ctx = this.ctx;
    const data = await ctx.model.Category.findById(toInt(ctx.params.id));
    ctx.helper.success(ctx, data, '成功');
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
    ctx.helper.success(ctx, Category, '成功');
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
    ctx.helper.success(ctx, res, '成功');
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
    const resChild = await ctx.model.Category.findOne({ where: { p_id: id } });
    if (resChild) {
      ctx.helper.error(ctx, 200, '含有子元素');
      return;
    }
    await res.destroy();
    ctx.helper.success(ctx, res, '成功');
  }
}

module.exports = CategoryController;
