const path = require('path');

module.exports = {
  // 入口
  entry: './src/main.js',
  output: {
    // 文件的输出路径
    // __dirname 当前文件的文件目录
    path: path.resolve(__dirname, 'dist'),
    // 文件名
    filename: 'main.js',
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
    ],
  },
  // 插件
  plugins: [
    // 插件的配置

  ],
  // 模式
  mode: 'development',
}