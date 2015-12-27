var express = require("express"); 
var router  = express.Router(); 

//Main page. 
router.get('/',function(req, res, next){
   res.render('index.html');  
}); 

router.get('/socktest', function(req, res, next){
	res.render('testeSocket.html'); 
})

module.exports = router; 