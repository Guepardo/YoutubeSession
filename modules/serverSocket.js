var Server   = require('socket.io');
var CryptoJS = require("crypto-js"); 
var Room     = require('./Room'); 
var Factory  = require('./Factory'); 


var socketServer ={}; 

socketServer.init = function(server) {
	socketServer.io = null; 
	socketServer.rooms = [];
	socketServer.io = io = new Server (server); 

	socketServer.factory = new Factory(); 

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
			var nameTemp = socketServer.factory.names(); 
			socket.name = nameTemp; 

			var currentRoom = socketServer.rooms[socket.__room]; 
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

		// remove later: <------
		// setInterval(function(){
		// 	io.sockets.in(socket.__room).emit('msg',{userName : socket.name , msg: "Just a test."}); 
		// },100); 

		socket.on('disconnect', function(){
			var userInfo = {
				hashName : socket.hashName, 
				name     : socket.name
			}; 
			// delete socketServer[socket.hashName]; 
			socketServer.rooms[socket.__room].removeUser(socket.hashName); 

			io.sockets.in(socket.__room).emit('leave',userInfo); 
		});

		socket.on('registerOwner', function(){
			if(socket.__room == 'undefined') return; 
			
			//Adicionando proprietário da sala: 
			if(!socketServer.rooms[socket.__room].ownerExists())
				socketServer.rooms[socket.__room].registerOwner(socket.hashName); 
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
			var msgTemp = {
				userName : socket.name, 
				msg      : "Alguém acabou de dar play"
			}; 
			io.sockets.in(socket.__room).emit('msg',msgTemp); 

			socketServer.avatarStatusChange('Play',socket.hashName,socket.__room);  

			var currentRoom = socketServer.rooms[socket.__room]; 
			//executar o comando apenas se o socket for do proprietário: 
			if(!currentRoom.isOwner(socket.hashName))return;

			io.sockets.in(socket.__room).emit('onPlay');

			if(!currentRoom.isStarted()) 
				currentRoom.startSession(socket.hashName, data.duration);  
			currentRoom.setPlay(); 
			console.log(data); 

		}); 

		socket.on('onPause',function(data){
			console.log("onPause" ); 
			var msgTemp = {
				userName : socket.name, 
				msg      : "Alguém acabou de dar pause"
			}; 
			io.sockets.in(socket.__room).emit('msg',msgTemp); 

			socketServer.avatarStatusChange('Pause',socket.hashName,socket.__room);  

			var currentRoom = socketServer.rooms[socket.__room]; 
			//executar o comando apenas se o socket for do proprietário: 
			if(!currentRoom.isOwner(socket.hashName))return;

			io.sockets.in(socket.__room).emit('onPause'); 
			currentRoom.setPause(); 
		}); 

		socket.on('onSeek',function(data){
			console.log("onSeek" ); 
			var msgTemp = {
				userName : 'Server', 
				msg      : "Alterou a posição do vídeo."
			}; 
			io.sockets.in(socket.__room).emit('msg',msgTemp); 

			var currentRoom = socketServer.rooms[socket.__room]; 
			//executar o comando apenas se o socket for do proprietário: 
			if(!currentRoom.isOwner(socket.hashName))return;
			currentRoom.seekTimeout(socket.hashName, data.time); 
			socket.broadcast.to(socket.__room).emit('onSeek',{time : data.time});
		}); 

		socket.on('onStop',function(data){
			console.log("onStop" ); 
			var msgTemp = {
				userName : socket.name, 
				msg      : "Alguém acabou de dar stop"
			}; 
			io.sockets.in(socket.__room).emit('msg',msgTemp); 

			socketServer.avatarStatusChange('Stop',socket.hashName,socket.__room);  

			//executar o comando apenas se o socket for do proprietário: 
			if(!socketServer.rooms[socket.__room].isOwner(socket.hashName))return;

			io.sockets.in(socket.__room).emit('onStop'); 
		}); 

		socket.on('onBuffering',function(data){
			console.log("onBuffering" ); 
			var msgTemp = {
				userName : socket.name, 
				msg      : "Alguém acabou de dar buffering"
			}; 
			io.sockets.in(socket.__room).emit('msg',msgTemp); 

			socketServer.avatarStatusChange('Buffering',socket.hashName,socket.__room); 

			//executar o comando apenas se o socket for do proprietário: 
			if(!socketServer.rooms[socket.__room].isOwner(socket.hashName))return;

			io.sockets.in(socket.__room).emit('onBuffering'); 
		}); 

		socket.on('onThumbUp', function(){
			console.log('onThumbUp'); 

			var msgTemp = {
				userName : socket.name, 
				msg      : "<3"
			}

			io.sockets.in(socket.__room).emit('msg',msgTemp); 
			socketServer.avatarStatusChange('ThumbUp',socket.hashName,socket.__room); 
		}); 

		socket.on('typeBegin', function(){
			var currentRoom = socketServer.rooms[socket.__room]; 
			currentRoom.addUserFromTypingList(socket.name); 
			var msg = currentRoom.whoIsTyping(); 
			var msgTemp ={
				msg : msg
			};

			io.sockets.in(socket.__room).emit('changeTyping',msgTemp); 
		}); 

		socket.on('typeEnd',function(){
			var currentRoom = socketServer.rooms[socket.__room]; 
			currentRoom.removeUserFromTypingList(socket.name); 
			var msg = currentRoom.whoIsTyping(); 
			var msgTemp ={
				msg : msg
			};

			io.sockets.in(socket.__room).emit('changeTyping',msgTemp); 
		}); 
	}); 

socketServer.roomExists = function(hashId){
	return ( this.rooms[hashId] != null  );
}

socketServer.avatarStatusChange = function(action,hashName,room){
	var avatarChange = {
		hashName :   hashName, 
		action   :   action
	};
	io.sockets.in(room).emit('avatarStatusChange', avatarChange); 
}; 

socketServer.createRoom = function(name,url){
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

	socketServer.deleteRoom = function(hashNames){
		delete this.rooms[hashName]; 
	}; 
}; 

module.exports = socketServer; 