const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

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
    optimization: {
        splitChunks: { // Разбить chunk(подключения)  
            chunks: 'all'
        }
    },
    devServer: { // Запуск сервера который обновляется при изменение файлов
        port: 4200
    },
    plugins: [ // Плагины
        new HtmlWebpackPlugin({ //Html плагин для подключения своего шаблона
            template: './index.html'
        }),
        new CleanWebpackPlugin() // Очиста папки в которую билдится проект
    ],
    module: {
        rules: [ // Правила для подключение различных типов файлов
            {
                test: /\.css$/, // Подключаем css
                use: ['style-loader', 'css-loader']
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