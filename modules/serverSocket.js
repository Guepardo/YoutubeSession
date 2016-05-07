var Server   = require('socket.io');
var CryptoJS = require("crypto-js"); 
var Room     = require('./Room'); 
var Factory  = require('./Factory'); 


var ServerSocket = function(){}; 

ServerSocket.prototype.init = function(server){
	this.io = null; 
	this.rooms = [];
	this.io = io = new Server (server); 

	this.factory = new Factory(); 

	var self = this; 

	console.log('!Servidor socket iniciado.'); 
	io.on('connection', function(socket){

		socket.on('enterRoom',function(data){
			// console.log("usuário registrando sala na sala: " + data.room); 

			//Registrando usuário na sala específica. 
			socket.__room = data.room; 

			var userHashName = CryptoJS.MD5( new Date().toString()).toString();
			
			socket.hashName =  userHashName; 
			socket.join(data.room); 

			//alimentando array de usuários: 
			var nameTemp = self.factory.names(); 
			socket.name = nameTemp; 

			var currentRoom = self.rooms[socket.__room]; 
			//Enviando informações da sala para o usuário: 

			var allUsers = currentRoom.getAllUsers();
			var users = new Array();

			for(var key in allUsers){
				var user = {};
				user.hashName = key; 
				user.name     = allUsers[key]; 

				users.push(user); 
			}

			var roomInfo = {
				linkVideo: currentRoom.link_video,
				roomName : currentRoom.room_name, 
				users    : users, 
				play     : currentRoom.isPlay(), 
				timeout  : currentRoom.getTimeout()+4//Player começar a avançar 4 segunda a frente 
			}; 

			socket.emit('getRoomInfo',roomInfo); 

			//Enviando informações do novo usuário na sala: 
			var userInfo = {
				hashName : socket.hashName, 
				name     : nameTemp
			}; 
			currentRoom.newUser(socket.hashName, socket.name); 
			io.sockets.in(socket.__room).emit('newUser',userInfo); 
		}); 


		//msg protocol: { userName : string, msg : string }
		socket.on('msg',function(data){
			console.log("mensagem em broadcast para a sala "+ socket.__room);
			
			var msgBuild ={
				userName: socket.name, 
				msg     : data.msg
			}; 
			io.sockets.in(socket.__room).emit('msg',msgBuild); 
		}); 

		socket.on('disconnect', function(){
			var userInfo = {
				hashName : socket.hashName, 
				name     : socket.name
			}; 
			// delete self[socket.hashName]; 
			var currentRoom = self.rooms[socket.__room]; 
			currentRoom.removeUser(socket.hashName); 

			io.sockets.in(socket.__room).emit('leave',userInfo); 

			
			//Se o adminstrador da sala sair, um usuário deve ser sorteado como adminstrador.
			if(!currentRoom.isOwner(socket.hashName))
				return; 

			var users = currentRoom.getAllUsers(); 

			var index = Math.floor( Math.random() * users.length); 
			
			currentRoom.registerOwner(tempSocket.hashName); 
			console.log("Nome do dono da sala: agora. "+tempSocket.name); 
			var msgBuild ={
				userName:  'Server', 
				msg     :  'O usuário <b>'+tempSocket.name+'</b> é o novo adminstrador da sala.'
			}; 
			io.sockets.in(tempSocket.__room).emit('msg',msgBuild); 
		});

		socket.on('registerOwner', function(){
			if(socket.__room == 'undefined') return; 
			
			//Adicionando proprietário da sala: 
			if(!self.rooms[socket.__room].ownerExists())
				self.rooms[socket.__room].registerOwner(socket.hashName); 
			else
				return; 

			var msgBuild ={
				userName:  socket.name, 
				msg     : 'Registrado como proprietário da sala'
			}; 
			io.sockets.in(socket.__room).emit('msg',msgBuild); 
		});

		socket.on('onPlay',function(data){
			console.log("onPlay" ); 
			

			self.avatarStatusChange('Play',socket.hashName,socket.__room);  

			var currentRoom = self.rooms[socket.__room]; 
			//executar o comando apenas se o socket for do proprietário: 
			if(!currentRoom.isOwner(socket.hashName))return;

			io.sockets.in(socket.__room).emit('onPlay');

			if(!currentRoom.isStarted()) 
				currentRoom.startSession(socket.hashName, data.duration);  
			currentRoom.setPlay(); 
			
			var msgTemp = {
				userName : socket.name, 
				msg      : "Alguém acabou de dar play"
			}; 
			io.sockets.in(socket.__room).emit('msg',msgTemp); 
		}); 

		socket.on('onPause',function(data){
			console.log("onPause" ); 
			self.avatarStatusChange('Pause',socket.hashName,socket.__room);  

			var currentRoom = self.rooms[socket.__room]; 
			//executar o comando apenas se o socket for do proprietário: 
			if(!currentRoom.isOwner(socket.hashName))return;

			io.sockets.in(socket.__room).emit('onPause'); 
			currentRoom.setPause(); 
			var msgTemp = {
				userName : socket.name, 
				msg      : "Alguém acabou de dar pause"
			}; 
			io.sockets.in(socket.__room).emit('msg',msgTemp); 
		}); 

		socket.on('onSeek',function(data){
			console.log("onSeek" ); 
			var currentRoom = self.rooms[socket.__room]; 
			//executar o comando apenas se o socket for do proprietário: 
			if(!currentRoom.isOwner(socket.hashName))return;
			currentRoom.seekTimeout(socket.hashName, data.time); 
			socket.broadcast.to(socket.__room).emit('onSeek',{time : data.time});

			var msgTemp = {
				userName : 'Server', 
				msg      : "Alterou a posição do vídeo."
			}; 
			io.sockets.in(socket.__room).emit('msg',msgTemp); 
		}); 

		socket.on('onStop',function(data){
			console.log("onStop" ); 

			self.avatarStatusChange('Stop',socket.hashName,socket.__room);  

			//executar o comando apenas se o socket for do proprietário: 
			if(!self.rooms[socket.__room].isOwner(socket.hashName))return;
			io.sockets.in(socket.__room).emit('onStop'); 
			
			var msgTemp = {
				userName : socket.name, 
				msg      : "Alguém acabou de dar stop"
			}; 
			io.sockets.in(socket.__room).emit('msg',msgTemp); 
		}); 

		socket.on('onBuffering',function(data){
			console.log("onBuffering" ); 
			self.avatarStatusChange('Buffering',socket.hashName,socket.__room); 

			//executar o comando apenas se o socket for do proprietário: 
			if(!self.rooms[socket.__room].isOwner(socket.hashName))return;
			io.sockets.in(socket.__room).emit('onBuffering'); 
			var msgTemp = {
				userName : socket.name, 
				msg      : "Alguém acabou de dar buffering"
			}; 
			io.sockets.in(socket.__room).emit('msg',msgTemp); 
		}); 

		socket.on('onThumbUp', function(){
			console.log('onThumbUp'); 
			var msgTemp = {
				userName : socket.name, 
				msg      : "<3"
			}

			io.sockets.in(socket.__room).emit('msg',msgTemp); 
			self.avatarStatusChange('ThumbUp',socket.hashName,socket.__room); 
		}); 

		socket.on('typeBegin', function(){
			var currentRoom = self.rooms[socket.__room]; 
			currentRoom.addUserFromTypingList(socket.name); 
			var msg = currentRoom.whoIsTyping(); 
			var msgTemp ={
				msg : msg
			};

			io.sockets.in(socket.__room).emit('changeTyping',msgTemp); 
		}); 

		socket.on('typeEnd',function(){
			var currentRoom = self.rooms[socket.__room]; 
			currentRoom.removeUserFromTypingList(socket.name); 
			var msg = currentRoom.whoIsTyping(); 
			var msgTemp ={
				msg : msg
			};

			io.sockets.in(socket.__room).emit('changeTyping',msgTemp); 
		}); 

		socket.on('verifySynchronization',function(data){
			var currentRoom = self.rooms[socket.__room]; 

			if(!currentRoom.isSynchronized(data.currentTime) &&
				currentRoom.isStarted()                    ){
				//
			socket.emit('onSeek',{time : currentRoom.getTimeout()}); 
			var msgTemp = {
				userName : 'Server', 
				msg      : "Seu player foi sincronizado com o servidor."
			}; 
			socket.emit('msg',msgTemp); 
		}
	}); 	
	}); 
};

ServerSocket.prototype.roomExists = function(hashId){
	return ( this.rooms[hashId] != null  );
};

ServerSocket.prototype.avatarStatusChange = function(action,hashName,room){
	var avatarChange = {
		hashName :   hashName, 
		action   :   action
	};
	io.sockets.in(room).emit('avatarStatusChange', avatarChange); 
};

ServerSocket.prototype.createRoom = function(name,url){
	console.log(this.rooms); 

	//criando hash para a sala: 
	var data     = new Date().toString(); 
	var hashName = CryptoJS.MD5(name + data).toString(); 

	this.rooms[hashName] = new Room();  

	this.rooms[hashName].registerSessionName(hashName);
	this.rooms[hashName].setProperties(name,url); 
	console.log(this.rooms[hashName]); 

	return hashName; 
}; 

ServerSocket.prototype.deleteRoom = function(hashNames){
	delete this.rooms[hashName]; 
}; 

ServerSocket.prototype.getInformations = function(){
	return this.rooms; 
};

module.exports = new ServerSocket(); 