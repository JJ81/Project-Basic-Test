/**
 * Created by yijaejun on 30/03/2017.
 */
/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';
requirejs(
	[
		'jquery',
		'vue',
		'common'
	],
	function ($, Vue, utils) {

		var _data;

		(function () {
			_data = JSON.parse($('#data-video-list').val());
			for(var i=0,size=_data.length;i<size;i++){
				_data[i].hits = utils.numberFormatter(_data[i].hits);
				_data[i].created_dt = utils.dateFormatter(_data[i].created_dt);
			}
		})();




		function dateFormatter(date){
			var d = new Date(date);
			return d.getFullYear() + '-' +(d.getMonth() + 1) + '-' + d.getDate();
		}

		function numberFormatter(num){
			return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		}


		new Vue({
			delimiters : ['<%', '%>'],
			el : '#list-video',
			data : {
				imageUrl : $('#static-url').val(),
				video_list : _data
			},
			methods : {
				makeUrl : function (data){
					return `/channel/${data.channel_id}/video/${data.video_id}`;
				},
				makeImg :  function (data) {
					return `${this.imageUrl}channel/${data.channel_id}/${data.video_id}/thumbnail`;
				},
				asending : function () {
					var data = this.video_list;
					var size = data.length-1;
					var tmp;

					for(var j = 0;j<size;j++){ // N
						for(var i = 0;i<size-j;i++){ // M
							if(data[i].created_dt > data[i+1].created_dt){
								tmp = data[i];
								data[i] = data[i+1];
								data[i+1] = tmp;
							}
						}
					}

					this.video_list = [];
					this.video_list =  data;
				},
				desending : function () {
					var data = this.video_list;
					var size = data.length-1;
					var tmp;

					for(var j = 0;j<size;j++){ // N
						for(var i = 0;i<size-j;i++){ // M
							if(data[i].created_dt < data[i+1].created_dt){
								tmp = data[i];
								data[i] = data[i+1];
								data[i+1] = tmp;
							}
						}
					}

					this.video_list = [];
					this.video_list =  data;
				}
			}
		});

	}); // end of func