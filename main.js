var express = require("express");
var mysql = require("mysql");
var app = express();

var connection = mysql.createConnection({
  host    : 'localhost',
  user    : 'database',
  password: '123456789',
  database: 'ske'
});

app.get('/',function(req,res){
  res.send('Hello World!');
});


app.listen(80,function(){
  console.log("listen on port: 80");
});