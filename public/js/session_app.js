
// Start App
var player;
function onYouTubeIframeAPIReady() {
   player = new YT.Player('player', {
       height: '390',
       width: '640',
       videoId: '', 
       playerVars: {
         'autoplay': 1, 
          'controls':  0
       }
    });
}

//App lib
var WindowSession = function(){
   const FRENQUENCY_INTERVAL = 100; 
  // creating interval to check changes on youtube player: 
  var intervalCheck = setInterval(this.checkPlayerChange,FRENQUENCY_INTERVAL); 
}; 

WindowSession.prototype.checkPlayerChange = function(){

}

WindowSession.prototype.newAvatar = function(){

}; 

WindowSession.prototype.removeAvatar = function(){
	
}; 

WindowSession.prototype.avatarStatusChange = function(){
	
}; 

WindowSession.prototype.newMessage = function(){
	
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
	
}; 

WindowSession.prototype.onPause = function(){
	
}; 

WindowSession.prototype.onSeek = function(){
	
}; 

WindowSession.prototype.onStop = function(){
	
}; 

WindowSession.prototype.onBuffering = function(){
	
}; 