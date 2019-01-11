'use strict';

module.exports = appInfo => {
  /**
   * @param {String} private_key jsEncrypt用的私钥
   */
  const config = exports = {
    private_key: '-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIICWwIBAAKBgGCG1hRBi7GOWftJF5sHc4at+IVxZUf/mjB2pPS3JCgi3GJn9hbp\n' +
    'GdwV08TlSAK0o55gHLfTKEShunEtqZ7i6zrIF714qntmSmXOFWHzmQqHaRGpown/\n' +
    '5hsjQ4VsLTykYAxaImqNKBxyQ92tCPxRLmnTAunLK29Es5n4bayCITQzAgMBAAEC\n' +
    'gYApuqDZ6OwnOk8UHykhUDtVQehqZ/dNBOb3hJMTaAktgMSdliwBA4y2ZIlEWYqk\n' +
    'AMurMAm6PoLuCKy9OOxXT+o42sdXlPWWFyc2xKZ3JodijIsKPOctx9ZG30YUZ/Qq\n' +
    'QoUfG8ChYo4rCcDViFAVuLEGxBxrwz7BSlANAgnSD2C94QJBAKwMxBzjLlgw+7oD\n' +
    '2i5VUtWJJm9ngajj9WM18Tb9GVdWCvDAlk1GHAeKvF3HeBN82JlUpg2PhaGPvGXJ\n' +
    'OmUV7s0CQQCPoEJKx+NLWYO0dZyds4iscFtX215HSSTL5jjkedAvJ45ApseI2/zN\n' +
    'pbpUAx2WlIypOZi3MGH7wBTHvzDK3a7/AkAVbAF/F0pN8Mtm/dPMsRL/Q3Rlqp2a\n' +
    'Scfj8nN2RU1CcpQqJdCRDomu5rdNdeidhI3ziXajeZtJ4nuysLt0mqaBAkAG9mTg\n' +
    'TSpWl8NLtzvdZTul6Fh1PNwoJoKTI9j0MneGIavCtJMNrmRl77fFpNUFXLQo6/Lc\n' +
    'RospchlPyZPq8a4vAkEAlwH0XMPiehpZ9JKZ07uY2Z/PjPjvOoqC8Xi/bDyBUZEH\n' +
    'G1+cJ4nKdeNgl5/h+meIobLoBjljvcbHKV2bwhQ6KQ==\n' +
    '-----END RSA PRIVATE KEY-----',
  };

  config.baseUrl = 'http://127.0.0.1:7001';

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1545701919363_8966';

  // add your config here
  // 这里配置的都是全局中间件， 也可以单独再router中使用
  config.middleware = [];

  /**
   * @description sequelize的配置
   */
  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'egg-sequelize-doc-default',
  };

  // 解决安全的插件[egg-security]
  config.security = {
    // 关闭csrf
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    // 能访问的白名单
    domainWhiteList: [ '*' ],
  };

  // 解决跨域[egg-cors]
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  // token [egg-jwt]
  exports.jwt = {
    secret: '123456',
  };

  return config;
};
