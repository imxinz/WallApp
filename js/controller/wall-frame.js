define([ 
	'../lib/text!../tpl/photo.html',
	'../lib/microtemplate',
	'../lib/url'], 
	function(tplPhoto, Template, Url){
	'use strict';
	
	var photoContainer = document.getElementById('photoContainer');
	var searchObject = Url.parse(window.location.href).searchObject;
	var wall = {
		key: searchObject.wallKey || '',
		name: searchObject.wallName || ''
	};
	var camera = null;
	var contentPage = null;
	
	/************************************************************************************
	 * 初始化，内容子页面
	 ***********************************************************************************/
	mui.init({
		preloadPages: [{
			id: 'wall-content.html',
			url: 'wall-content.html'
		}],
		subpages : [{
			id : 'wall-content.html',
			url : 'wall-content.html',
			styles : {
				top : '48px',
				bottom : '48px',
				bounce :'vertical'
				//scrollIndicator : "none"
			}
		}]
	});
	mui.ready(function(){
		$('.js-page-head').text(decodeURIComponent(wall.name));
	});
	
	setTimeout(function(){
		if( !window.plus ) return alert('plus没准备好');
		if( !contentPage ) {
			contentPage = plus.webview.getWebviewById('wall-content.html');
		}
		mui.fire(contentPage, 'getTopicList', wall); //触发内容子页面的getTopicList事件
	}, 500);
	
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
			mui.fire(contentPage, 'addTopic', {
				wall: wall,
				topic: topic
			});
			$topicInput.val('');		
		});
		//点击手机相册选择
		mui('body').on('tap', '.js-select-photo', function(e){
			if( !window.plus ) return alert('plus没准备好');
			plus.gallery.pick(function(path){
				alert('Select image success：' + path);
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
	
	/************************************************************************************
	 * 业务逻辑
	 ***********************************************************************************/
	function addTopic(wall, topic, user) {
		Topic.addTopic(wall, topic , user)
		.done(function(data){
			console.log('TopicAdd接口返回数据：', data);
			if(data.errno !== 0) return;
			
			var topicHtml = Template.tmpl(tplTopic, {data: {username: user.name, words: topic.words}});
			$(topicListContainer).find('ul').prepend(topicHtml);
		});
	}
	function addPhoto(path) {
		var task = plus.uploader.createUpload( "http://www.test.com/upload.do", 
			{ method:"POST",blocksize:204800,priority:100 },
			function ( t, status ) {
				// 上传完成
				if ( status == 200 ) { 
					alert( "Upload success: " + t.url );
				} else {
					alert( "Upload failed: " + status );
				}
			}
		);
		task.addFile( path );
		task.start();
		var photoHtml = Template.tmpl(tplPhoto, {data: {src: path}});
		$(photoContainer).show().append(photoHtml);		
	}
	/************************************************************************************
	 * 辅助函数
	 ***********************************************************************************/
});