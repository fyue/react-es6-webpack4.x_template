import 'babel-polyfill'; // 在所有代码执行前引入，支持es6的的语法（async，generator）
import React from 'react';
import {render} from 'react-dom';
import Layout from './layout';
import './index.less';
// import './customTicker';

render(
  <Layout />,
  document.getElementById('root')
);
