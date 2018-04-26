'use strict';
const webpack = require('webpack');
const path = require('path');
const pr = path.resolve;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const classy = require('classy-loader');
classy.init({
    globalPrefix: '',
    obfuscation: false,
    autoPrefixMode: true,
    prefixAutoResolving: 'folder',
    cssAutoImport: true
});

const env = process.env.NODE_ENV;
const CONFIG = env === 'production' ? require('./prod_config') : require('./local_config');

const plugins = [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env),
        'GLOBALS': JSON.stringify(CONFIG)
    }),
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/index.html'
    })
];

let outputFilename = 'dist/bundle.js';

if (env === 'server') {
    plugins.push(new webpack.HotModuleReplacementPlugin());
} else if (env === 'production') {
    plugins.push(new ExtractTextPlugin('dist/bundle_prod.css'));
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {warnings: false},
        output: {comments: false}
    }));
    // plugins.push(new webpack.optimize.CommonsChunkPlugin({
    //     name: 'vendor',
    //     filename: 'dist/vendor.js'
    // }));
    outputFilename = 'dist/bundle_prod.js';
} else {
    plugins.push(new ExtractTextPlugin('dist/bundle.css'));
}

const config = {
    entry: [
        // 'babel-polyfill',
        pr(__dirname, 'src', 'index.tsx')
    ],
    output: {
        path: pr(__dirname, 'public'),
        publicPath: CONFIG.publicPath,
        filename: outputFilename
    },
    resolve: {
        modules: ['node_modules', 'src']
    },
    // resolveLoader: {
    //     modules: ['node_modules', 'loaders']
    // },
    module: {
        rules: [
            {
                test: /\.js$/, 
                exclude: ['node_modules'],

                loaders: [
                    {
                        loader: 'babel-loader',
                        options: {
                            'compact': false,
                            'presets': [
                                'babel-preset-es2015', 
                                'babel-preset-stage-0',
                                'babel-preset-react'
                            ],
                            'plugins': [
                                'babel-plugin-transform-decorators-legacy',
                                'babel-plugin-transform-class-properties',
                            ],
                            'env': {
                                'server': {
                                    'presets': ['babel-preset-react-hot']
                                }
                            }
                        }
                    },
                    {
                        loader: 'classy-loader?parser=js'
                    }
                ]
            },
            {
                test: /\.tsx$/, 
                exclude: ['node_modules'],

                loaders: [
                    {
                        loader: 'ts-loader'
                    },
                    {
                        loader: 'classy-loader?parser=js'
                    }
                ]
            },
            { 
                test: /\.(ttf|eot|svg|woff(2)?)(\S+)?$/,
                loader: 'file-loader?name=[name].[ext]&outputPath=fonts&publicPath=../fonts'
            },
            { 
                test: /\.(jpe*g|png)$/,
                loader: 'file-loader',
                options: {
                    name: '[name]_[hash].[ext]',
                    outputPath: 'images/backgrounds/',
                    publicPath: '../images/backgrounds/',
                    include: [
                        pr(__dirname, "src/assets/images/backgrounds")
                    ]
                }
            },
            { 
                test: /\.gif$/,
                loader: 'file-loader',
                options: {
                    name: '[name]_[hash].[ext]',
                    outputPath: 'images/loaders/',
                    publicPath: '../images/loaders/',
                    include: [
                        pr(__dirname, "src/assets/images/loaders")
                    ]
                }
            },
            {
                test: /\.scss$/,
                exclude: ['node_modules'],
                loader: ExtractTextPlugin.extract(
                    {
                        use: [
                            'css-loader?root=' + pr(__dirname, 'src'), 
                            'resolve-url-loader', 
                            'sass-loader',
                            'classy-loader?parser=css'
                        ]
                    }
                )
            }
        ]
    },
    resolve: {
        modules: [
            path.join(__dirname, "src"),
            'node_modules'
        ],
        extensions: [".js", ".ts", ".tsx", ".css", ".scss", ".png", ".less"]
    },
    plugins: plugins
};

if (env !== 'production') {
    config.devServer = {
        contentBase: pr(__dirname, 'public'),
        historyApiFallback: true,
        hot: true,
        inline: true
    };
    config.devtool = 'nosources-source-map';
}

module.exports = config;