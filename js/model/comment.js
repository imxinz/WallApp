/**
 * 评论数据模型
 * @author zhengjin
 */
define([], function(){
	'use strict';
	
	var host = 'http://10.16.29.102:8080';
	var path = {
		getCommentListByTopicId: '/comments/getComments', // { topicId: 留言id， start: 起始位置, count: 获取的数量 }
		addComment: '/comments/add' // { topicId: 留言id， userId: 用户id, text: 评论内容 }
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
				url: host + path.getCommentListByTopicId
				data: {
					topicId: topicId,
					start: start,
					count: count
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
		addComment: function(topicId, userId, text){
			return $.ajax({
				url: host + path.addComment
				data: {
					topicId: topicId,
					userId: userId,
					text: text
				},
				dataType: 'json'
			});
		}
	};
});