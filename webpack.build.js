var webpack = require('webpack'); // eslint-disable-line

module.exports = {
    entry: './src/riveted.js', // Your app's entry point
    // devtool: 'hidden-source-map',
    output: {
        path: __dirname,
        filename: 'riveted.js',
        library: 'riveted',
        libraryTarget: 'umd',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loaders: ['babel'],
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            },
        }),
        new webpack.BannerPlugin(
            'riveted.js | v0.8.0\n' +
            'Copyright (c) 2015 Rob Flaherty (@robflaherty)\n' +
            'Licensed under the MIT license'
        ),
        new webpack.optimize.AggressiveMergingPlugin({}),
        new webpack.optimize.OccurenceOrderPlugin(true),
    ],
    progress: true,
    colors: true,
};
