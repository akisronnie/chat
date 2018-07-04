var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var fs = require('fs');
app.use('/public', express.static('public'));
app.set('view engine', 'ejs');
var username = 'Пользователь';
var userlist =[];
var chatlog = [];


app.post('/chat',urlencodedParser, function(req, res){
    if (!req.body) return res.sendStatus(400);
		username = req.body.username;    
		req.body.userlist=userlist;
    res.render('chat', {data: req.body});
});


app.get('/index', function(req, res){
    res.render('login');
});

app.get('/', function(req, res){
    res.render('login');
});

app.get('/chat', function(req, res){
	if (username == 'Пользователь') {res.render('login');}
	else {res.render('chat');}
});

io.on('connection', function(socket){
	console.log(username+' connected');
	io.emit('chatlog', chatlog);
	
	userlist.push(' '+username);
	console.log(userlist);
	
	io.emit('chat message', 'Вошел в чат', username,userlist);
	chatlog.push(username + ':Вошел в чат');
	socket.on('disconnect', function(){
		console.log(username+' disconnected');
		for (i=0;i<userlist.length; i++){
			if (userlist[i]==(' '+username)) { userlist.splice(i, 1)}
		}
		io.emit('chat message', 'Вышел с чата', username, userlist);
		chatlog.push(username + ':Вышкл с чата');
	});

	socket.on('chat message', function(msg, usname){
		username = usname;

	  });
	socket.on('chat message', function(msg){

		io.emit('chat message', msg, username, userlist);
		chatlog.push(username + ':'+ msg);
		if (chatlog.length>20){chatlog.splice(1,1)};
	  });
  });
http.listen(process.env.PORT || 3000, function () {console.log('Server Start');
});