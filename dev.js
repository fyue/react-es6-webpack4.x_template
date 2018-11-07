const webpack = require('webpack');
const path = require('path');
const devConfig = require('./webpack.config.js');
const compiler = webpack(devConfig);
const express = require('express');
const app = express();
const { fork } = require('child_process');

const DEV_SERVER_PORT = 8888;

app.use(require('webpack-dev-middleware')(compiler, {
    historyApiFallback: true, //不跳转
    publicPath: '/',
}));

// app.get('/', (req, res) => {
//     console.log('res_______________');
//     // res.sendFile(`${__dirname}/public/index_template.html`);
// });

const childProcess = fork(path.join(__dirname, './mockServer'))

// 设置本地静态资源访问路径
app.use(express.static(__dirname + '/localStatic'));

app.listen(DEV_SERVER_PORT, () => console.log(`Example app listening on port ${DEV_SERVER_PORT}!`))
