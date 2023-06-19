const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const os = require('os');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

// cpu核数
const threads = os.cpus().length; 

function getStyleLoader(pre) {
  return [
    // 执行顺序：先css-loader 再style-loader
    MiniCssExtractPlugin.loader, // css提取成单独的文件
    "css-loader",   // 降css资源编译成commonjs的模块到js中
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env", //解决大多数样式兼容性问题
          ]
        }
      }
    },
    pre
  ].filter(Boolean)  // pre 为undefined时过滤掉
}

module.exports = {
  // 入口
  entry: './src/main.js',
  // 输出
  output: {
    // 所有文件的输出路径
    // __dirname 当前文件的文件目录
    path: path.resolve(__dirname, '../dist'),
    // 入口文件打包输出文件名
    filename: 'static/js/main.js',
    /**
     * 自动清空上次打包的内容
     * 在打包前将path目录清空，再进行打包
     * 配置开发服务器后，无用
     */
    clean: true,
  },
  // 加载器
  module: {
    rules: [
      // loader的配置
      {
        oneOf: [
          {
            test: /\.css$/,    // 只检测.css文件
            use: getStyleLoader(),
          },
          {
            test: /\.less$/,    // 只检测.less文件
            // loader: "xxxxx"   // 只能使用一个loader
            use: getStyleLoader("less-loader"),
          },
          {
            test: /\.s[ac]ss$/,    // 检测.sass  .scss文件
            use: getStyleLoader("sass-loader"),
          },
          {
            test: /\.styl$/,   
            use: getStyleLoader("stylus-loader"),
          },
          {
            // 处理图片资源
            test: /\.(png|jpe?g|gif|webp|svg)$/,
            type: "asset",  // 转化base64
            parser: {
              dataUrlCondition: {
                // 小于10kb 转成base64
                // 减少请求数量，但体积变大
                maxSize: 10 * 1024,
              }
            },
            generator: {
              /** 
               * 输出图片名称
               * hash: hash值只取签10位
               * ext: 文件扩展名 jpg  png gif等
               * query: 参数
               */  
              filename: "static/images/[hash:10][ext][query]"
            }
          },
          // 处理iconfont
          {
            test: /\.(ttf|woff|woff2)$/,
            type: "asset/resource",
            generator: {
              // 输出名称 
              filename: "static/media/[hash:10][ext][query]"
            }
          },
          {
            test: /\.js$/,
            // 不处理node_modules
            // exclude: /node_modules/,
            include: path.resolve(__dirname, "../src"),
            use: [
              {
                // 开启多进程
                loader: 'thread-loader',
                options: {
                  // 进程数量
                  works: threads
                }
              },
              {
                loader: 'babel-loader',
                options: {
                  // 在babel.config.js 写或者写在options里
                  // preset: ['@babel/preset-env']、
                  cacheDirectory: true, // 开启babel缓存
                  cacheCompression: false,  // 关闭缓存文件压缩
                  plugins: ["@babel/plugin-transform-runtime"], // 减少代码体积
                }
              }
            ]
          },
        ]
      }
    ],
  },
  // 插件
  plugins: [
    // 插件的配置
    new ESLintPlugin({
      context: path.resolve(__dirname, '../src'),
      exclude: "node_modules",
      // 开启缓存
      cache: true, 
      cacheLocation: path.resolve(__dirname, '../node_modules/.cache/eslintcache '),
      // 开启多进程和设置进程数量
      threads, 
    }),
    // 处理html资源
    new HtmlWebpackPlugin({
      /**
       * 模板：以public/index.html文件创建新的html文件
       * 新的html文件特点，1.解构和原来一致 2.自动引入打包输出的资源
       */
      template: path.resolve(__dirname, '../public/index.html')
    }),
    // 提取css，解决加载时样式引起的闪屏
    new MiniCssExtractPlugin({
      filename: 'static/css/main.css'
    }),
    
  ],
  optimization: {
    minimizer: [
      // css 压缩
      new CssMinimizerPlugin(),
      // 压缩js
      new TerserWebpackPlugin({
        // 开启多进程和设置多进程数量
        parallel: threads,
      }),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["opyipng", { optimizationLevel: 5 }],
              [
                "svgo", 
                {
                  plugins: [
                    "preset-default",
                    "prefixIds",
                    {
                      name: "sortAttrs",
                      params: {
                        xmlnsOrder: "alphabetical"
                      }
                    }
                  ]
                }
              ]
            ]
          }
        }
      })
    ]
  },
  // 模式
  mode: 'production',
  // 报错映射关系，行和列的映射
  devtool: 'source-map'
}