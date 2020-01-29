const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');


const isDev = process.env.NODE_ENV === 'development';

const optimization = () => {
    const config = {
        splitChunks: { // Разбить chunk(подключения)  
            chunks: 'all'
        }
    }

    if (!isDev) { // Минифицировать css
        config.minimizer = [
            new OptimizeCssAssetsPlugin(),
            new TerserPlugin()
        ]
    }
    return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

const cssLoaders = extra => {
    const loaders = [{
        loader: MiniCssExtractPlugin.loader,
        options: {
            hmr: isDev,
            reloadAll: true
        },
    },
        'css-loader'
    ]

    if (extra) {
        loaders.push(extra)
    }

    return loaders
}

const babelOptions = (preset) => {
    const opts = {
        presets: [
            '@babel/preset-env',
        ],
        plugins: [
            '@babel/plugin-proposal-class-properties'
        ]
    }

    if (preset) {
        opts.presets.push(preset)
    }

    return opts;
}

const jsLoaders = () => {
    const loaders = [{
        loader: 'babel-loader',// Подключаем babel
        options: babelOptions()
    }];

    if (isDev) {
        loaders.push('eslint-loader')
    }
    return loaders
}

module.exports = {
    context: path.resolve(__dirname, 'src'), // Точка входа
    mode: 'development', // Тип проекта dev or production
    entry: { // Входящие js файлы
        main: [
            '@babel/polyfill',
            './index.jsx'
        ],
        analytics: './analytics.ts'
    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist')
    }, // Выходящие js файлы
    resolve: {
        extensions: ['.js', '.json'], // Упростить поиск файла при подключение , указаные форматы можно не писать
        alias: { // Сокращение путей что бы писать меньше текста при подключении
            '@models': path.resolve(__dirname, 'src/models'),
            '@': path.resolve(__dirname, 'src')
        }
    },
    optimization: optimization(),
    devServer: { // Запуск сервера который обновляется при изменение файлов
        port: 4200,
        hot: isDev
    },
    devtool: isDev ? 'source-map' : '',
    plugins: [ // Плагины
        new HtmlWebpackPlugin({ //Html плагин для подключения своего шаблона
            template: './index.html',
            minify: {
                collapseWhitespace: !isDev
            }
        }),
        new CleanWebpackPlugin(), // Очиста папки в которую билдится проект
        new CopyWebpackPlugin([ // Для переноса любых файлов
            {
                from: path.resolve(__dirname, 'src/favicon.ico'),
                to: path.resolve(__dirname, 'dist')
            }
        ]),
        new MiniCssExtractPlugin({ //Подключаем css в отдельный файл
            filename: filename('css')
        })
    ],
    module: {
        rules: [ // Правила для подключение различных типов файлов
            {
                test: /\.css$/, // Подключаем css
                use: cssLoaders()
            },
            {
                test: /\.less$/, // Подключаем less
                use: cssLoaders('less-loader')
            },
            {
                test: /\.s[ac]ss$/, // Подключаем sass
                use: cssLoaders('sass-loader')
            },
            {
                test: /\.(png|jpg|svg|gif)$/, // Подключаем картинки
                use: ['file-loader']
            },
            {
                test: /.(ttf|woff|wof2|eot)$/, // Подключаем шрифты
                use: ['file-loader']
            },
            {
                test: /\.xml$/, // Подключаем xml
                use: ['xml-loader']
            },
            {
                test: /\.csv$/, // Подключаем csv
                use: ['csv-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            },
            {
                test: /\.ts$/, // Подключаем typescript
                exclude: /node_modules/,
                loader: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-typescript')
                }
            },
            {
                test: /\.jsx$/, // Подключаем react
                exclude: /node_modules/,
                loader: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-react')
                }
            }
        ]
    }
}