// main.js
import 'babel-polyfill'; // 在所有代码执行前引入，支持es6的的语法（async，generator）

import React from 'react';
import {render} from 'react-dom';
import Greeter from './Greeter';

import './index.css';//使用require导入css文件

render(<Greeter />, document.getElementById('root'));