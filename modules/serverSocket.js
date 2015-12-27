var Server = require('socket.io'); 

var socketServer ={
	io : null, 
	rooms: [], 

	init : function(server){
		io = new Server (server); 
		console.log('iniciado'); 

		io.on('connection', function(socket){

			socket.on('enterRoom',function(data){
				console.log("usuário registrando sala"); 
				socket.room = data.room; 
				socket.join(data.room); 

				io.sockets.in(socket.room).emit('newUser',{data : 'Um usuário acabou de entrar'}); 

			}); 

			socket.on('msg',function(data){
				console.log("mensagem em broadcast para a sala "+ socket.room);
				io.sockets.in(socket.room).emit('msg',data); 
				//console.log(io.sockets); 
			}); 

			socket.on('disconnect', function(){
				io.sockets.in(socket.room).emit('leave',{ data: 'Usuários deixou a sala '+ socket.room}); 
			}); 

		}); 	
	}, 

	createRoom: function(hashName){
		this.rooms[hashName] = hashName;  
	},

	deleteRoom: function(hashName){
		delete this.rooms[hashName]; 
	}
}

module.exports = socketServer; 