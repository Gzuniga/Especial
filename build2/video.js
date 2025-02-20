	function GetHash(string) {
		var hash = 0;
		if (string.length == 0) return hash;
		for (x = 0; x <string.length; x++) {
		ch = string.charCodeAt(x);
				hash = ((hash <<5) - hash) + ch;
				hash = hash & hash;
			}
		return hash;
	};
	

   function ShowCtr(url, tema){
		document.getElementById("lnkCtrl").click();
		url= url.replace("videos2/", "");
		url= url.replace("videos/", "");
		var nP = url.indexOf("#");
		  
		if (nP == -1){
			nP = url.indexOf("&");
		};
		if (nP == -1){
			nP = url.length;
		};
		url = url.substring(1,nP);
		 
		$("#TitleVideo").html(tema + '<br/>' + url);
	};
	  
	function ShowMsg(title, msg) {
		try {
			//se despliega el mensaje
			$.jGrowl('<b>' + title + '</b> <br />'+msg);

		} catch (e) {
			//alert("Error de ShowMsg: " + e.description);
		}
	};
	
	function ShowMsgParent(title, msg) {
		try {
			//se despliega el mensaje
			window.opener.ShowMsg(title,msg);

		} catch (e) {
			//alert("Error de ShowMsgParent: " + e.description);
		}
	};

	
	var myWindow;
	function ChangeVideo(url){
		window.open(url,'_blank');		
	};
	
	function CreateWindow(fullUrl){
		//se crea la ventana con la URL indicada 
		myWindow = window.open(fullUrl,'popup','fullscreen=1,toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=1,width=600,height=350,left=50,top=0');
	};
	
	function SendKeyCode(keyCode){
		//alert("LLEGO");
		myWindow.ReceiveKey(keyCode);
	};
	
	function ControlSMG(msg){
		ShowMsgParent(document.title, msg);
	};
	
	//KEY ACTIONS
	function VideoKeyPress(keyCode) {
		//document.title="KeyPress: " + keyCode;
		var video = $('#myVideo');
		
		//si es tecla Space, Enter, P: pausa / play
		if (keyCode == 32 || keyCode ==13 || keyCode ==80){
			if(video[0].paused || video[0].ended) {
				//document.title="Video Play";
				ControlSMG('Video Play');
				$('.btnPlay').addClass('paused');
				video[0].play();
			}
			else {
				//document.title="Video Paused";
				ControlSMG('Video Pausa');
				$('.btnPlay').removeClass('paused');
				video[0].pause();
			}
		};
		
		 
		//si es tecla Q: cerrar ventana
		if (keyCode == 81){
			//document.title= "Cerrar ventana";
			ControlSMG('Video cerrado');
			try{
				window.close();
			}catch(e){
			};
		};	

		//se quiere Mute // No Mute
		if (keyCode == 77){
			//document.title= "Muted / no Muted";
			//si esta en muted
			if (video[0].volume==0){
				//se regresa a como estaba
				video[0].volume = 1;	
				ControlSMG('Audio normal');				
			}else{
				//se deja en mute
				video[0].volume =0;
				ControlSMG('Video silenciado');
			};
			
		};	

		
		//si es tecla F: fullscreen / no fullscreen
		if (keyCode == 70){
			screenfull.toggle($('#container')[0]);
			 
			//document.title="Video FullScreen";
			if($.isFunction(video[0].webkitEnterFullscreen)) {
				ControlSMG('Video Fullscreen');
				video[0].className = "videoClean";
				if (video[0].hasAttribute("controls")) {
					 video[0].removeAttribute("controls");
				};
				//video[0].webkitEnterFullscreen();
				
			}	
			else if ($.isFunction(video[0].mozRequestFullScreen)) {
				ControlSMG('Video tamano normal');
				video[0].removeClass('videoClean');
				video[0].setAttribute("controls","controls");
				//video[0].mozRequestFullScreen();
			}
			else {
				alert('Your browsers doesn\'t support fullscreen');
			}
		};		

		//si es keyCode = 0 se quiere fullscreen y sólo fullscreen
		if (keyCode == 0){
			//document.title="Video FullScreen";
			screenfull.request($('#container')[0]);
			if($.isFunction(video[0].webkitEnterFullscreen)) {
				ControlSMG('Video fullscreen');
				video[0].className = "videoClean";
				if (video[0].hasAttribute("controls")) {
					 video[0].removeAttribute("controls");
				};
			}
		};			

		//si es tecla C: mostrar controles
		if (keyCode == 67){
			
			
			//si se estan mostrando
			if (video[0].hasAttribute("controls")) {
				video[0].className = "videoClean";
				video[0].removeAttribute("controls");
				//document.title= "Se ocultan los controles";
				ControlSMG('Se ocultan los controles');
			} else {
				video.removeClass('videoClean');
				video[0].setAttribute("controls", "controls");
				//document.title= "Se muestran los controles";
				ControlSMG('Se muestran los controles');
			}
		};	
		
		
		//si es tecla >: adelantar 2 segundos
		if (keyCode == 39){
			//document.title="Video seek + 2";
			video[0].currentTime=video[0].currentTime + 2;
			ControlSMG('Se avanza el video');
		};	
		//si es tecla <: atrazar 2 segundos
		if (keyCode == 37){
			//document.title="Video seek - 2";
			video[0].currentTime=video[0].currentTime - 2;
			ControlSMG('Se retrocede el video');
		};	

		//si es tecla +: aumentar volumen
		if (keyCode == 107 || keyCode == 38){
			//document.title="+ Volumen: " + video[0].volume ;
			ControlSMG('Aumenta volumen');
			video[0].volume =video[0].volume + 0.1;
		};	
		//si es tecla -: reducir volumen
		if (keyCode == 109 || keyCode == 40){
			//document.title="- Volumen: " + video[0].volume ;
			ControlSMG('Disminuye volumen');
			video[0].volume=video[0].volume - 0.1;
		};	

		
		
	};
 
 
$(document).ready(function(){
	//INITIALIZE
	var video = $('#myVideo');
	 
		
	//remove default control when JS loaded
	video[0].removeAttribute("controls");
	$('.control').show().css({'bottom':-45});
	$('.loading').fadeIn(10);
	$('.caption').fadeIn(10);
 
 
	//before everything get started
	video.on('loadedmetadata', function() {
		$('.caption').animate({'top':-45},10);
			
		//set video properties
		$('.current').text(timeFormat(0));
		$('.duration').text(timeFormat(video[0].duration));
		updateVolume(0, 0.7);
			
		//start to get video buffering data 
		setTimeout(startBuffer, 15);
			
		//bind video events
		$('.videoContainer')
		.append('<div id="init"></div>')
		.hover(function() {
			$('.control').stop().animate({'bottom':0}, 50);
			$('.caption').stop().animate({'top':0}, 50);
		}, function() {
			if(!volumeDrag){
				$('.control').stop().animate({'bottom':-45}, 500);
				$('.caption').stop().animate({'top':-45}, 500);
			}
		})
		.on('click', function() {
			$('#init').remove();
			$('.btnPlay').addClass('paused');
			$(this).unbind('click');
			video[0].play();
			 
		});
		$('#init').fadeIn(20);
		
		
		
	});
	 
	 
	 
	//display video buffering bar
	var startBuffer = function() {
		var currentBuffer = video[0].buffered.end(0);
		var maxduration = video[0].duration;
		var perc = 100 * currentBuffer / maxduration;
		$('.bufferBar').css('width',perc+'%');
			
		if(currentBuffer < maxduration) {
			setTimeout(startBuffer, 500);
		}
	};	
	
	//display current video play time
	video.on('timeupdate', function() {
		var currentPos = video[0].currentTime;
		var maxduration = video[0].duration;
		var perc = 100 * currentPos / maxduration;
		$('.timeBar').css('width',perc+'%');	
		$('.current').text(timeFormat(currentPos));	
	});
	
	//CONTROLS EVENTS
	//video screen and play button clicked
	video.on('click', function() { MyLib.playpause(); } );
	$('.btnPlay').on('click', function() { MyLib.playpause(); } );
	 
	var playpause = function() {
		 
		if(video[0].paused || video[0].ended) {
			$('.btnPlay').addClass('paused');
			video[0].play();
		}
		else {
			$('.btnPlay').removeClass('paused');
			video[0].pause();
		}
	};
	
 
	
	//speed text clicked
	$('.btnx1').on('click', function() { fastfowrd(this, 1); });
	$('.btnx3').on('click', function() { fastfowrd(this, 3); });
	var fastfowrd = function(obj, spd) {
		$('.text').removeClass('selected');
		$(obj).addClass('selected');
		video[0].playbackRate = spd;
		video[0].play();
	};
	
	//stop button clicked
	$('.btnStop').on('click', function() {
		$('.btnPlay').removeClass('paused');
		updatebar($('.progress').offset().left);
		video[0].pause();
	});
	
	//fullscreen button clicked
	$('.btnFS').on('click', function() {
		if($.isFunction(video[0].webkitEnterFullscreen)) {
			video[0].webkitEnterFullscreen();
		}	
		else if ($.isFunction(video[0].mozRequestFullScreen)) {
			video[0].mozRequestFullScreen();
		}
		else {
			alert('Your browsers doesn\'t support fullscreen');
		}
	});
	
	//light bulb button clicked
	$('.btnLight').click(function() {
		$(this).toggleClass('lighton');
		
		//if lightoff, create an overlay
		if(!$(this).hasClass('lighton')) {
			$('body').append('<div class="overlay"></div>');
			$('.overlay').css({
				'position':'absolute',
				'width':100+'%',
				'height':$(document).height(),
				'background':'#000',
				'opacity':0.9,
				'top':0,
				'left':0,
				'z-index':999
			});
			$('.videoContainer').css({
				'z-index':1000
			});
		}
		//if lighton, remove overlay
		else {
			$('.overlay').remove();
		}
	});
	
	//sound button clicked
	$('.sound').click(function() {
		video[0].muted = !video[0].muted;
		$(this).toggleClass('muted');
		if(video[0].muted) {
			$('.volumeBar').css('width',0);
		}
		else{
			$('.volumeBar').css('width', video[0].volume*100+'%');
		}
	});
	

//VIDEO PROGRESS BAR
	//when video timebar clicked
	var timeDrag = false;	/* check for drag event */
	$('.progress').on('mousedown', function(e) {
		timeDrag = true;
		updatebar(e.pageX);
	});
	$(document).on('mouseup', function(e) {
		if(timeDrag) {
			timeDrag = false;
			updatebar(e.pageX);
		}
	});
	$(document).on('mousemove', function(e) {
		if(timeDrag) {
			updatebar(e.pageX);
		}
	});

	var updatebar = function(x) {
		var progress = $('.progress');
		
		//calculate drag position
		//and update video currenttime
		//as well as progress bar
		var maxduration = video[0].duration;
		var position = x - progress.offset().left;
		var percentage = 100 * position / progress.width();
		if(percentage > 100) {
			percentage = 100;
		}
		if(percentage < 0) {
			percentage = 0;
		}
		$('.timeBar').css('width',percentage+'%');	
		video[0].currentTime = maxduration * percentage / 100;
	};


	//VIDEO EVENTS
	//video canplay event
	video.on('canplay', function() {
		$('.loading').fadeOut(100);
	});
	
	//video canplaythrough event
	//solve Chrome cache issue
	var completeloaded = false;
	video.on('canplaythrough', function() {
		completeloaded = true;
	});
	
	//video ended event
	video.on('ended', function() {
		$('.btnPlay').removeClass('paused');
		video[0].pause();
	});

	//video seeking event
	video.on('seeking', function() {
		//if video fully loaded, ignore loading screen
		if(!completeloaded) { 
			$('.loading').fadeIn(200);
		}	
	});
	
	//video seeked event
	video.on('seeked', function() { });
	
	//video waiting for more data event
	video.on('waiting', function() {
		$('.loading').fadeIn(200);
	});
	
	

	//VOLUME BAR
	//volume bar event
	var volumeDrag = false;
	$('.volume').on('mousedown', function(e) {
		volumeDrag = true;
		video[0].muted = false;
		$('.sound').removeClass('muted');
		updateVolume(e.pageX);
	});
	$(document).on('mouseup', function(e) {
		if(volumeDrag) {
			volumeDrag = false;
			updateVolume(e.pageX);
		}
	});
	 
	$(document).on('mousemove', function(e) {
		if(volumeDrag) {
			updateVolume(e.pageX);
		}
	});
	var updateVolume = function(x, vol) {
		var volume = $('.volume');
		var percentage;
		//if only volume have specificed
		//then direct update volume
		if(vol) {
			percentage = vol * 100;
		}
		else {
			var position = x - volume.offset().left;
			percentage = 100 * position / volume.width();
		}
		
		if(percentage > 100) {
			percentage = 100;
		}
		if(percentage < 0) {
			percentage = 0;
		}
		
		//update volume bar and video volume
		$('.volumeBar').css('width',percentage+'%');	
		video[0].volume = percentage / 100;
		
		//change sound icon based on volume
		if(video[0].volume == 0){
			$('.sound').removeClass('sound2').addClass('muted');
		}
		else if(video[0].volume > 0.5){
			$('.sound').removeClass('muted').addClass('sound2');
		}
		else{
			$('.sound').removeClass('muted').removeClass('sound2');
		}
		
	};

	//Time format converter - 00:00
	var timeFormat = function(seconds){
		var m = Math.floor(seconds/60)<10 ? "0"+Math.floor(seconds/60) : Math.floor(seconds/60);
		var s = Math.floor(seconds-(m*60))<10 ? "0"+Math.floor(seconds-(m*60)) : Math.floor(seconds-(m*60));
		return m+":"+s;
	};
});