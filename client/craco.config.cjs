// craco.config.cjs
const EsbuildPlugin = require('esbuild-loader').EsbuildPlugin;
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.module.rules.push({
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'esbuild-loader',
          options: {
            loader: 'jsx', // if using JSX
            target: 'es2015' // Syntax to compile to (e.g. es2015, es2017)
          }
        }
      });

      webpackConfig.plugins.push(new EsbuildPlugin());

      webpackConfig.optimization.minimizer = [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
          parallel: true,
        }),
      ];

      return webpackConfig;
    },
  },
};
