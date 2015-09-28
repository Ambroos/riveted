var webpack = require('webpack'); // eslint-disable-line
var config = require('./webpack.build.min.js'); // eslint-disable-line
var path = require('path'); // eslint-disable-line

config.entry = './src/riveted-wp.js';
config.output.path = path.join(__dirname, 'wp-plugin', 'riveted', 'js');
config.output.filename = 'riveted-wp.js';

module.exports = config;
