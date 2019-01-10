'use strict';

/**
 * @description 注册
 */

const bcrypt = require('bcryptjs');
module.exports = app => {
  const User = app.model.import('../domain/user');
  const UserGroup = app.model.import('../domain/userGroup');
  User.belongsTo(UserGroup, { foreignKey: 'group_id' });
  User.add = async function(username, pass) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const password = bcrypt.hashSync(pass, salt);
    const user = await this.create({
      username,
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
