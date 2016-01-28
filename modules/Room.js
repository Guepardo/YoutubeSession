
var Room = function(){
	this.room_owner = 'undefined'; 
	this.intervalTimeout = null;
	this.DELAY = 1000; //one second; 

	
	this.started = false; 
	this.play = false;

	this.video_duration  = -1; 
	this.timeout_session =  0; 

	this.users = []; 
}; 

Room.prototype.newUser = function(hashName, nome){
	this.users[hashName] = nome; 
}; 

Room.prototype.removeUser = function(hashName){
	delete this.users[hashName]; 
}; 

Room.prototype.getAllUsers = function(){
	return this.users; 
}; 

Room.prototype.isPlay  = function(){
	return this.play; 
}; 

Room.prototype.getTimeout = function(){
	return this.timeout_session; 
}; 

Room.prototype.setPlay = function(){
	if(!this.play)
		this.play = true;
}; 

Room.prototype.setPause = function(){
	if(this.play)
		this.play = false; 
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

Room.prototype.isStarted = function(){
	console.log('isStarted' + this.started); 
	return this.started; 
}; 

Room.prototype.startSession = function(hashOwner, video_duration){
	if(hashOwner != this.room_owner) return false; 
	this.started = true; 
	this.video_duration  = parseInt(video_duration); 
	var self = this; 

	this.intervalTimeout = setInterval(function(){
		if(self.timeout_session <= self.video_duration){
			if(self.play)self.timeout_session += 1;//one second 	
		}
		console.log('time courrent: '+ self.timeout_session +" duration : " + self.video_duration +" play "+ self.play); 
	},this.DELAY); 

	return true; 
}; 

Room.prototype.seekTimeout = function(hashOwner,time){
	if(hashOwner != this.room_owner) return false; 
	this.timeout_session = parseInt(time); 
	return true; 
}; 


module.exports = Room; 