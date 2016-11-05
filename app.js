var express      = require("express"); 
var path         = require("path"); 
var session      = require("client-sessions"); 
var http    	 = require("http"); 
var bodyParser   = require("body-parser"); 
var ServerSocket = require("./modules/serverSocket"); 

var app = express(); 

//Arquivo de configuração de rotas: 
app.use(bodyParser.urlencoded({ extended: true})); 
app.use(bodyParser.json()); 

app.use('/', require("./routes/routes") );
app.use('/', require("./routes/registerRoute")); 
app.use('/', require("./routes/sessionRoute")); 

//Registrando pasta de arquivos estáticos: 
app.use(express.static(path.join(__dirname, 'public')));

//Registrando view engine: 
app.set('views', __dirname + '/views'); 
app.engine('html', require('ejs').renderFile); 
app.set('view engine', 'ejs'); 

//Iniciando servidor: 
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000);
app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");

var server = http.createServer(app);
server.listen(app.get('port') ,app.get('ipaddr'));  
ServerSocket.init(server); 

