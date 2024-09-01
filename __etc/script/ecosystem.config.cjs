// ecosystem.config.cjs

module.exports = {
  apps : [{
    name: "JPAGE",
    script: "tsx index.ts",
    watch: true,
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
};
