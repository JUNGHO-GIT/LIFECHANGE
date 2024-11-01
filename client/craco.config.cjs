// craco.config.cjs

const { CracoAliasPlugin } = require('react-app-alias');
const CompressionPlugin = require('compression-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { SwcMinifyWebpackPlugin } = require('swc-minify-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  plugins: [
    {
      plugin: CracoAliasPlugin
    }
  ],

  babel: {
    plugins: [
      ['@babel/plugin-syntax-dynamic-import'],
      ['@babel/plugin-proposal-optional-chaining'],
      ['@babel/plugin-proposal-nullish-coalescing-operator'],
      ['@babel/plugin-transform-react-inline-elements'],
      ['@babel/plugin-transform-react-constant-elements'],
      ['babel-plugin-transform-remove-console', { exclude: ['error', 'warn'] }]
    ]
  },

  webpack: {
    configure: (webpackConfig, { env }) => {

      // module 설정
      webpackConfig.module.rules.unshift({
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [env === 'development' && require.resolve('react-refresh/babel')].filter(Boolean),
            },
          },
        ],
        exclude: /node_modules/,
      });

      // optimization 설정
      webpackConfig.optimization = {
        minimize: true,
        minimizer: [
          new CssMinimizerPlugin({
            minimizerOptions: {
              preset: ['default', {
                discardComments: { removeAll: true },
                zindex: false,
              }],
            },
          }),
          new SwcMinifyWebpackPlugin({
            compress: {
              drop_console: true,
              drop_debugger: true,
            }
          }),
        ],
        splitChunks: {
          chunks: 'all',
          name: false,
          cacheGroups: {
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
        runtimeChunk: 'single',
      };

      // plugin 설정
      webpackConfig.plugins.push(
        new CompressionPlugin({
          filename: '[path][base].gz',
          test: /\.(js|css|html|svg)$/,
          algorithm: 'gzip',
          threshold: 10240,
          minRatio: 0.8,
        }),
        new webpack.optimize.AggressiveMergingPlugin({
          minSizeReduce: 1.5
        }),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(env),
          'process.env.PUBLIC_URL': JSON.stringify(process.env.PUBLIC_URL),
        }),
        env === 'development' && new ReactRefreshWebpackPlugin(),
      );

      // devServer 설정
      webpackConfig.devServer = {
        ...webpackConfig.devServer,
        open: true,
        compress: true,
        hot: true,
        historyApiFallback: true,
        overlay: true,
      };

      // output 설정
      webpackConfig.output = {
        path: `${__dirname}/build`,
        publicPath: `${process.env.PUBLIC_URL}`,
        filename: `static/js/[name].[contenthash:8].js`,
        chunkFilename: `static/js/[name].[contenthash:8].chunk.js`,
        assetModuleFilename: 'static/media/[name].[hash][ext]',
        clean: true,
      };

      // 캐시 설정
      webpackConfig.cache = {
        type: 'memory',
      };

      return webpackConfig;
    },
  },
};
