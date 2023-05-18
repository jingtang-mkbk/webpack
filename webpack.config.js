const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  // 入口
  entry: './src/main.js',
  output: {
    // 所有文件的输出路径
    // __dirname 当前文件的文件目录
    path: path.resolve(__dirname, 'dist'),
    // 入口文件打包输出文件名
    filename: 'static/js/main.js',
    // 自动清空上次打包的内容
    // 在打包前降path目录清空，再进行打包
    clean: true,
  },
  // 加载器
  module: {
    rules: [
      // loader的配置
      {
        test: /\.css$/,    // 只检测.css文件
        use: [
          // 执行顺序：先css-loader 再style-loader
          "style-loader", // 降js中css通过创建style标签的形式添加到html文件中生效
          "css-loader",   // 降css资源编译成commonjs的模块到js中
        ],
      },
      {
        test: /\.less$/,    // 只检测.less文件
        // loader: "xxxxx"   // 只能使用一个loader
        use: [ 
          // 使用多个loader
          "style-loader", 
          "css-loader", 
          "less-loader",   // 降less编译成css文件 
        ], 
      },
      {
        test: /\.s[ac]ss$/,    // 检测.sass  .scss文件
        use: [ 
          "style-loader", 
          "css-loader", 
          "sass-loader",   // 降sass编译成css文件 
        ], 
      },
      {
        test: /\.styl$/,   
        use: [ 
          "style-loader", 
          "css-loader", 
          "stylus-loader",   // 降stylus编译成css文件 
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
        // 不处理node_modules
        exclude: /node_modules/,
        loader: 'babel-loader',
        // 在babel.config.js 写或者写在options里
        // options: {
        //   preset: ['@babel/preset-env']
        // }
      },
    ],
  },
  // 插件
  plugins: [
    // 插件的配置
    new ESLintPlugin({
      context: path.resolve(__dirname, 'src')
    })
  ],
  // 模式
  mode: 'development',
}