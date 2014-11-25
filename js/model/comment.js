/**
 * 评论数据模型
 * @author zhengjin
 */
define([], function(){
	'use strict';
	
	var host = 'http://10.16.29.96:8080';
	var path = {
		getCommentListByTopicId: '/comments/getComments', // { topicId: 留言id， start: 起始位置, count: 获取的数量 }
		addComment: '/comments/add' // { mid: 留言id， wName: 墙名称, content: 评论内容 }
	};
	return {
		/*************************************************************************************
		 * 根据留言id获取评论列表
		 * @param {Number} topicId
		 * @param {Number} start
		 * @param {Number} count
		 */
		getCommentListByTopicId: function(topicId, start, count){
			return $.ajax({
				url: host + path.getCommentListByTopicId,
				data: {
					mid: topicId || '',
					start: start || 0,
					count: count || 10
				},
				dataType: 'json'
			});
		},
		/*************************************************************************************
		 * 添加一条评论
		 * @param {Number} topicId
		 * @param {Number} userId
		 * @param {String} text
		 */
		addComment: function(topic, comment, user){
			return $.ajax({
				url: host + path.addComment,
				data: {
					mid: topic.id,
					wName: topic.wallName,
					content: comment.content
				},
				dataType: 'json'
			});
		}
	};
});