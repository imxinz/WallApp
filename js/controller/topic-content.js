define([
	'../lib/text!../tpl/topicHeader.html', 
	'../lib/text!../tpl/commentList.html', 
	'../lib/text!../tpl/comment.html', 
	'../lib/microtemplate',
	'../model/comment'], 
	function(tplTopicHeader, tplCommentList, tplComment, Template, Comment){
	'use strict';
	var topicContainer = document.getElementById('topicContainer');
	var commentListContainer = document.getElementById('commentListContainer');
	mui.init();
	/************************************************************************************
	 * 自定义事件处理
	 ***********************************************************************************/
	window.addEventListener('setTopic', function(event){
		//设置顶部留言区块
		setTopic(event.detail.topic);
	});
	window.addEventListener('getCommentList', function(event){
		alert('getCommentList');
		getTopicList(event.detail.topic);
	});
	window.addEventListener('addComment', function(event){
		var user = {
			name: '匿名',
			headImg: 'http://quc.qhimg.com/dm/180_180_100/t01dc0216d6139b3426.jpg'
		};
		addComment(event.detail.topic, event.detail.comment, user);	
	});
	
	/************************************************************************************
	 * 业务逻辑
	 ***********************************************************************************/
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
	
	function setTopic(topic){
		var topicHeaderHtml = Template.tmpl(tplTopicHeader, {data: topic});
		topicContainer.innerHTML = topicHeaderHtml;
	}
	
	function addComment(topic, comment, user) {
		Comment.addComment(topic, comment , user)
		.done(function(data){
			console.log('TopicAdd接口返回数据：', data);
			if(data.errno !== 0) return;
			var _data = {
				username: user.name,
				words: topic.words,
				headImg: user.headImg,
				imgUrl: ''
			}
			var topicHtml = Template.tmpl(tplTopic, {data: _data});
			plus.webview.show(plus.webview.getWebviewById('wall-content.html'));
			$(topicListContainer).find('ul').prepend(topicHtml);
		});
	}
	
	/************************************************************************************
	 * 交互事件处理
	 ***********************************************************************************/
	mui.ready(function() {
		//点赞
		mui('body').on('tap', '.js-like-topic:not(.js-liked)', function(e){
			var $this = $(this);
			alert($this.closest('.js-topic-item').length);
			var topicId = $this.closest('.js-topic-item').data('id');
			
			Topic.dotTopic(topicId)
			.done(function(data){
				if(data.errno !== 0) return alert('赞接口返回数据错误');
				$this.addClass('js-liked').text('已赞');
			})
			.fail(function(error){
				return alert('赞接口请求失败');
			});
		});
	});
});