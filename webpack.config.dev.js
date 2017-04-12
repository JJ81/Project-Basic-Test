/**
 * Created by yijaejun on 01/02/2017.
 */
const webpack = require('webpack');
// const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const entryPoint = {
	'js' : './public/javascripts/',
	'componentsJs' : './public/components/',
	'vendor' : './public/javascripts/vendor/',
	'css' : './public/stylesheets/'
};


// console.log( path.resolve(__dirname, '/public/javascripts/vendor/') );
// const UglifyJsPlugin = require('webpack-uglify-js-plugin');

//const MODULE_BUILD_CSS_DIR = path.resolve(__dirname, './public/stylesheets');

module.exports = {
	// devtool: 'inline-source-map'
	devtool : 'eval-source-map',
	entry : {
		// 'style' : `${entryPoint.css}styles.css`,
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
			},
			// {
			// 	test: /\.css$/,
			// 	use: [
			// 		{
			// 			loader: 'css-loader',
			// 			options: {
			// 				sourceMap: true,
			// 				minimize: true
			// 			}
			// 		}
			// 	]
			// }
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract("css-loader")
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
		})
		//,new ExtractTextPlugin('[name].min.css')
	]
};