/**
 * Created by yijaejun on 01/02/2017.
 */
//const path = require('path');
//const webpack = require('webpack');
const entryPointsPathPrefix = './public/javascripts/';
//const ExtractTextPlugin = require('extract-text-webpack-plugin');
//const MODULE_BUILD_CSS_DIR = path.resolve(__dirname, './public/stylesheets');

module.exports = {
	devtool : 'eval-source-map',
	entry : {
		'test-es6': `${entryPointsPathPrefix}test-es6.js`
	},
	output: {
		path: './public/javascripts/dist',
		filename: '[name].js'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015']
				}
			}
		]
	},

	plugins: [
	]
};