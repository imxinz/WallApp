define([ 
	'../lib/text!../tpl/photo.html',
	'../lib/text!../tpl/topic.html', 
	'../lib/text!../tpl/topicList.html', 
	'../lib/microtemplate',
	'../lib/url',
	'../model/topic'],
	function(tplPhoto, tplTopic, tplTopicList, Template, Url, Topic){
	'use strict';
		
	
	/************************************************************************************
	 * 设置状态栏颜色，初始化，内容子页面
	 ***********************************************************************************/

	mui.plusReady(function(){
		//设置系统顶部栏颜色
		plus.navigator.setStatusBarBackground( "#ffd600" );
	});
	mui.ready(function(){
		$('.js-page-head').text(decodeURIComponent(wall.name));
		
	});
	
//	setTimeout(function(){
//		if( !window.plus ) return alert('plus没准备好');
//		if( !contentPage ) {
//			contentPage = plus.webview.getWebviewById('wall-content.html');
//		}
//		mui.fire(contentPage, 'getTopicList', wall); //触发内容子页面的getTopicList事件
//	}, 500);

	/************************************************************************************
	 * 业务逻辑
	 ***********************************************************************************/
	function getCommentList(){
		
	}
	
	/************************************************************************************
	 * 交互事件处理
	 ***********************************************************************************/
	mui.ready(function() {
		//发送点击操作
		mui('body').on('tap', '.js-add-topic', function(e) {
			var $topicInput = $('.js-topic-input');
			if( !$topicInput.val() ) return alert('没有内容');
			var topic = {
				photoImg: '',
				words: $topicInput.val() || ''
			}
			var user = {
				name: '匿名',
				headImg: 'http://quc.qhimg.com/dm/180_180_100/t01dc0216d6139b3426.jpg'
			};
//			mui.fire(contentPage, 'addTopic', {
//				wall: wall,
//				topic: topic
//			});
			addTopic(wall, topic, user);
			$topicInput.val('');		
		});
		//点赞
		mui('body').on('tap', '.js-like-topic:not(.js-liked)', function(e){
			var $this = $(this);
//			alert($this.closest('.js-topic-item').length);
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