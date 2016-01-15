$(document).ready(function(){
 	// Teste socket
 	var socket = io(window.location.origin);
 	var session = new WindowSession(); 

 	socket.on('connect', function(data){
 		socket.emit('enterRoom', { room: hashId });
 	}); 

 	socket.on('msg', function (data) {
 		Materialize.toast('Nova mensagem: '+ data.userName, 1000); 
 		session.newMessage(data); 
 	});

 	socket.on('newUser', function(data){
 		console.log(data.data); 
 		Materialize.toast('Novo usuário na sala hashName: '+ data.hashName+ ' name: '+ data.name, 4000); 
 		session.newAvatar(data); 
 	}); 

 	socket.on('leave', function(data){
 		console.log("Um usuário deixou a sala"); 
 		session.removeAvatar(data.hashName); 
 		Materialize.toast('Usuário saiu da sala', 4000); 
 	});

 	socket.on('reconnect_attempt', function(){
 		Materialize.toast('Socket Reconectando', 4000); 
 	}); 

 	socket.on('reconnect', function(){
 		Materialize.toast('Conexão reestabelecida', 4000);
 	}); 

 	socket.on('getRoomInfo',function(data){
 		Materialize.toast(JSON.stringify(data), 4000);
 		session.start(data.linkVideo,0,'large'); 
 	}); 

 	function sendMsg(msg){
 		socket.emit('msg',{ data : msg } ); 
 	}

 	//another behavior: 
 	$('#input_box').keypress(function(event){
 		if(event.which == 13){
 			socket.emit('msg',{msg : $('#input_box').val()}); 
 			session.clearInputBox(); 
 		}
 	}); 

 	// splashscrean
	var SplashScrean = function(){
		this.RATE = 1000; 
	}; 

	SplashScrean.prototype.show = function(){
		$("#splashscrean").fadeIn(this.RATE); 
	}

	SplashScrean.prototype.hide = function(){
		$("#splashscrean").fadeOut(this.RATE); 
	} 

 	var splash = new SplashScrean(); 
 	setTimeout(function(){
 		splash.hide();  
 	},1000); 
 	
 }); 
