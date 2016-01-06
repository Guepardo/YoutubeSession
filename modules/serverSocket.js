var Server = require('socket.io');
var CryptoJS = require("crypto-js"); 
var Room   = require('./Room'); 


var socketServer ={}; 

socketServer.init = function(server) {
	socketServer.io = null; 
	socketServer.rooms = [];
	socketServer.io = io = new Server (server); 

	console.log('!Servidor socket iniciado.'); 

	io.on('connection', function(socket){

	socket.on('enterRoom',function(data){
	
		console.log("usuário registrando sala"); 

		socket.__room = data.room; 
		socket.hashName = CryptoJS.MD5( new Date().toString()); 
		socket.join(data.room); 

		io.sockets.in(socket.__room).emit('newUser',{data : 'Um usuário acabou de entrar'}); 
	}); 

	socket.on('msg',function(data){
		console.log("mensagem em broadcast para a sala "+ socket.__room);
		io.sockets.in(socket.__room).emit('msg',data); 
	}); 

	socket.on('disconnect', function(){
		io.sockets.in(socket.__room).emit('leave',{ data: 'Usuários deixou a sala '+ socket.__room}); 
	});

	socket.on('registerOwner', function(){
		if(socket.__room == 'undefined') return; 
			rooms[socket.__room].registerOwner(socket.__hashName); 
		});
	}); 

	socketServer.roomExists = function(hashId){
		return ( this.rooms[hashId] != null  );
	}

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