const { CracoAliasPlugin } = require('react-app-alias');
const CompressionPlugin = require('compression-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
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
      ['babel-plugin-transform-remove-console', { exclude: ['error', 'warn'] }],
    ]
  },

  // 3. webpack
  webpack: {
    configure: (webpackConfig, { env }) => {

      // optimization 설정
      webpackConfig.optimization = {
        minimize: true,
        minimizer: [
          new CssMinimizerPlugin(),
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
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: ['default',
              {
                discardComments: { removeAll: true },
              }
            ],
          },
        }),
        new CompressionPlugin({
          test: /\.(js|css|html|svg)$/,
          algorithm: 'gzip',
          threshold: 8192,
          minRatio: 0.8,
        }),
        new ImageMinimizerPlugin({
          minimizer: {
            implementation: ImageMinimizerPlugin.imageminMinify,
            options: {
              plugins: [
                ['gifsicle', { interlaced: true }],
                ['mozjpeg', { progressive: true, quality: 75 }],
                ['optipng', { optimizationLevel: 5 }],
                ['pngquant', { quality: [0.65, 0.9], speed: 4 }],
                ['svgo', { plugins: [{ removeViewBox: false }] }],
              ],
            },
          },
        }),
        new webpack.optimize.AggressiveMergingPlugin({
          minSizeReduce: 1.5
        }),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(env),
        })
      );

      // devServer 설정
      webpackConfig.devServer = {
        ...webpackConfig.devServer,
        open: true,
        compress: true,
        hot: true,
        historyApiFallback: true,
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

      return webpackConfig;
    },
  },
};
