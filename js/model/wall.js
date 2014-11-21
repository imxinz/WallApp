/**
 * 墙数据模型
 * @author zhengjin
 */
define([], function(){
	'use strict';
	
	var host = 'http://10.16.29.102:8080';
	var path = {
		getWallListByLocation: '/api/getPlaceData' // { lat: 经度， lng: 纬度 }
	};
	return {
		/*************************************************************************************
		 * 根据经纬度获取墙列表
		 * @param {Object} wall
		 */
		getWallListByLocation: function(coords){
			return $.ajax({
				url: host + path.getWallListByLocation,
				data: {
					lat: coords.latitude || '',
					lng: coords.longitude || ''
				},
				dataType: 'jsonp'
			});
		},
		/*************************************************************************************
		 * 根据id获取墙信息
		 * @param {Number} id
		 */
		getWallById: function(id){
			alert('未实现');
		}
	};
});