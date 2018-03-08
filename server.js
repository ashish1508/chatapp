
var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));
app.get('/', function(req, res){
  res.sendFile(__dirname+'/public/app.html');
});
var ids = [];
var online=[];
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('typing',function(data){
  	var recid;
  	for(var i=0;i<ids.length;i++){
     	if(ids[i].name==data.rname)
     		recid = ids[i].id;
     }
     io.to(recid).emit('typing',data.sname+" is typing...")

  })
  
  socket.on('chat message', function(data){
    console.log('message: ' + data.msg);
     //socket.broadcast.emit('chat message', msg);
     var chatterid;
     for(var i=0;i<ids.length;i++){
     	if(ids[i].name==data.rname)
     		chatterid = ids[i].id;
     }
     console.log('scid'+chatterid);
     io.to(socket.id).emit("chat message",data.sname+' : '+data.msg);
     io.to(chatterid).emit("chat message",data.sname+' : '+data.msg);

  });

  socket.on('getolusers',function(data){

  	io.to(socket.id).emit('olusers',online);
  })
  socket.on('adduser',function(data){
  	console.log('data :'+data);
  	console.log('socketid :'+socket.id);
  	socket.join(socket.id);
  	ids.push({
  		name:data,
  		id:socket.id
  	});
  	online.push({
  		name:data,
  		id:socket.id
  	})
  	for(x in ids){
     	console.log('ids :'+ids[x].name+" "+ids[x].id);
     }
  })
  socket.on('disconnect', function(){
  	console.log(socket.id);
  	
    console.log('user disconnected');
    var obj={};
    console.log("before removing :");
     var pos = ids.map(function(e) { return e.id; }).indexOf(socket.id);
     console.log(pos)
     ids.splice(pos,1);
     console.log("after removing :");
     var onpos = ids.map(function(e) { return e.id; }).indexOf(socket.id);
     online.splice(onpos,1);
  });

});



http.listen(3000, function(){
  console.log('listening on *:3000');
});