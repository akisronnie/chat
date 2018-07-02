var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use('/public', express.static('public'));
app.set('view engine', 'ejs');

app.post('/chat',urlencodedParser, function(req, res){
    if (!req.body) return res.sendStatus(400);
     res.render('chat', {data: req.body});
});
app.get('/index', function(req, res){
    res.render('login');
});
app.get('/', function(req, res){
    res.render('login');
});


io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
        
    });
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});



http.listen(process.env.PORT || 3000, function () {console.log('Server Start');
});