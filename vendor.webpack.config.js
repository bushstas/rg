const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        vendor: ['react', 'react-dom', 'react-router', 'redux', 'react-redux']
    },
    output: {
        path: path.resolve(__dirname, 'public', 'vendor'),
        filename: '[name].bundle.js',
        library: 'vendor_lib'
    },
    plugins: [
        new webpack.DllPlugin({
            context: __dirname,
            name: 'vendor_lib',
            path: path.resolve(__dirname, 'public/vendor/vendor-manifest.json')
        })
    ]
}