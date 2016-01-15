
// Start App
var player;
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '390',
		width: '640',
		videoId: '', 
		playerVars: {
			'autoplay': 0, 
			'controls':  1
		}
	});
}



//App lib
var WindowSession = function(){
  const FRENQUENCY_INTERVAL = 200; 
  const DELAY_FADE 			= 500;

  var self = this; 
  self.users = []; 

  // creating interval to check changes on youtube player: 	
  setInterval(function(){
  	switch(player.getPlayerState()){
		case -1: //não indicado
		break; 
		case  0: //encerrado
		self.onStop(); 
		break; 
		case  1: //em reprodução
		self.onPlay(); 
		break; 
		case  2: //em pausa
		self.onPause(); 
		break; 
		case  3: //armazenando em buffer
		self.onBuffering(); 
		break; 
		case  5: //vídeo indicado
		break; 
	}
},FRENQUENCY_INTERVAL); 

}; 

WindowSession.prototype.start = function(videoLink, startSeconds, quality){
	setTimeout(function(){
		player.cueVideoById(videoLink,startSeconds,quality); 
	},4000); 
}; 

WindowSession.prototype.newAvatar = function(data){
	var tag = '<span style="display:none;" id="'+data.hashName+'"class="tooltipped animated infinite swing center-align" data-position="bottom" data-delay="50" data-tooltip="'+data.name+'"><img class="circle" src="http://lorempixel.com/36/36/" alt="'+data.name+'"></span>'; 
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

WindowSession.prototype.avatarStatusChange = function(){
	
}; 

WindowSession.prototype.newMessage = function(data){
	var tag = '<li class="collection-item" style="margin-top:0;width:100%"> <strong>'+data.userName+'</strong> <small>'+data.msg+'</small></li>'; 
	$('#chat_content').append(tag); 

	var tempHeight = $('#chat_content').height()+100; 
	console.log(tempHeight); 
	$("#chat_content").animate({ scrollTop: tempHeight }, this.DELAY_FADE);
}; 

WindowSession.prototype.playerStop = function(){
	
}; 

WindowSession.prototype.playerPause = function(){
	
}; 

WindowSession.prototype.playerSeek = function(){
	
}; 

WindowSession.prototype.typingChange = function(){
	
};

WindowSession.prototype.onPlay = function(){
	console.log("Playing"); 
}; 

WindowSession.prototype.onPause = function(){
	console.log("Playing"); 
}; 

WindowSession.prototype.onSeek = function(){
	console.log("Seek"); 
}; 

WindowSession.prototype.onStop = function(){
	console.log("Stop"); 
}; 

WindowSession.prototype.onBuffering = function(){
	console.log("Buffering"); 
}; 
