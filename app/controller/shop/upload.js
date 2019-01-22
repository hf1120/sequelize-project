'use strict';

// node.js 文件操作对象
const fs = require('fs');
// node.js 路径操作对象
const path = require('path');
// egg.js Controller
const Controller = require('egg').Controller;
// 故名思意 异步二进制 写入流
const awaitWriteStream = require('await-stream-ready').write;
// 管道读入一个虫洞。
const sendToWormhole = require('stream-wormhole');
// 当然你也可以不使用这个 哈哈 个人比较赖
// 还有我们这里使用了egg-multipart
const md5 = require('md5');

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class UploadController extends Controller {

  async index() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const User = await ctx.model.User.findById(id);
    if (!User) {
      ctx.helper.error(ctx, 200, '当前数据不存在');
      return;
    }
    try {
      // egg-multipart 已经帮我们处理文件二进制对象
      const stream = await ctx.getFileStream();
      // 新建一个文件名
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
          if (res.indexOf('uploads') < 0) {
            fs.mkdir('app/public/uploads', function(err) {
              if (err) {
                reject({ code: 10, msg: '失败' });
                return false;
              }
            });
          }
          resolve({ code: 0, msg: '成功' });
        });
      }).then(({ code }) => {
        if (code === 0) {
          const target = path.join(this.config.baseDir, 'app/public/uploads', filename);
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
          const avatar = this.config.baseUrl + '/public/uploads/' + filename;
          User.update({ avatar });
          ctx.helper.success(ctx, avatar, '成功');
        }
        ctx.helper.error(ctx, 200, '未知错误');
      });
    } catch (error) {
      ctx.helper.error(ctx, 200, '未知错误');
    }
  }
}

module.exports = UploadController;
