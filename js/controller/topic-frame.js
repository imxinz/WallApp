define([ 
	'../lib/text!../tpl/topicHeader.html', 
	'../lib/text!../tpl/commentList.html', 
	'../lib/text!../tpl/comment.html', 
	'../lib/url',
	'../lib/microtemplate',
	'../model/comment'],
	function(tplTopicHeader, tplCommentList, tplComment, Url, Template, Comment){
	'use strict';
	
	var topicHeaderContainer = document.getElementById('topicHeaderContainer');
	var commentListContainer = document.getElementById('commentListContainer');
	
	var searchObject = Url.parse(window.location.href).searchObject;
	var topic = {
		id: searchObject.id || '',
		username: decodeURIComponent(searchObject.username) || '',
		headImg: searchObject.headImg || '',
		imgUrl: searchObject.imgUrl || '',
		words: decodeURIComponent(searchObject.words) || '',
		like: searchObject.like || '',
		wallName: searchObject.wallName || ''
	};
	var contentPage = null;
	mui.init();
	/************************************************************************************
	 * 初始化，内容子页面
	 ***********************************************************************************/
	mui.ready(function(){
		setTopicHeader(topic);
		getCommentList(topic.id);
	});
	/************************************************************************************
	 * 业务逻辑实现
	 ***********************************************************************************/
	function setTopicHeader(topic) {
		var topicHeaderHtml = Template.tmpl(tplTopicHeader, {data: topic});
		topicHeaderContainer.innerHTML = topicHeaderHtml;
	}
	function getCommentList(topicId) {
		Comment.getCommentListByTopicId(topicId)
		.done(function(data){
			console.log('CommentList接口返回数据：', data);
			if(data.errno !== 0) return alert('CommentList接口返回数据错误');
			var commentListHtml = Template.tmpl(tplCommentList, {data: data.data.data});
			commentListContainer.innerHTML = commentListHtml;
		})
		.fail(function(error){
			return alert('CommentList接口请求失败');
		});
	}
	function addComment(topic, comment, user) {
		Comment.addComment(topic, comment, user)
		.done(function(data){
			if(data.errno !== 0) return alert('AddComment接口返回数据错误');
			var commentHtml = Template.tmpl(tplComment, {comment: comment, user: user});
			$(commentListContainer).find('ul').prepend(commentHtml);
		})
		.fail(function(error){
			return alert('addComment接口请求失败');
		});
	}
	/************************************************************************************
	 * 交互事件处理
	 ***********************************************************************************/
	mui.ready(function() {
		//发送点击操作
		mui('body').on('tap', '.js-add-comment', function(e) {
			var $commentInput = $('.js-comment-input');
			if( !$commentInput.val() ) return alert('没有内容');
			var comment = {
				content: $commentInput.val() || ''
			}
			var user = {
				name: '匿名',
				headImg: 'http://quc.qhimg.com/dm/180_180_100/t01dc0216d6139b3426.jpg'
			};
			addComment(topic, comment, user);
			$commentInput.val('');
		});
	});
});