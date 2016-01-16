var Server   = require('socket.io');
var CryptoJS = require("crypto-js"); 
var Room     = require('./Room'); 
var Factory  = require('./Factory'); 


var socketServer ={}; 

socketServer.init = function(server) {
	socketServer.io = null; 
	socketServer.rooms = [];
	socketServer.users = []; 
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

			//Enviando informações da sala para o usuário: 
			var roomInfo = {
				linkVideo: socketServer.rooms[data.room].link_video,
				roomName : socketServer.rooms[data.room].room_name 
			}; 
			socket.emit('getRoomInfo',roomInfo); 

			//Enviando informações do novo usuário na sala: 
			var userInfo = {
				hashName : socket.hashName, 
				name     : nameTemp
			}; 
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

		//remove later: <------
		// setInterval(function(){
		// 	io.sockets.in(socket.__room).emit('msg',{userName : socket.name , msg: "Just a test."}); 
		// },100); 

		socket.on('disconnect', function(){
			var userInfo = {
				hashName : socket.hashName, 
				name     : socket.name
			}; 
			delete socketServer[socket.hashName]; 

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
				userName: socket.name, 
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

			//executar o comando apenas se o socket for do proprietário: 
			if(!socketServer.rooms[socket.__room].isOwner(socket.hashName))return;

			io.sockets.in(socket.__room).emit('onPlay'); 
		}); 

		socket.on('onPause',function(data){
			console.log("onPause" ); 
			var msgTemp = {
				userName : socket.name, 
				msg      : "Alguém acabou de dar pause"
			}; 
			io.sockets.in(socket.__room).emit('msg',msgTemp); 

			socketServer.avatarStatusChange('Pause',socket.hashName,socket.__room);  

			//executar o comando apenas se o socket for do proprietário: 
			if(!socketServer.rooms[socket.__room].isOwner(socket.hashName))return;

			io.sockets.in(socket.__room).emit('onPause'); 
		}); 

		socket.on('onSeek',function(data){
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
		var data = new Date().toString; 
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