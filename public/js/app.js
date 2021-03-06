
$(document).ready(function(){
 	// Teste socket
 	var socket  = io(window.location.origin);
 	var session = new WindowSession(socket); 

 	//Registrando o proprietário da sala: 

 	socket.emit('registerOwner'); 

 	socket.on('connect', function(data){
 		socket.emit('enterRoom', { room: hashId });
 	}); 

 	socket.on('msg', function (data) {
 		// Materialize.toast('Nova mensagem: '+ data.userName, 1000); 
 		session.newMessage(data); 
 	});

 	socket.on('newUser', function(data){
 		console.log(data.data); 
 		// Materialize.toast('Novo usuário na sala hashName: '+ data.hashName+ ' name: '+ data.name, 4000); 
 		session.newAvatar(data); 
 	}); 

 	socket.on('leave', function(data){
 		console.log("Um usuário deixou a sala"); 
 		session.removeAvatar(data.hashName); 
 		// Materialize.toast('Usuário saiu da sala', 4000); 
 	});

 	socket.on('reconnect_attempt', function(){
 		Materialize.toast('Socket Reconectando', 4000); 
 	}); 

 	socket.on('reconnect', function(){
 		Materialize.toast('Conexão reestabelecida', 4000);
 	}); 

 	socket.on('getRoomInfo',function(data){
 		// Materialize.toast(JSON.stringify(data), 4000);
 		session.start(data.linkVideo,data.timeout,'small',data.play,data.users,data.roomName); 
 	}); 

 	socket.on('onPlay',function(data){
 		session.playerPlay(); 
 	}); 

 	socket.on('onPause',function(data){
 		session.playerPause(); 
 	}); 

 	socket.on('changeTyping',function(data){
 		session.changeTyping(data.msg); 
 	}); 

 	socket.on('onSeek',function(data){
 		session.seekTo(data.time); 
 	}); 

 	socket.on('onStop',function(data){
 		session.playerStop(); 
 	}); 

 	socket.on('onBuffering',function(data){
 	});

 	socket.on('avatarStatusChange',function(data){
 		session.avatarStatusChange(data); 
 	});	


 	//another behavior: 
 	var isTyping = false; 
 	var typingTimeout; 
 	$('#input_box').keypress(function(event){
 		if(event.which == 13 ){
 			if($('#input_box').val().trim().length > 0){
 				socket.emit('msg',{msg : $('#input_box').val()}); 
 				session.clearInputBox(); 
 			}
 			return;
 		}

 		clearTimeout(typingTimeout); 

 		if(!isTyping){
 			console.log('Está digitando'); 
 			isTyping = true; 
 			session.typeBegin(); 
 		}
 		typingTimeout = setTimeout(function(){
 			if(isTyping){
 				isTyping = false; 
 				console.log("Parou de ditigar");
 				session.typeEnd();  
 			}
 		},450); 
 	}); 

 	var checkSynchronizationInterval; 
 	var DELAY_TO_SEND_SYNCH = 3 * 1000; //three seconds. 
 	checkSynchronizationInterval = setInterval(function(){
 		session.verifySynchronization(); 
 	},DELAY_TO_SEND_SYNCH); 

 	$('#volume').change(function(){
 		session.setVolume($('#volume').val());
 	}); 

 	$('#progress').change(function(){
 		session.seekTo($('#progress').val());
 	}); 

 	$('#thumb_up').click(function(){
 		session.onThumbUp();
 	}); 

 	var msgUnRead = 0; 
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
 	},5000); 
 	
 }); 
