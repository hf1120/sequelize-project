'use strict';

// node.js 文件操作对象
const fs = require('fs');
// node.js 路径操作对象
const path = require('path');
const Controller = require('egg').Controller;
// 故名思意 异步二进制 写入流
const awaitWriteStream = require('await-stream-ready').write;
// 管道读入一个虫洞。
const sendToWormhole = require('stream-wormhole');
const md5 = require('md5');

class UploadComment extends Controller {
  async upload() {
    const ctx = this.ctx;
    // egg-multipart 已经帮我们处理文件二进制对象
    const stream = await ctx.getFileStream();
    const { fields: { model } } = stream;
    // 允许传入的model类型
    const models = [ 'uploads', 'goods', 'other' ];
    if (models.indexOf(model) === -1) {
      ctx.helper.error(ctx, 200, '请输入正确的model');
      return;
    }
    const filename = md5(stream.filename) + path
      .extname(stream.filename)
      .toLocaleLowerCase();

    // 文件生成绝对路径
    await new Promise((resolve, reject) => {
      // 判断文件夹是否存在
      fs.readdir('app/public', (err, res) => {
        if (err) {
          reject({ code: 10, msg: '失败' });
          return;
        }
        if (res.indexOf(model) < 0) {
          fs.mkdir(`app/public/${model}`, function(err) {
            if (err) {
              reject({ code: 10, msg: '失败' });
              return false;
            }
            resolve({ code: 0, msg: '成功' });
            return;
          });
        }
        resolve({ code: 0, msg: '成功' });
      });
    }).then(({ code }) => {
      if (code === 0) {
        const target = path.join(this.config.baseDir, `app/public/${model}`, filename);
        // 生成一个文件写入 文件流
        const writeStream = fs.createWriteStream(target);
        try {
          // 异步把文件流 写入
          awaitWriteStream(stream.pipe(writeStream));
        } catch (err) {
          // 如果出现错误，关闭管道
          sendToWormhole(stream);
          throw err;
        }
        const url = `${this.config.baseUrl}/public/${model}/${filename}`;
        ctx.helper.success(ctx, { url }, '成功');
      } else {
        ctx.helper.error(ctx, 200, '未知错误');
      }
    });
  }
}

module.exports = UploadComment;
