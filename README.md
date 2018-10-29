1.在类中写箭头函数需要加"stage-1"

2.transform-decorators-legacy":支持装饰器。

3.import 'babel-polyfill'; // 在所有代码执行前的入口文件引入，支持es6语法（async，generator, includes...）

3.css-loader使你能够使用类似@import 和 url(...)的方法实现 require()的功能

4.style-loader将所有的计算后的样式加入页面中，二者组合在一起使你能够把样式表嵌入webpack打包后的JS文件中。

5.babel-plugin-import 目前用于在.babelrc中自动引入antd的样式文件