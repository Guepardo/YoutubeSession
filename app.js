var express = require("express"); 
var path    = require("path"); 
var session = require("client-sessions"); 
var http    = require("http"); 
var socket = require("./modules/serverSocket"); 


var app = express(); 

//Arquivo de configuração de rotas: 
var routes = require("./routes/routes"); 
app.use('/', routes ); 

//Registrando pasta de arquivos estáticos: 
app.use(express.static(path.join(__dirname, 'public')));

//Registrando view engine: 
app.set('views', __dirname + '/views'); 
app.engine('html', require('ejs').renderFile); 
app.set('view engine', 'ejs'); 

//Iniciando servidor: 
var port = process.env.PORT || 3000; 

app.set('port', port ); 
var server = http.createServer(app);
server.listen(port);  
socket.init(server); 

socket.createRoom('1234'); 