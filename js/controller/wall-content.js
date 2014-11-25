define([
	'../lib/text!../tpl/topicList.html', 
	'../lib/text!../tpl/topic.html', 
	'../lib/microtemplate',
	'../model/topic'], 
	function(tplTopicList, tplTopic, Template, Topic){
	'use strict';
	var topicListContainer = document.getElementById('topicListContainer');
	mui.init();
	/************************************************************************************
	 * 自定义事件处理
	 ***********************************************************************************/
	window.addEventListener('getTopicList', function(event){
		getTopicList(event.detail);
	});
	window.addEventListener('addTopic', function(event){
		var user = {
			name: '匿名',
			headImg: 'http://quc.qhimg.com/dm/180_180_100/t01dc0216d6139b3426.jpg'
		};
		addTopic(event.detail.wall, event.detail.topic, user);	
	});
	
	/************************************************************************************
	 * 业务逻辑
	 ***********************************************************************************/
	function getTopicList(wall) {
		if( !wall.key ) return alert('缺少墙key');
		Topic.getTopicListByWallId(wall.key)
		.done(function(data){
			console.log('TopicList接口返回数据：', data);
			if(data.total === 0) return alert('TopicList接口数据为空');
			var topicListHtml = Template.tmpl(tplTopicList, {data: data.datas, wall: wall});
			topicListContainer.innerHTML = topicListHtml;
		})
		.fail(function(error){
			return alert(error.message);
		});
	}
	
	function addTopic(wall, topic, user) {
		Topic.addTopic(wall, topic , user)
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
		//留言列表点击操作
		mui('body').on('tap', 'a', function(e) {
			var id = this.getAttribute('href');
			if (id) {
				if (~id.indexOf('.html')) {
					if (window.plus) {
						mui.openWindow({
							id: id,
							url: this.href
						});
					} else {
						document.location.href = this.href;
					}
				} else {
					if (typeof plus !== 'undefined') {
						plus.runtime.openURL(id);
					}
				}
			}
		});
	});
});