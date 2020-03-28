import { EggAppConfig, EggAppInfo, PowerPartial, Context } from 'midway';

export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig;

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_{{keys}}';

  // elk日志中间件，404处理中间件
  config.middleware = [ 'elkLogger', 'notFound' ];

  // 合成配置
  const bizConfig = {
    sourceUrl: '',
    elkLogger: {
      // 请求url匹配规则
      match(ctx: Context) {
        const reg = /.*/;
        return reg.test(ctx.url);
      },
      // 是否启用
      enable: true,
    },
  };
  // 安全处理
  config.security = {
    csrf: {
      enable: false,
    },
    methodnoallow: {
      enable: false,
    },
  };
  // CORS 跨域处理
  config.cors = {
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    credentials: true,
    origin(ctx: Context) {
      const origin: string = ctx.get('origin');
      // 允许*.ssjlicai.com域名访问
      if (origin.indexOf('172.22.88.118') > -1) {
        console.log('come in');
        return origin;
      } else {
        return '*';
      }
    },
  };

  // 日志配置
  config.logger = {
    outputJSON: false,
    appLogName: 'app.log',
    coreLogName: 'core.log',
    agentLogName: 'agent.log',
    errorLogName: 'error.log',
  };

  // 业务接口domain
  config.apiDomain = {
    loanDomain: '*',
  };

  // jsonwebtoken 插件配置
  config.jwt = {
    secret: "123456",
    enable: true,
    match(ctx: Context) {
      const reg = /login/;
      return !reg.test(ctx.originalUrl);
    },
  };

  // socket io setting
  config.io = {
    namespace: {
      '/socket': {
        connectionMiddleware: ['auth'],
        packetMiddleware: [],
      }
    },
    redis: {
      host: '127.0.0.1',
      port: 6379,
    },
  };

  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '123456',
      db: 0,
    },
  };

  return {
    ...bizConfig,
    ...config,
  };
};
