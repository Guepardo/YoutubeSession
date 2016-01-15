
var Room = function(){
	this.room_owner = 'undefined'; 
	this.intervalTimeout = null;
	this.DELAY = 1000; //one second; 

	//true to on session, false to session timeout
	this.stage = false; 
}; 

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
	console.error("usuário registrado como proprietário"+ hash); 
}; 

Room.prototype.ownerExists = function(){
	return (this.room_owner != 'undefined' ); 
}; 

Room.prototype.isOwner = function(hash){
	return (this.room_owner == hash ); 
}; 

Room.prototype.stage = function(){
	return this.stage; 
}; 

Room.prototype.startSession = function(hashOwner, video_duration){
	if(hashOwner != this.room_owner) return false; 

	this.video_duration  = video_duration; 
	var self = this; 

	this.intervalTimeout = setInterval(function(){
		if(self.timeout_session > self.video_duration){
			self.timeout_session += DELAY; 
			self.stage = true; 
		}else
		self.stage = false; 

		console.log('time courrent: '+ self.timeout_session); 
	},DELAY); 

	return true; 
}

Room.prototype.seekTimeout = function(hashOwner,time){
	if(hashOwner != this.room_owner) return false; 
	this.timeout_session = time; 
	return true; 
}


module.exports = Room; 