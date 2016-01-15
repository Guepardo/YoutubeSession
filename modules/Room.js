
var Room = function(){}; 

Room.prototype.registerSessionName = function(session_name){
	this.session_name = session_name; 
}; 

Room.prototype.setProperties = function(link_video,room_name){
	this.link_video = link_video; 
	this.room_name  = room_name;  
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


module.exports = Room; 