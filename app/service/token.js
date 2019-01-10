'use strict';

const Service = require('egg').Service;

class Token extends Service {
  /* 生成 Token */
  async createToken(data) {
    return this.app.jwt.sign(data, this.app.config.jwt.secret, {
      expiresIn: data.expires_in,
    });
  }

  /* 验证token的合法性 */
  async verifyToken(token) {
    return new Promise(resolve => {
      this.app.jwt.verify(token, this.app.config.jwt.secret, function(err, decoded) {
        const result = {};
        if (err) {
          /*
            err = {
              name: 'TokenExpiredError',
              message: 'jwt expired',
              expiredAt: 1408621000
            }
          */
          result.verify = false;
          result.message = 'token已过期！';
        } else {
          result.verify = true;
          result.message = decoded;
        }
        resolve(result);
      });
    });
  }
}

module.exports = Token;
