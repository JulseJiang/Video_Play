//----------------------------------------------
//这是一个模仿迅雷的视频播放器，它实现了常
//见的一些功能：
//  1.播放或暂停；changePlayState()和视频绑定事件--ok
//  2.停止；stopVideo()--ok
//  3.快放或慢放；
//  4.视频时长及已播放时长显示；
//  5.静音；muteVideo()--ok
//  6.音量调整；
//  7.全屏播放；toFullScreen()，toDefaultScreen()--ok
//  8.播放进度和缓存进度显示。
//拓展功能1:实现上一首下一首切换--ok
//----------------------------------------------

$(function(){
	initData();
	initVideo();//初始化视频
	bindEvent();
	toDefaultScreen();//初始化视频大小
});
function initData(){
	video_json =[{'src':'media/oceans.mp4','poster':'img/poster1.jpg'},
				{'src':'media/林宥嘉 - 全世界谁倾听你.mp4','poster':'img/poster3.png'},
				{'src':'media/林忆莲 - 分分钟需要你.mp4','poster':'img/poster2.png'}];
	$video = $('video');//视频
	video = $video.get(0);//视频js对象
	video_index=0;
	$sound = $('.sound');//声音图标
	$stop = $('.stop');//停止视频
	$playing = $('.playing');//播放状态
	$fullScreen = $('.fullScreen');//全屏
	$speedUp = $('.speedUp');//加速播放
	$slowDown = $('.slowDown');//慢速播放
	$video_control = $('.video_control');//控制台
	$pre = $('.pre');//上一首
	$next = $('.next');//下一首
	fullScreenFlag = false;
	screen_width=$(this).width();//全屏宽
	screen_height = $(this).height()-63;//全屏高
	screen_orient_width=900;
	screen_orient_height=400;
	$progress_div = $('.progress');//容器
	$progress = $('progress');//进度条
}
function initVideo(){
	$video.attr({
		'src':video_json[video_index].src,
		'poster':video_json[video_index].poster
	});
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
//		$video.attr({//视频停止时黑屏添加海报或广告--todo
//			
//		});
	});
	$sound.bind('click',function(){
		changeSoundState();
	});
	$fullScreen.bind('click',function(){
		if(!fullScreenFlag){
			toFullScreen();
		}else{
			toDefaultScreen();
		}
	});
	$pre.bind('click',function(){
		video_index=(--video_index+video_json.length)%video_json.length;
		console.log('video_index'+video_index);
		initVideo();
	});
	$next.bind('click',function(){
		video_index=(++video_index)%video_json.length;
		console.log('video_index'+video_index);
		initVideo();
	});
	$progress_div.bind('click',function(e){
		console.log('点击x：'+e.offsetX+' '+$progress.width());
		$progress.val((e.offsetX*1.0)/$progress.width());
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
/*全屏*/
function toFullScreen(){
	screen_width=$(this).width();
	screen_height = $(this).height()-63;
	console.log('fullScreen：全屏'+screen_width+" "+screen_height);
	fullScreenFlag=true;
	$video.attr({
		'width':screen_width+'px',
		'height':screen_height+'px'
//		'width':'100%',
//		'height':'100%'
	});
	$('body,html').addClass('black');
}	
/*退出全屏*/
function toDefaultScreen(){
	fullScreenFlag=false;
	$video.attr({
		'width':screen_orient_width+'px',
		'height':screen_orient_height+'px'
	});
	$('body,html').removeClass('black');
}


