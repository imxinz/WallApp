define([
	'../lib/text!../tpl/topicList.html', 
	'../lib/microtemplate', 
	'../lib/url', 
	'../model/wall', 
	'../model/topic'], 
	function(tplTopicList, Template, Url, Wall, Topic){
	'use strict';
	
	var topicListContainer = document.getElementById('topicListContainer');
	
	mui.init();
	
	/************************************************************************************
	 * 获取数据，渲染页面
	 ***********************************************************************************/
	function getTopicList(wallId) {
		Topic.getTopicListByWallId(wallId)
		.done(function(data){
			console.log('TopicList接口返回数据：', data);
			if(data.total === 0) return;
			var topiListHtml = Template.tmpl(tplTopicList, {data: data.datas});
			topicListContainer.innerHTML = topiListHtml;
		});
	}
	
	mui.ready(function() {
		var wallId = Url.parse(window.location.href).key;
		getTopicList(wallId);//加载留言
	});
	
	/************************************************************************************
	 * 交互事件处理
	 ***********************************************************************************/
	mui.ready(function() {
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
		//发送点击操作
		mui('body').on('tap', '.js-add-topic', function(e) {
			addTopic(topic);
		});
		
	});
	
	/************************************************************************************
	 * 业务逻辑
	 ***********************************************************************************/
	functionn addTopic(topic) {
		
	}
	
	/************************************************************************************
	 * 辅助函数
	 ***********************************************************************************/
});