const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry:  {
        main: __dirname + "/src/index.js",//已多次提及的唯一入口文件
    },
    output: {
        path: __dirname + "/build",//打包后的文件存放的地方
        filename:"main.js", // 默认main
        chunkFilename: '[name].[chunkhash:5].min.js',
    },
    mode: 'development',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif|woff|ttf|svg|eot)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {}
                    }
                ]
            },
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader"
                },
                exclude: /node_modules/
            },
            {
                test: /\.css/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.less/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: true, // 指定启用css modules(支持比如@import语法)
                            importLoaders: 1,
                            localIdentName: '[name]-[local]-[hash:base64:5]' // 指定css的类名格式
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: true,
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究'),
        new HtmlWebpackPlugin({
            template: __dirname + "/public/index.html"//new 一个这个插件的实例，并传入相关的参数
        })
    ],
};
