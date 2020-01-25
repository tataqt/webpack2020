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


module.exports = {
    context: path.resolve(__dirname, 'src'), // Точка входа
    mode: 'development', // Тип проекта dev or production
    entry: { // Входящие js файлы
        main: './index.js',
        analytics: './analytics.js'
    },
    output: {
        filename: '[name]-[contenthash].js',
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
            filename: '[name]-[contenthash].css'
        })
    ],
    module: {
        rules: [ // Правила для подключение различных типов файлов
            {
                test: /\.css$/, // Подключаем css
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: isDev,
                        reloadAll: true
                    },
                }, 'css-loader'
                ]
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
            }
        ]
    }
}