const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = { // qual pasta deve ser vista primeiro
    mode: 'production',
    entry: './src/app.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: { // como ele deve se portar, no caso, transformar ts em js
        rules: [
            { // expressao regular para checar arquivos que terminam em .ts
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [ // ajudar a limpar a pasta dist, para termos sempre a versão mais atualizada do js
        new CleanPlugin.CleanWebpackPlugin()
    ]
};