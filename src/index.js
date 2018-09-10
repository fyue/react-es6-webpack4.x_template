// index.js
import 'babel-polyfill'; // 在所有代码执行前引入，支持es6的的语法（async，generator）
import React from 'react';
import {render} from 'react-dom';

import Layout from './layout';
import './index.less';//使用require导入css文件

render(<Layout />, document.getElementById('root'));