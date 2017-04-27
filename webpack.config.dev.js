/**
 * Created by yijaejun on 01/02/2017.
 */
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const entryPoint = {
	'js' : './public/javascripts/',
	'componentsJs' : './public/components/',
	'vendor' : './public/javascripts/vendor/',
	'css' : './public/stylesheets/'
};

module.exports = {
	// devtool: 'inline-source-map',
	devtool : 'eval-source-map',
	entry : {
		// 'style' : `${entryPoint.css}styles.css`,
		'index' : `${entryPoint.js}index.js`,
		'signup' : `${entryPoint.js}signup.js`,
		'video_list' : `${entryPoint.js}video_list.js`,
		'video_view' : `${entryPoint.js}video_view.js`,
		'm_nav' : `${entryPoint.js}m_nav.js`
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
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('css-loader')
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
		// todo css는 모듈 단위로 분리하여 압축을 진행하고 필요한 부분마다 import하는 형식으로 변경한다.
		// todo 서드파티는 min로 제공되는 것을 사용하고 직접 작성한 부분만 웹팩으로 압축을 진행할 수 있도록 한다.
	]
};