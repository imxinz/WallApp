/**
 * 留言数据模型
 * @author zhengjin
 */
define([], function(){
	'use strict';
	
	var host = 'http://10.16.29.96:8080';
	var path = {
		getTopicListByWallId: '/topic/list', // { wallKey: 墙id, pn: 页 }
		addTopic: '/wall/add', // { wallName: 墙名称 , words: 留言问题, imgUrl: 留言图片 }
		dotTopic: '/wall/dot' // { id: 留言id }
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
				dataType: 'jsonp'
			});
		},
		/*************************************************************************************
		 * 添加一条留言
		 * @param {Number} wallId
		 * @param {Number} userId
		 * @param {Object} topic
		 */
		addTopic: function(wallId, userId, topic){
			return $.ajax({
				url: host + path.addTopic,
				data: {
					wallName: wallId,
					userId: userId,
					words: topic.text,
					imgUrl: topic.photo
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
					topicId: TopicId,
					userId: userId
				},
				dataType: 'json'
			});
		}
	};
});