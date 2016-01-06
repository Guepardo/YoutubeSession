var express  = require('express'); 
var router    = express.Router(); 
var socketServer = require('../modules/serverSocket'); 

router.get('/session/:hashId',function(req, res, next){
	console.log(req.params.hashId); 
	var hashId = req.params.hashId; 

	if(!socketServer.roomExists(hashId)){
		res.json({status : false, msg : 'Essa sala não existe ou já foi desativada.'}); 
		return;
	}
	res.render("session.html",{hashId : hashId}); 
}); 

module.exports = router; 