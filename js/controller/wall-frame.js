define([ 
	'../lib/text!../tpl/photo.html',
	'../lib/text!../tpl/topic.html', 
	'../lib/text!../tpl/topicList.html', 
	'../lib/microtemplate',
	'../lib/url',
	'../model/topic'],
	function(tplPhoto, tplTopic, tplTopicList, Template, Url, Topic){
	'use strict';
	
	
	var photoContainer = document.getElementById('photoContainer');
	var topicListContainer = document.getElementById('topicListContainer');
	var searchObject = Url.parse(window.location.href).searchObject;

	var camera = null;
	var contentPage = null;
	var wall = {
		key: searchObject.wallKey || '',
		name: searchObject.wallName || '',
		address: searchObject.address || '',
		lat: searchObject.lat || '',
		lng: searchObject.lng || '',
		tel: searchObject.telephone || ''
	};
	
	/************************************************************************************
	 * 设置状态栏颜色，初始化，内容子页面
	 ***********************************************************************************/
	mui.init({
//		preloadPages: [{
//			id: 'wall-content.html',
//			url: 'wall-content.html'
//		}],
//		subpages : [{
//			id : 'wall-content.html',
//			url : 'wall-content.html',
//			styles : {
//				top : '48px',
//				bottom : '',
//				bounce :'vertical'
//				//scrollIndicator : "none"
//			}
//		}]
//		pullRefresh : {
//			container: '#topicListContainer',//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
//			down : {
//				contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
//				contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
//				contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
//				callback : function(){
//					var self = this;
//					getTopicList(wall, self);
//				} //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
//			}
//		}
	});
	mui.plusReady(function(){
		//设置系统顶部栏颜色
		plus.navigator.setStatusBarBackground( "#ffd600" );
	});
	mui.ready(function(){
		$('.js-page-head').text(decodeURIComponent(wall.name));
		getTopicList(wall);
		postExtraData(wall); //额外向服务端发送数据
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
	function getTopicList(wall, self) {
		if( !wall.key ) return alert('缺少墙key');
		Topic.getTopicListByWallId(wall.key)
		.done(function(data){
			console.log('TopicList接口返回数据：', data);
			if(data.total === 0) return alert('TopicList接口数据为空');
			var topicListHtml = Template.tmpl(tplTopicList, {data: data.datas, wall: wall});
//			self.endPulldownToRefresh();
//			alert(topicListHtml);
			topicListContainer.innerHTML = topicListHtml;
		})
		.fail(function(error){
			return alert('TopicList接口请求失败：' + error.message);
		});
	}
	
	function postExtraData(wall){
		$.ajax({
			url: 'http://210.52.217.236/wall/add',
			type: 'POST',
			data: wall,
			error: function(){
				alert('/wall/add接口请求失败');
			}
		});
	}
	
	function addTopic(wall, topic, user) {
		topic.imgUrl = $(photoContainer).find('img').attr('src') || '';

		Topic.addTopic(wall, topic , user)
		.done(function(data){
			console.log('TopicAdd接口返回数据：', data);
			if(data.errno !== 0) return;
			$(photoContainer).hide().find('img').remove();
			var topicHtml = Template.tmpl(tplTopic, {topic: topic, user: user, wall: wall});
			$(topicListContainer).prepend(topicHtml);
			window.scrollTo(0, 0);
		});
	}
	function addPhoto(path) {
		var task = plus.uploader.createUpload( "http://210.52.217.236/topic/uploadImg", 
//		var task = plus.uploader.createUpload( "http://182.118.20.208/topic/uploadImg",
//		var task = plus.uploader.createUpload( "http://10.16.29.96:8080/topic/uploadImg", 
			{ method:"POST",priority:100 },
			function ( t, status ) {
				//alert(JSON.stringify(arguments));
				// 上传完成
				if ( status == 200 ) { 
//					alert( "Upload success: " + t.url );
//					alert('图片上传接口返回数据：' + arguments);
					var argObject = JSON.parse(arguments['0'].responseText);
					var photoHtml = Template.tmpl(tplPhoto, {data: {src: argObject.data}});
					$(photoContainer).show().append(photoHtml);
				} else {
					alert( "Upload failed: " + status );
				}
			}
		);
//		alert('addFile:' + path);
		task.addFile( path, {key: 'upfile'} );
		task.start();
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
		//留言列表点击操作
		mui('body').on('tap', 'a', function(e) {
			var id = this.getAttribute('href');
			if (id) {
				if (~id.indexOf('.html')) {
					if (window.plus) {
//						alert(this.href);
						mui.openWindow({
							id: id,
//							url: this.href,
							styles: {
								scrollIndicator: none
							}
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
		//点击手机相册选择
		mui('body').on('tap', '.js-select-photo', function(e){
			if( !window.plus ) return alert('plus没准备好');
			plus.gallery.pick(function(path){
//				alert('Select image success：' + path);
				addPhoto(path);
			}, function(error){
				alert('Select image failed：' + error.message);
			});
		});
		//点击拍摄
		mui('body').on('tap', '.js-take-photo', function(e){
			if( !window.plus ) return alert('plus没准备好');
			if( !camera ) camera = plus.camera.getCamera();
			camera.captureImage(function(path){
//				alert( "Capture image success: " + path );
				addPhoto(path);
			},function(error){
				alert( "Capture image failed: " + error.message );
			});
		});
		mui('body').on('tap', '.js-topic-input', function(e){
			var content = plus.webview.getWebviewById('wall-content.html');
			plus.webview.hide(content);
		});
	});
});