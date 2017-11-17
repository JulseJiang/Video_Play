//----------------------------------------------
//这是一个模仿迅雷的视频播放器，它实现了常
//见的一些功能：
//  1.播放或暂停；changePlayState()和视频绑定事件--ok
//  2.停止；stopVideo()--ok
//  3.快放或慢放；切换播放状态时，速率还原为1--ok
//  4.视频时长及已播放时长显示；--ok
//  5.静音；muteVideo()--ok
//  6.音量调整；--ok
//  7.全屏播放；toFullScreen()，toDefaultScreen()--ok
//  8.播放进度  chrome不支持本地视频设置时间，ie支持。--ok
//  9.缓存进度显示。--ok
//拓展功能1:实现上一首下一首切换--ok
//拓展功能2：双击全屏切换,单击播放暂停--ok
//----------------------------------------------

$(function(){
	initData();
	initVideo();//初始化视频
	bindEvent();
	toDefaultScreen();//初始化视频大小
});
function initData(){
	video_json =[{'src':'http://ozjob9w4u.bkt.clouddn.com/oceans.mp4','poster':'img/poster1.jpg'},
				{'src':'http://ozjob9w4u.bkt.clouddn.com/%E6%9E%97%E5%AE%A5%E5%98%89%20-%20%E5%85%A8%E4%B8%96%E7%95%8C%E8%B0%81%E5%80%BE%E5%90%AC%E4%BD%A0.mp4','poster':'img/poster3.png'},
				{'src':'http://ozjob9w4u.bkt.clouddn.com/%E6%9E%97%E5%BF%86%E8%8E%B2%20-%20%E5%88%86%E5%88%86%E9%92%9F%E9%9C%80%E8%A6%81%E4%BD%A0.mp4','poster':'img/poster2.png'}];
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
	screen_height = $(this).height()-103;//全屏高
	screen_orient_width=900;
	screen_orient_height=400;
	$progress_sound_div = $('.progress_sound');//音频容器
	$progress_sound = $('#progress_sound');//音频进度条
	$progress_video_div = $('.progress_video');//视频容器
	$progress_video = $('#progress_video');//视频进度条
	$progress_video_buffer = $('#progress_video_buffer');//缓存进度条
	$currentTime = $('.currentTime');//视频当前时间
	$duration = $('.duration');//视频总时长
	click_number=0;//记录点击次数
	$slowDown = $('.slowDown');//减速
	$speedUp = $('.speedUp');//加速
	play_back_rate = 1;
}
function initVideo(){
	$video.attr({
		'src':video_json[video_index].src,
		'poster':video_json[video_index].poster
	});
}
function bindEvent(){
	$video.bind('durationchange',function(){
		console.log('durationchange：视频总时长已改变');
		console.log('video.duration:'+video.duration);
		$progress_video.attr({
			'max':video.duration
		});
		$progress_video_buffer.attr({
			'max':video.duration
		});
		$duration.text(timeStr(video.duration));//设置标签显示的时间
	});
	$video.bind('progress',function(){//视频加载中
		console.log('视频加载中');
		if(video.buffered.length>0){
			console.log('video.buffered.end(0)'+video.buffered.end(0));
			$progress_video_buffer.val(video.buffered.end(0));
		}
	});
	$video.bind('canplay',function(){
		console.log('canplay：视频准备就绪');
//		video.currentTime=30;
	});
	$video.bind('click',function(){//绑定点击事件：点击切换播放状态
		clickEvent();
	});
	$video.bind('play',function(){
		console.log('$video play：视频播放中');
		$playing.removeClass('pause');
	});
	$video.bind('pause',function(){
		console.log('$video pause：视频暂停中');//视频暂停时添加广告--todo
		$playing.addClass('pause');
	});
	$video.bind('volumechange',function(){
		console.log('$video volumechange：视频静音'+video.muted);//调节音量
		if(video.muted){
			$sound.addClass('mute');
		}else{
			$sound.removeClass('mute');
		}
	});
	$video.bind('timeupdate',function(){
//		console.log('$video：timeupdate'+video.currentTime);
		$progress_video.val(video.currentTime);
		$currentTime.text(timeStr(video.currentTime));
	});
	$playing.bind('click',function(){
		console.log('$playing click 点击按钮：视频静音'+video.muted);//调节音量
		changePlayState();
	})
	$stop.bind('click',function(){
		stopVideo();
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
	$progress_sound_div.bind('click',function(e){
		console.log('点击$progress_sound_div：'+e.offsetX+' '+$progress_sound.width());
		var volume = (e.offsetX*1.0)/$progress_sound.width();
		$progress_sound.val(volume);
		video.volume=volume;
	});
	$progress_video_div.bind('click',function(e){
		var currentTime = (e.offsetX)/$progress_video.width()*$progress_video.attr('max');
		video.currentTime= Math.floor(currentTime);
		console.log('点击$progress_video_div：'+e.offsetX+' '+$progress_video.width()+"currentTime "+video.currentTime+" "+currentTime.toFixed(1));
	});
	$slowDown.bind('click',function(){
		if(play_back_rate>0.5){
			play_back_rate = play_back_rate -0.2;
			video.playbackRate = play_back_rate;
		}
		console.log('video.playbackRate:'+video.playbackRate);
	});
	$speedUp.bind('click',function(){
		if(play_back_rate<1.5){
			play_back_rate = play_back_rate +0.2;
			video.playbackRate = play_back_rate;
		}
		console.log('video.playbackRate:'+video.playbackRate);
	});
	
}
function timeStr(duration_second){
	var h = Math.floor(duration_second/360);
	var m = Math.floor((duration_second-360*h)/60);
	var s = Math.floor(duration_second-60*m);
	h=strAdd0(h);
	m=strAdd0(m);
	s=strAdd0(s);
	return h+":"+m+":"+s;
}
function strAdd0(num){
	if(num<10){
		return '0'+num;
	}else return num;
}
function clickEvent() {
	click_number++;
	console.log('click_number=' + click_number);
	var val = setTimeout("call();", 250);
	if(click_number == 2) {
		clearTimeout(val);
	}
}

function call() {
	if(click_number == 1) {
		console.log('$video click：点击切换播放状态');
		changePlayState();
		click_number = 0;
	} else if(click_number == 2) {
		console.log('$video dblclick：点击切换全屏');
		$fullScreen.click();
		click_number = 0;
	}
}
/*切换播放状态--点击图标，点击视频时触发*/
function changePlayState(){
	play_back_rate = 1;
	video.playbackRate=play_back_rate;
	console.log('changePlayState：修改视频播放状态'+video.paused);
	if(video.paused){
		video.play();
	}else{
		video.pause();
	}
}
/*静音：点击图标切换静音状态，视频静音时显示静音状态*/
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
	console.log('fullScreen：全屏'+screen_width+" "+screen_height);
	fullScreenFlag=true;
	$video.attr({
		'width':screen_width+'px',
		'height':screen_height+'px'
//		'width':'100%',
//		'height':'100%'
	});
	$('body,html').addClass('black');
	$progress_video.css({
		'width':screen_width+'px'
	});
	$progress_video_buffer.css({
		'width':screen_width+'px'
	});
}	
/*退出全屏*/
function toDefaultScreen(){
	fullScreenFlag=false;
	$video.attr({
		'width':screen_orient_width+'px',
		'height':screen_orient_height+'px'
	});
	$progress_video_buffer.css({
		'width':screen_orient_width+'px'
	});
	$progress_video.css({
		'width':screen_orient_width+'px'
	});
	$('body,html').removeClass('black');
}


