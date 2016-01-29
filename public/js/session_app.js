
// Start App
var player;
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '390',
		width: '640',
		videoId: '', 
		playerVars: {
			'autoplay': 0, 
			'controls':  0
		}
	});
}



//App lib
var WindowSession = function(socket){
	const FRENQUENCY_INTERVAL = 200; 
	const DELAY_FADE 		  = 1500;

	var self    = this; 
	self.users  = []; 
	self.socket = socket; 

	self.stageMachine   = -3; 
	self.video_duration = -1; 

	self.isPlay = false; 
  // creating interval to check changes on youtube player: 	
  setInterval(function(){
  	switch(player.getPlayerState()){
		case -1: //não indicado
		break; 
		case  0: //encerrado
		self.onStop(); 
		self.isPlay = false;
		break; 
		case  1: //em reprodução
		self.onPlay(); 
		self.isPlay = true;
		break; 
		case  2: //em pausa
		self.onPause(); 
		self.isPlay = false;
		break; 
		case  3: //armazenando em buffer
		self.onBuffering(); 
		self.isPlay = false;
		break; 
		case  5: //vídeo indicado
		break; 
	}
},FRENQUENCY_INTERVAL); 

setInterval(function(){
	//Pegando informações da duração do vídeo: 
	if(self.video_duration == -1 ){
		if(player.getDuration() != 0){
			var temp = player.getDuration() ;
			var progress = $('#progress'); 
			var duration =   parseInt(player.getDuration()); 
			progress.attr('max',duration); 
			progress.attr('min',0); 

			self.video_duration = duration; 

			player.setVolume(30); 
		}
	}else{
		//Atualizar tempo de execução: 
		$('#progress').val(parseInt(player.getCurrentTime())); 
	}
},1000); 
// Um segundo é o tempo ideal para a barra de progresso não travar.

}; 

WindowSession.prototype.start = function(videoLink, startSeconds, quality, play, users){
	var self = this; 
	setTimeout(function(){
		//(data.linkVideo,0,'small',data.play,data.users); 
		if(play)
			player.loadVideoById(videoLink,startSeconds,quality); 
		else
			player.cueVideoById(videoLink,startSeconds,quality); 

		//Adicionando usuários na barra superior: 
		for(var a = 0; a < users.length; a++)
			self.newAvatar(users[a]); 
	},4000); 
}; 


WindowSession.prototype.newAvatar = function(data){
	var tag = '<span style="display:none;" id="'+data.hashName+'"class="tooltipped animated infinite center-align" data-position="bottom" data-delay="50" data-tooltip="'+data.name+'"><img class="circle" src="http://www.gravatar.com/avatar/c'+data.hashName+'?s=40&d=identicon&f=y" alt="'+data.name+'"></span>'; 
	$('#avatar_content').append(tag);
	$('#'+data.hashName).fadeIn(this.DELAY_FADE);  
	$('.tooltipped').tooltip({delay: 50});
}; 

WindowSession.prototype.clearInputBox = function(){
	$('#input_box').val(''); 
}; 

WindowSession.prototype.removeAvatar = function(hashName){
	$('#'+hashName).fadeOut(this.DELAY_FADE);
	setTimeout(function(){
		$('#'+hashName).remove(); 
	},this.DELAY_FADE+200); 
}; 

WindowSession.prototype.seekTo = function(time){
	player.seekTo(time,true); 
	this.socket.emit('onSeek',{ time : time}); 
}; 

WindowSession.prototype.avatarStatusChange = function(data){
	//Event      |   Class
	//Buffering  |   flash
	//Pause      |   shake
	//Stop       |   tada
    //Play       |   bounce
    //ThumbUp    |   rubberBand

    //chossing class css
    var cssClass = ''; 

    switch(data.action){
    	case 'Buffering': 
    	cssClass = 'flash'; 
    	break; 
    	case 'Pause': 
    	cssClass = 'shake'; 
    	break; 
    	case 'Stop': 
    	cssClass = 'tada'; 
    	break; 
    	case 'Play': 
    	cssClass = 'bounce'; 
    	break; 
    	case 'ThumbUp': 
    	cssClass = 'rubberBand'; 

    }

    $('#'+data.hashName).addClass(cssClass); 
    setTimeout(function(){
    	$('#'+data.hashName).removeClass(cssClass);		
    },1000); 
}; 

WindowSession.prototype.newMessage = function(data){
	var tag = '<li class="collection-item msgItem"> <strong>'+data.userName+':</strong> <small> '+data.msg+'</small></li>'; 
	$('#chat_content').append(tag); 

	var tempHeight = $('#chat_content').height()+100; 
	console.log(tempHeight); 
	$("#chat_content").unbind().animate({ scrollTop: tempHeight }, this.DELAY_FADE);
}; 

WindowSession.prototype.onThumbUp = function(){
	this.socket.emit('onThumbUp'); 
}

WindowSession.prototype.setVolume = function(value){
	player.setVolume(value);
}; 

WindowSession.prototype.playerStop = function(){
	player.stopVideo(); 
}; 

WindowSession.prototype.playerPause = function(){
	player.pauseVideo(); 
}; 

WindowSession.prototype.playerPlay = function(){
	player.playVideo(); 
}; 	

WindowSession.prototype.typingChange = function(){
	
};

WindowSession.prototype.onPlay = function(){
	if(this.stageMachine == 1 )return; 
	console.log("Playing");
	this.socket.emit('onPlay',{ duration : player.getDuration()});  
	this.stageMachine = 1;  
}; 

WindowSession.prototype.onPause = function(){
	if(this.stageMachine == 2 )return; 
	console.log("Pause"); 
	this.socket.emit('onPause',{currentTime: player.getCurrentTime()});
	this.stageMachine = 2;   
}; 

WindowSession.prototype.onSeek = function(){
	console.log("Seek"); 
	this.socket.emit('onSeek');  
}; 

WindowSession.prototype.onStop = function(){
	if(this.stageMachine == 0 )return; 
	console.log("Stop"); 
	this.socket.emit('onStop'); 
	this.stageMachine = 0;  
}; 

WindowSession.prototype.onBuffering = function(){
	if(this.stageMachine == 3 )return; 
	console.log("Buffering");
	this.socket.emit('onBuffering'); 
	this.stageMachine = 3;  
}; 

WindowSession.prototype.isPlaying = function(){
	return self.isPlay; 
}; 
