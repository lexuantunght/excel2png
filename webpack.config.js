const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const { DefinePlugin } = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isDev = process.env.NODE_ENV === 'development';

let devPlugins = [];
if (isDev) {
    devPlugins = [
        new CircularDependencyPlugin(),
        new BundleAnalyzerPlugin({ openAnalyzer: false, analyzerPort: 8888 }),
    ];
}

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].[contenthash].js',
        clean: true,
    },
    devtool: isDev ? 'source-map' : false,
    mode: process.env.NODE_ENV || 'development',
    resolve: {
        extensions: ['.jsx', '.js'],
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
    devServer: {
        historyApiFallback: {
            index: '/index.html',
        },
        port: 3001,
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.module\.s(a|c)ss$/,
                use: [
                    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: {
                                localIdentName: '[local]-[hash:base64:5]',
                            },
                        },
                    },
                    'sass-loader',
                ],
            },
            {
                test: /\.(css|scss|sass)$/,
                use: [
                    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
                exclude: /\.module\.s(a|c)ss$/,
            },
            {
                test: /\.(jpg|jpeg|png|gif|mp3)$/,
                use: ['file-loader'],
            },
            {
                test: /\.svg$/i,
                issuer: /\.[jt]sx?$/,
                use: [{ loader: '@svgr/webpack', options: { icon: true } }],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ],
    },
    optimization: {
        minimize: !isDev,
        minimizer: [new CssMinimizerPlugin(), new TerserWebpackPlugin({ extractComments: false })],
        removeAvailableModules: true,
        removeEmptyChunks: true,
        mergeDuplicateChunks: true,
        emitOnErrors: false,
        concatenateModules: true,
        splitChunks: {
            chunks: 'all',
            maxSize: 1024 * 256,
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public', 'index.html'),
            favicon: path.join(__dirname, 'public', 'favicon.ico'),
            filename: 'index.html',
            chunks: 'all',
            inject: true,
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        }),
        new DefinePlugin({
            __DEV__: isDev,
        }),
        ...devPlugins,
    ],
};
