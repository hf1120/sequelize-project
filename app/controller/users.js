'use strict';

const Controller = require('egg').Controller;

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class UserDemoController extends Controller {
  async index() {
    const ctx = this.ctx;
    const query = { limit: toInt(ctx.query.limit), offset: toInt(ctx.query.offset) };
    // 生成token
    const token = await ctx.service.token.createToken({ id: 1 });
    ctx.body = {
      data: await ctx.model.UserDemo.findAll(query),
      token,
    };
  }

  async show() {
    const ctx = this.ctx;
    ctx.body = await ctx.model.UserDemo.findById(toInt(ctx.params.id));
  }

  async create() {
    const ctx = this.ctx;
    const { name, age } = ctx.request.body;
    const UserDemo = await ctx.model.UserDemo.create({ name, age });
    ctx.status = 200;
    ctx.body = UserDemo;
  }

  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const UserDemo = await ctx.model.UserDemo.findById(id);
    if (!UserDemo) {
      ctx.status = 404;
      return;
    }

    const { name, age } = ctx.request.body;
    await UserDemo.update({ name, age });
    ctx.body = UserDemo;
  }

  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const UserDemo = await ctx.model.UserDemo.findById(id);
    if (!UserDemo) {
      ctx.status = 404;
      return;
    }

    await UserDemo.destroy();
    ctx.status = 200;
  }
}

module.exports = UserDemoController;
