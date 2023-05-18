module.exports = {
  // 继承eslint规则
  extends: ['eslint:recommended'],
  env: {
    // 启用node中全局变量
    node: true,
    // 启用浏览器中全局变量
    browser: true,
  },
  parserOptions: {
    // es6
    ecmaVersion: 6,
    // es module
    sourceType: 'module',
  },
  rules: {
    // 禁止var定义变量
    "no-var": 2  
  },
}