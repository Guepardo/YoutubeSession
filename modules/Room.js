
var Room = function(){}; 

Room.prototype.videoDuration = function(){
	return this.video_duration; 
}; 

Room.prototype.setVideoInformation = function(video_name,video_duration){
	this.video_name = video_name; 
	this.video_duration = video_duration; 
}; 

Room.prototype.registerSessionName = function(session_name){
	this.session_name = session_name; 
}; 

Room.prototype.setProperties = function(link_video,sala_name){
	this.link_video = link_video; 
	this.sala_name  = sala_name;  
}; 

Room.prototype.registerOwner = function(hash){
	if(this.room_owner != 'undefined' ) return; 
	
	this.room_owner = hash; 
}; 

Room.prototype.startSession = function(hash){
	this.timeout_session = this.video_duration; //provavelmente vou ter que fazer conversão para segundos aqui; 

	if( hash !== this.room_owner )
		return false;

	return true; 
}

Room.prototype.stopSession = function(){
	if( hash !== this.room_owner )
		return false;
	//some code here...
}; 


module.exports = Room; 