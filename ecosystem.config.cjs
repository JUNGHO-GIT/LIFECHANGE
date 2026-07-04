/**
 * @file ecosystem.config.cjs
 * @description PM2 설정 파일 (lifechange 단일 앱, CentOS7 호환 node20 인터프리터)
 */

// 1. 앱 목록 ----------------------------------------------------------------------------------------
module.exports = {
  apps: [
    {
      name: `lifechange`,
      cwd: `/var/www/junghomun.com/lifechange/server`,
      script: `node_modules/tsx/dist/cli.cjs`,
      args: [`--tsconfig`, `tsconfig.json`, `index.ts`],
      interpreter: `/opt/node20/bin/node`,
      watch: false,
      log_date_format: `YYYY-MM-DD HH:mm Z`,
      env_production: {
        NODE_ENV: `production`,
        ENV_MODE: `PRODUCTION`,
      },
      env_development: {
        NODE_ENV: `development`,
        ENV_MODE: `DEVELOPMENT`,
      },
    },
  ],
};
