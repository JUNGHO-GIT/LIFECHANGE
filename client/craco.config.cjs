// craco.config.cjs

const { CracoAliasPlugin } = require('react-app-alias');
const ThreadLoader = require('thread-loader');
const CompressionPlugin = require('compression-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { SwcMinifyWebpackPlugin } = require('swc-minify-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  // 1. plugins
  plugins: [
    {
      plugin: CracoAliasPlugin
    }
  ],

  // 2. babel
  babel: {
    plugins: [
      ['@babel/plugin-syntax-dynamic-import'],
      ['@babel/plugin-transform-react-inline-elements'],
      ['@babel/plugin-transform-react-constant-elements'],
      ['@babel/plugin-proposal-optional-chaining'],
      ['@babel/plugin-proposal-nullish-coalescing-operator'],
      ['babel-plugin-transform-remove-console', { exclude: ['error', 'warn'] }]
    ]
  },

  // 3. webpack
  webpack: {
    configure: (webpackConfig, { env }) => {

      // thread-loader 설정 (CSS는 제외)
      ThreadLoader.warmup(
        { poolTimeout: 2000, workerParallelJobs: 50 },
        ['babel-loader']
      );

      webpackConfig.module.rules.unshift({
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        use: [
          { loader: 'thread-loader' },
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                env === 'development' && require.resolve('react-refresh/babel'),
              ].filter(Boolean),
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
          maxInitialRequests: 20,
          maxAsyncRequests: 30,
          minSize: 20000,
        },
        runtimeChunk: 'single',
      };

      // plugin 설정
      webpackConfig.plugins.push(
        new CompressionPlugin({
          test: /\.(js|css|html|svg)$/,
          algorithm: 'gzip',
          threshold: 10240,
          minRatio: 0.8,
        }),
        new ImageMinimizerPlugin({
          minimizer: {
            implementation: ImageMinimizerPlugin.imageminMinify,
            options: {
              plugins: [
                ['gifsicle', { interlaced: true }],
                ['mozjpeg', { progressive: true, quality: 80 }],
                ['optipng', { optimizationLevel: 5 }],
                ['pngquant', { quality: [0.75, 0.85], speed: 3 }],
                ['svgo', { plugins: [{ removeViewBox: false }, { cleanupIDs: true }] }],
                ['imagemin-webp', { quality: 75 }],
              ],
            },
          },
        }),
        new webpack.optimize.AggressiveMergingPlugin({
          minSizeReduce: 0.5,
        }),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(env),
          'process.env.PUBLIC_URL': JSON.stringify(process.env.PUBLIC_URL || ''),
        }),
        ...(env === 'development' ? [new ReactRefreshWebpackPlugin()] : [])
      );

      // devServer 설정
      webpackConfig.devServer = {
        ...webpackConfig.devServer,
        open: true,
        compress: true,
        hot: true,
        client: {
          overlay: true,
        },
      };

      // output 설정
      webpackConfig.output = {
        path: `${__dirname}/build`,
        publicPath: `${process.env.PUBLIC_URL}`,
        filename: 'static/js/[name].[contenthash:8].js',
        chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
        clean: true,
      };

      // 캐시 설정
      webpackConfig.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };

      return webpackConfig;
    },
  },
};
