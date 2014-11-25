/**
 * 留言数据模型
 * @author zhengjin
 */
define([], function(){
	'use strict';
	
	var host = 'http://10.16.29.96:8080';
	var path = {
		getTopicListByWallId: '/topic/list', // { wallKey: 墙id, pn: 页 }
		addTopic: '/topic/add', // { wallName: 墙名称 , words: 留言问题, imgUrl: 留言图片 }
		dotTopic: '/topic/dot' // { id: 留言id }
	};
	return {
		/*************************************************************************************
		 * 获取墙的留言
		 * @param {Object} wallId
		 */
		getTopicListByWallId: function(wallId){
			return $.ajax({
				url: host + path.getTopicListByWallId,
				data: {
					wallKey: wallId,
					pn: 1
				},
				dataType: 'json'
			});
		},
		/*************************************************************************************
		 * 添加一条留言
		 * @param {Number} wallId
		 * @param {Number} userId
		 * @param {Object} topic
		 */
		addTopic: function(wall, topic, user){
			return $.ajax({
				url: host + path.addTopic,
				data: {
					wallName: wall.name || '',
					wallKey: wall.key || '',
					words: topic.words || '',
					imgUrl: topic.imgUrl || '',
					userId: user.id || ''
				},
				dataType: 'json'
			});
		},
		/**************************************************************************************
		 * 给一条留言点赞
		 * @param {Number} topicId
		 * @param {Number} userId
		 * @param {String} type
		 */
		dotTopic: function(topicId, userId, type){
			return $.ajax({
				url: host + path.dotTopic,
				data: {
					id: topicId || '',
					userId: userId || ''
				},
				dataType: 'json'
			});
		}
	};
});