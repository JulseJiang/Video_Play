//----------------------------------------------
//这是一个模仿迅雷的视频播放器，它实现了常
//见的一些功能：
//  1.播放或暂停；changePlayState()和视频绑定事件--ok
//  2.停止；stopVideo()--ok
//  3.快放或慢放；
//  4.视频时长及已播放时长显示；
//  5.静音；muteVideo()--ok
//  6.音量调整；
//  7.全屏播放；controlFullScreen()
//  8.播放进度和缓存进度显示。
//----------------------------------------------

$(function(){
	initData();
//	alert('hello');
	bindEvent();
});
function initData(){
	$video = $('video');//视频
	video = $video.get(0);//视频js对象
	$sound = $('.sound');//声音图标
	$stop = $('.stop');//停止视频
	$playing = $('.playing');//播放状态
}
function bindEvent(){
	$video.bind('click',function(){//绑定点击事件：点击切换播放状态
		console.log('blindEvent：点击切换播放状态');
		changePlayState();
	});
	$video.bind('playing',function(){
		console.log('blindEvent：视频播放中');
		$playing.removeClass('pause');
	});
	$video.bind('pause',function(){
		console.log('blindEvent：视频暂停中');//视频暂停时添加广告--todo
		$playing.addClass('pause');
	});
	$video.bind('volumechange',function(){
		console.log('blindEvent：视频静音'+video.muted);//调节音量--todo
		if(video.muted){
			$sound.addClass('mute');
		}else{
			$sound.removeClass('mute');
		}
	});
	$playing.bind('click',function(){
		changePlayState();
	})
	$stop.bind('click',function(){
		video.pause();
		video.currentTime=0;
		$video.attr({//视频停止时黑屏添加海报或广告--todo
			
		});
	});
	$sound.bind('click',function(){
		changeSoundState();
	});
}
/*切换播放状态--点击图标，点击视频时触发*/
function changePlayState(){
	console.log('changePlayState：修改视频播放状态'+video.paused);
	if(video.paused){
		video.play();
	}else{
		video.pause();
	}
}
/*静音：点击图标切换静音状态，视频静音时显示静音状态--todo*/
function changeSoundState(){
	console.log('changeSoundState：切换静音状态');
	if(video.muted){
		video.muted=false;
	}else{
		video.muted=true;
	}
//	$sound.toggle();//hidden属性对div不起作用
}
/*停止*/
function stopVideo(){
	console.log('stopVideo：停止播放视频');
	video.pause();
	video.currentTime=0;
}
