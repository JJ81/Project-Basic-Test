/**
 * Created by yijaejun on 01/02/2017.
 */
const webpack = require('webpack');
const path = require('path');
const entryPoint = {
	'js' : './public/javascripts/',
	'componentsJs' : './public/components/',
	'vendor' : './public/javascripts/vendor/'
};


// console.log( path.resolve(__dirname, '/public/javascripts/vendor/') );
// const UglifyJsPlugin = require('webpack-uglify-js-plugin');
//const ExtractTextPlugin = require('extract-text-webpack-plugin');
//const MODULE_BUILD_CSS_DIR = path.resolve(__dirname, './public/stylesheets');

module.exports = {
	devtool : 'eval-source-map',
	entry : {
		'index' : `${entryPoint.js}index.js`,
		'signup' : `${entryPoint.js}signup.js`,
		'video_list' : `${entryPoint.js}video_list.js`,
		'video_view' : `${entryPoint.js}video_view.js`
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
				// include : path.resolve(__dirname, `${entryPoint.js}`),
				// exclude: [/bower_components/, /node_modules/, /vendor/]

				//,exclude: ['./public/javascripts/vendor/youtube.min.js']
				// ,include: ['/public/javascripts/']
				// include: [
				// 	path.resolve(__dirname, `${entryPoint.js}`),
				// 	path.resolve(__dirname, 'node_modules', 'vendor')
				// ]
			}
		]
	},

	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			minimize: true,
			comments : false,
			mangle: {
				except: ['$', 'jQuery', 'videojs']
			}
			// target을 어떻게 잡아야 하는가?
		})
	]
};