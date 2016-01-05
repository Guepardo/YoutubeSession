var express = require('express'); 
var url     = require('url'); 

var router = express.Router(); 

//Consumir via Ajax: 
router.post('/register', function(req, res, next){
	console.log(req.body.linkVideo); 
	console.log(req.body.nomeSala); 

	var linkVideo = req.body.linkVideo; 
	var queryUrl = url.parse(linkVideo, true).query; 

	console.log( typeof queryUrl.v); 

	if(typeof queryUrl.v == 'undefined'){
		console.log("aqui"); 
		res.json({ status : false, msg : 'Url inválida'}); 
		return;
	}
		
	res.json({ status : true, msg : 'its working' });  
}); 


module.exports = router; 