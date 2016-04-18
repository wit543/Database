var express = require("express");
var mysql = require("mysql");
var app = express();
var bodyParser = require("body-parser");
var md5 = require('MD5');
app.disable('x-powered-by');
function REST() {
    var self = this;
    self.connectMysql();
}

var REST_ROUTER = function(router, connection, md5) {
    var self = this;
    self.handleRoutes(router, connection, md5);
}
REST_ROUTER.prototype.handleRoutes = function(router, connection, md5) {
    router.get('/rest', function(req, res) {
        res.json({
            "Message": "Hello World !"
        });
    });
    router.post("/user", function(req, res) {
        var query = "SELECT * FROM classroom";
        connection.query(query, function(err, row) {
            if (err) {
                res.json({
                    "Error": true,
                    "Message": "Error executing MySQL"
                });
            } else {
                res.json({
                    "Error": false,
                    "Message": "Success",
                    "Users": row
                });
            }
        });
    });
    router.post("/user/:table", function(req, res) {
        var query = "SELECT * FROM ??";
        var table = [req.params.table];

        query = mysql.format(query, table);
        console.log(query);
        connection.query(query, function(err, row) {
            if (err) {
                res.json({
                    "Error": true,
                    "Message": "Error executing MySQL"
                });
            } else {
                res.json({
                    "Error": false,
                    "Message": "Success",
                    "row": row
                });
            }
        });
    });
    router.post("/query",function(req, res){
      var query = req.body.query;
      console.log(query);
      connection.query(query, function(err, row) {
          if (err) {
              res.json({
                  "Error": true,
                  "Message": "Error executing MySQL" + err
              });
          } else {
              res.json({
                  "Error": false,
                  "Message": "Success",
                  "row": row
              });
          }
      });
    });
    router.put("/query", function(req, res) {
        var query = req.body.query;
        console.log(query);
        connection.query(query, function(err, row) {
            if (err) {
                res.json({
                    "Error": true,
                    "Message": "Error executing MySQL" + err
                });
            } else {
                res.json({
                    "Error": false,
                    "Message": "Success",
                    "row": row
                });
            }
        });
    });
}
module.exports = REST_ROUTER;

REST.prototype.connectMysql = function() {
    var self = this;
    var pool = mysql.createPool({
        connecitonLimit: 100,
        host: 'localhost',
        user: 'database',
        password: '123456789',
        database: 'ske'
    });
    pool.getConnection(function(err, connection) {
        if (err) {
            self.stop(err);
        } else {
            self.configureExpress(connection);
        }
    });

}

REST.prototype.configureExpress = function(connection) {
    var self = this;
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    var router = express.Router();
    app.use('/api', router);
    var rest_router = new REST_ROUTER(router, connection, md5);
    self.startServer();
}

REST.prototype.startServer = function() {
    app.listen(80, function(err) {
        if(err)
          console.log(err);
        console.log("All right ! I am alive at Port 80.");
    });
}

REST.prototype.stop - function(err) {
    console.log("ISSURE WITH MYSQL :" + err);
    process.exit(1);
}
new REST();
app.get('/', function(req, res) {
    res.sendFile(__dirname+"/view/index.html");
});


//app.listen(80,function(){
//  console.log("listen on port: 800");
//});
