1.在类中写箭头函数需要加"stage-1"

2.transform-decorators-legacy":支持装饰器。

3.import 'babel-polyfill'; // 在所有代码执行前的入口文件引入，支持es6语法（async，generator, includes...）

3.css-loader使你能够使用类似@import 和 url(...)的方法实现 require()的功能

4.style-loader将所有的计算后的样式加入页面中，二者组合在一起使你能够把样式表嵌入webpack打包后的JS文件中。

5.babel-plugin-import 目前用于在.babelrc中自动引入antd的样式文件

6.使用stage-2，需要安装babel插件babel-preset-stage-2

7.publicPath 用于当html与其他文件不再同一目录下的情况，设置了publicPath后，出index.html外的其他文件都应该放在publicPath指定的路径下

8.webpack中的devServer配置对象：

告诉服务器对于静态文件的基服务器路径
如访问静态资源时的http://localhost:port/即指向该地址
contentBase: path.join(__dirname, 'local_server_static'), 