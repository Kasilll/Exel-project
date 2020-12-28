const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === 'production'; // отвечают в каком режиме мы находимся
const isDev = !isProd;

const filname = ext=>  isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`;
const jsLoaders = ()=> {
    const loaders = [
        {
            loader: "babel-loader",
            options: {
                presets: ['@babel/preset-env']
            }
        }
    ]
    if(isDev) {
        loaders.push('eslint-loader')
    }
    return loaders;
}


module.exports = {
    context: path.resolve(__dirname, "src"),
    mode: "development",
    entry: ['@babel/polyfill',"./index.js"],
    output: {
        filename: filname('js'),
        path:path.resolve(__dirname,"dist")
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            "@":path.resolve(__dirname,"src"),
            '@core':path.resolve(__dirname,"src/core")
        }
    },
    devtool: isDev ? 'source-map': false,
    target: process.env.NODE_ENV === "development" ? "web" : "browserslist",
    devServer: {
        open: true,
        contentBase: path.join(__dirname, 'src'),
        watchContentBase: true,
        port: 8080,
        hot: isDev,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            template: "index.html"
        }),
        new CopyPlugin({
            patterns: [{
                from: path.resolve(__dirname, 'src/favicon.ico'),
                to: path.resolve(__dirname, 'dist')
            }]
        }),
        new MiniCssExtractPlugin({
            filename: filname('css')
        })
    ],
    // target: isDev ? 'web' : 'browserslist',
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader:MiniCssExtractPlugin.loader,
                        options: {
                            // hmr:isDev,
                            // reloadAll:true
                        }
                    },
                    "css-loader",
                    "sass-loader"
                ],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use:jsLoaders()
            }
        ],
    },
}