'use strict';

/**
 * @description 注册
 */

const bcrypt = require('bcryptjs');
module.exports = app => {
  const User = app.model.import('../domain/user');
  User.add = async function(username, pass, nickname) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const password = bcrypt.hashSync(pass, salt);
    const user = await this.create({
      username, nickname,
      userType: 'C',
    });
    // 写入登录表
    await app.model.UserLogin.sync();
    await app.model.UserLogin.create({
      username,
      password,
      uid: user.uid,
      salt,
    });
  };
  return User;
};
