var express      = require("express"); 
var router       = express.Router(); 
var ServerSocket = require("../modules/ServerSocket"); 
//Main page. 

router.get('/',function(req, res, next){
   var rooms = ServerSocket.getInformations(); 
   res.render('index.html', {rooms: rooms});  
}); 

router.get('/socktest', function(req, res, next){
	res.render('testeSocket.html'); 
})

router.get('/sessionteste', function(req, res, next){
	res.render('session.html'); 
}); 

module.exports = router; 