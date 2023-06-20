const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const os = require('os');

// cpu核数
const threads = os.cpus().length; 

module.exports = {
  // 入口
  entry: './src/main.js',
  // 输出
  output: {
    // 所有文件的输出路径
    // 开发模式没有输出
    path: undefined,
    // 入口文件打包输出文件名
    filename: 'static/js/main.js',
  },
  // 加载器
  module: {
    rules: [
      // loader的配置
      {
        // 每个文件只能被其中一个loader配置处理
        oneOf : [
          {
            test: /\.css$/,    // 只检测.css文件
            use: [
              // 执行顺序：先css-loader 再style-loader
              "style-loader", // 将js中css通过创建style标签的形式添加到html文件中生效
              "css-loader",   // 将css资源编译成commonjs的模块到js中
            ],
          },
          {
            test: /\.less$/,    // 只检测.less文件
            // loader: "xxxxx"   // 只能使用一个loader
            use: [ 
              // 使用多个loader
              "style-loader", 
              "css-loader", 
              "less-loader",   // 将less编译成css文件 
            ], 
          },
          {
            test: /\.s[ac]ss$/,    // 检测.sass  .scss文件
            use: [ 
              "style-loader", 
              "css-loader", 
              "sass-loader",   // 将sass编译成css文件 
            ], 
          },
          {
            test: /\.styl$/,   
            use: [ 
              "style-loader", 
              "css-loader", 
              "stylus-loader",   // 将stylus编译成css文件 
            ], 
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
            /**
             * 不处理node_modules
             * 排除node_modules下的文件，其他文件都处理
             * include exclude 只能用一种
             */
            // exclude: /node_modules/, 
            // 只处理src下的文件，其他不处理
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
      // 排除检测的文件, 或者include, 选用其中一种
      // 开启缓存
      cache: true, 
      exclude: "node_modules",
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
    })
  ],
  // 开发服务器: 不会输出资源，在内容中编译打包的, npx webpack server
  devServer: { 
    host: 'localhost',  // 服务器域名
    port: '3000',       // 服务器端口
    // open: true,         // 默认false, 是否自动打开浏览器 
    hot: true,          // HMR默认true, 只更新修改的模块
  },
  // 模式
  mode: 'development',
  // 报错映射关系，行的映射
  devtool: "cheap-module-source-map",
}