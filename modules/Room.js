
var Room = function(){
	this.room_owner = 'undefined'; 
	this.intervalTimeout = null;
	this.DELAY = 1000; //one second; 
	this.EXCLUSION_DELAY_BOUND = 3 //three seconds. 
	
	this.started = false; 
	this.play = false;

	this.video_duration  = -1; 
	this.timeout_session =  0; 

	this.users = []; 

	this.usersTyping = new Array(); 
}; 

Room.prototype.whoIsTyping = function(name){
	var is  = "está"; 
	var are = "estão"; 

	var temp  = ""; 
	var count = 0; 
	for( var a = 0 ; a < this.usersTyping.length; a++){
		if(this.usersTyping[a] != name){

			if( this.usersTyping.length > 2 && (a + 1 != this.usersTyping.legth))
				temp += ""+this.usersTyping[a]+", "; 
			else
				temp += ""+this.usersTyping[a]+" e "; 

			count++; 
		}
	}

	if(temp == "") return ""; 

	if(count < 4)
		temp = temp.substring(0,temp.length-2); 
	else
		temp = "muitos"; 
	
	if(count < 2 )
		temp += " "+is+" digitando..."; 
	else
		temp += " "+are+" digitando...";
	return temp; 
}

Room.prototype.addUserFromTypingList = function(name){
	this.usersTyping.push(name); 
	console.log(this.usersTyping); 
}; 

Room.prototype.removeUserFromTypingList = function(name){
	var idx = this.usersTyping.indexOf(name); 
	if(idx != -1)
		this.usersTyping.splice(idx,1); 
}; 

Room.prototype.isSynchronized = function(clientCurrentTime){
	if( clientCurrentTime >= this.timeout_session-this.EXCLUSION_DELAY_BOUND 
	&&  clientCurrentTime <= this.timeout_session+this.EXCLUSION_DELAY_BOUND)
		return true; 
	return false;	
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