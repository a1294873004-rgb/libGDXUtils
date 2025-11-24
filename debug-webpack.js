const webpack = require('webpack');
const webpackConfigFactory = require('./webpack.config.js');

// 如果 webpack 配置是函数，需要传入 env 和 argv 参数生成配置对象
const env = { production: false };
const argv = { mode: 'development' };

const config = webpackConfigFactory(env, argv);

// 创建 compiler 实例
const compiler = webpack(config);

// 运行 webpack
compiler.run((err, stats) => {
  if (err) {
    console.error('Webpack 编译出错:', err);
    return;
  }

  // 输出编译信息
  console.log(
    stats.toString({
      colors: true, // 彩色输出
      modules: false, // 不显示模块信息
      children: false, // 不显示子编译信息
      chunks: false, // 不显示 chunk 信息
      chunkModules: false, // 不显示 chunk 模块信息
    }),
  );

  // 关闭 compiler
  compiler.close(err => {
    if (err) console.error('关闭 compiler 出错:', err);
  });
});
