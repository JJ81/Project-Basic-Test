/**
 * Created by yijaejun on 01/02/2017.
 */
const webpack = require('webpack');
const entryPointsPathPrefix = './public/javascripts/';
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const MODULE_BUILD_CSS_DIR = path.resolve(__dirname, './public/stylesheets');


module.exports = {
	devtool : 'eval-source-map',
	entry : {
		'test-es6': `${entryPointsPathPrefix}test-es6.js`
		//'impl_login': entryPointsPathPrefix + 'impl_login.js',
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
			{ test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader') }
		]
	},

	plugins: [
		new ExtractTextPlugin('styles.css')
		//new webpack.optimize.OccurenceOrderPlugin(),
		// new webpack.optimize.UglifyPlugin(),
		//new ExtractTextPlugin('[name].css')

		/*new ExtractTextPlugin(`${MODULE_BUILD_CSS_DIR}/styles.css`, {
			allChunks: true
		})*/
		//new ExtractTextPlugin('styles.css')
		// new webpack.optimize.UglifyJsPlugin({
		// 	compressor: { warnings: false }
		// })
	]
};