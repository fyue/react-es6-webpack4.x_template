// webpack.production.config.js
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: __dirname + "/src/index.js",//已多次提及的唯一入口文件
    output: {
        path: __dirname + "/build",
        filename: "index.min.js",
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif|woff|ttf|svg|eot)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            outputPath: 'images/'
                        }
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
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                minimize: true //css压缩
                            }
                        },
                        {
                            loader: "postcss-loader"
                        },
                    ]
                }),
            },
            {
                test: /\.less/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                modules: true, // 指定启用css modules(支持比如@import语法)
                                importLoaders: 1,
                                minimize: true //css压缩
                            }
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                sourceMap: true,
                            }
                        },
                        {
                            loader: "postcss-loader"
                        },
                    ]
                }),
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究'),

        // 模板html
        new HtmlWebpackPlugin({
            template: __dirname + "/public/index.html"
        }),

        // 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
        new webpack.optimize.OccurrenceOrderPlugin(),

        new ExtractTextPlugin({filename: '[name].min.css', allChunks: true}),

        // 分离css和js文件
        // new MiniCssExtractPlugin({
        //     // Options similar to the same options in webpackOptions.output
        //     // both options are optional
        //     filename: "[name].css",
        //     chunkFilename: "[id].css"
        // })
    ]
};