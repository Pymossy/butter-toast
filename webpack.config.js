const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    entry: {
        'butter-toast': './src/index.js',
        'butter-toast.min': './src/index.js'
    },
    output: {
        filename: '[name].js',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, 'dist')
    },
    externals: {
        'react': 'react',
        'react-dom' : 'reactDOM'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader'
            }
        }]
    },
    optimization: {
        minimize: true,
        minimizer: [new UglifyJsPlugin({
            sourceMap: true,
            include: /\.min\.js$/
        })]
    }
};
