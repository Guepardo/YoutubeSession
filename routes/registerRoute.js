var express = require('express'); 
var url     = require('url'); 
var socketServer = require('../modules/serverSocket'); 
var router = express.Router(); 

//Consumir via Ajax: 
router.post('/register', function(req, res, next){
	var linkVideo = req.body.linkVideo; 
	var nomeSala  = req.body.nomeSala; 

	var queryUrl = url.parse(linkVideo, true).query; 

	if(typeof queryUrl.v == 'undefined'){
		res.json({ status : false, msg : 'Url inválida'}); 
		return;
	}
	
	//Tudo ocorrendo bem, crie a sala e pegue a hash; 
	var hashId = socketServer.createRoom(queryUrl.v, nomeSala); 

	res.json({ status : true, msg : 'its working', hash : hashId});  
}); 


module.exports = router; 