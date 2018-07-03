var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use('/public', express.static('public'));
app.set('view engine', 'ejs');
var username = 'Пользователь';
var usname1;
app.post('/chat',urlencodedParser, function(req, res){
    if (!req.body) return res.sendStatus(400);
    username = req.body.username;
    console.log(req.body.username);
    
    res.render('chat', {data: req.body});
});
app.get('/index', function(req, res){
    res.render('login');
});
app.get('/', function(req, res){
    res.render('login');
});


io.on('connection', function(socket){
	
	console.log(username+' connected');
	io.emit('chat message', 'Вошел в чат', username);
	socket.on('disconnect', function(){
	  console.log(username+' disconnected');
	  io.emit('chat message', 'Вышел с чата', username);
	});
	socket.on('chat message', function(msg, usname){
		console.log('message: ' + msg);
		username = usname;
	  });
	socket.on('chat message', function(msg){
		io.emit('chat message', msg, username);
	  });
  });


http.listen(process.env.PORT || 3000, function () {console.log('Server Start');
});