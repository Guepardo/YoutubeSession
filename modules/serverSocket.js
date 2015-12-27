var Server = require('socket.io');
var crypto = require('crypto');  
var Room   = require('./Room'); 

var socketServer ={
	io : null, 
	rooms: [], 

	init : function(server){
		this.io = io = new Server (server); 

		console.log('!Servidor socket iniciado.'); 

		io.on('connection', function(socket){

			socket.on('enterRoom',function(data){
				var hash = crypto.createHash('md5'); 
				console.log("usuário registrando sala"); 

				socket.__room = data.room; 
				socket.hashName = hash.digest( new Date().toString()); 
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
			})

		}); 	
	}, 

	createRoom: function(hashName){
		this.rooms[hashName] = new Room();  
		this.rooms[hashName].registerSessionName(hashName); 
		console.log("Informações sobre a Room"); 
		console.log(this.rooms[hashName]); 
	},

	deleteRoom: function(hashName){
		delete this.rooms[hashName]; 
	}
}

module.exports = socketServer; 