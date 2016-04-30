var express = require("express");
var mysql = require("mysql");
var app = express();
var bodyParser = require("body-parser");
var fs = require('fs');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
app.disable('x-powered-by');
var privateKey = "__9zwqYpGe*@=6&vBnD-mpNG*A_6?uWV";

var nodeadmin = require('nodeadmin');
app.use(nodeadmin(app));

function REST() {
    var self = this;
    self.connectMysql();
}

var SANDBOX_ROUTER = function(router, connectionSandbox, connectionProblem) {
    var self = this;
    self.handleRoutes(router, connectionSandbox, connectionProblem);
}

SANDBOX_ROUTER.prototype.handleRoutes = function(router, connectionSandbox, connectionProblem) {
        router.put("/question", function(req, res) {
            var answer = req.body.question_id;

        });
        router.post("/query", function(req, res) {
            var query = req.body.query;
            console.log("sandbox: " + query);
            connectionSandbox.query(query, function(err, row) {
                if (err) {
                    res.json({
                        "error": true,
                        "error_message": "" + err,
                        "correct": false
                    });
                } else {
                  if(req.body.problem_id){
                    var queryAnswer = "SELECT solution FROM problems WHERE problem_id = " + req.body.problem_id;
                    connectionProblem.query(queryAnswer, function(errA, rowA) {
                        if (errA) {
                            console.log("1: " + errA);
                            return;
                        }
                        var answerQuery = rowA[0].solution;
                        console.log(answerQuery);
                        connectionSandbox.query(answerQuery, function(errA, rowA) {
                            if (errA) {
                                console.log("2: " + errA);
                                return;
                            }
                            var answer = rowA;
                            if (JSON.stringify(answer) == JSON.stringify(row)) {
                                res.json({
                                    "error": false,
                                    "error_message": "",
                                    "row": row,
                                    "correct": true
                                });
                            } else {
                                res.json({
                                    "error": false,
                                    "error_message": "",
                                    "row": row,
                                    "correct": false
                                });
                            }
                        });
                    });
                  }
                  else{
                    connectionSandbox.query(req.body.query,function(err,row){
                      if(err){
                        res.json({
                            "error": true,
                            "error_message": "" + err,
                            "correct": false
                        });
                      }
                      else{
                        res.json({
                            "error": false,
                            "error_message": "",
                            "row": row
                        });
                      }
                    });
                  }

                }
            });
        });

    }
    // module.exports = sandbox_rounter;

var PROBLEM_ROUTER = function(router, connection) {
    var self = this;
    self.handleRoutes(router, connection);
};

PROBLEM_ROUTER.prototype.handleRoutes = function(router, connection) {
    router.post("/problem", function(req, res) {
        var query = "SELECT problem from problems where problem_id=" + req.body.id;
        console.log("problem: " + query);
        connection.query(query, function(err, row) {
            console.log(row == null);
            if (err) {
                res.json({
                    "error": true,
                    "error_message": err
                });
            } else {
                if (row.length == 0) {
                    res.json({
                        "error": true,
                        "error_message": "no problem",
                        "problem": ""
                    });
                } else {
                    res.json({
                        "error": false,
                        "error_message": "",
                        "problem": row[0].problem
                    });
                }
            }
        });
    });
    router.post("/problems", function(req, res) {
        var query = "SELECT problem_id,header,chapter_id FROM problems";
        console.log("problem: " + query);
        console.log(req.headers);
        connection.query(query, function(err, row) {
            if (err) {
                res.json({
                    "error": true,
                    "error_message": "Error executing MySQL" + err
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
    router.post("/hasProblem", function(req, res) {
        var query = "SELECT * FROM problems WHERE problem_id = " + req.body.id;
        connection.query(query, function(err, row) {
            if (err) {
                res.json({
                    "error": true,
                    "error_message": "" + err,
                    "hasProblem": false
                });
            } else {
                if (row.length >= 1) {
                    res.json({
                        "error": false,
                        "error_message": "success",
                        "hasProblem": true
                    });
                } else {
                    res.json({
                        "error": false,
                        "error_message": "success",
                        "hasProblem": false
                    });
                }
            }
        })
    });
    router.get("/chapters", function(req, res) {
        var query = "SELECT chapter_id,chapter_name FROM chapter";
        connection.query(query, function(err, row) {
            if (err) {
                res.json({
                    "error": true,
                    "error_message": "" + err
                })
            } else {
                res.json({
                    "error": false,
                    "error_message": "success",
                    "row": row
                })
            }
        })
    });
    router.post("/solution", function(req, res) {
        var query = "SELECT solution FROM problems WHERE problem_id = " + req.body.id;
        connection.query(query, function(err, row) {
            if (err) {
                res.json({
                    "error": true,
                    'error_message': "" + err
                });
            } else {
                if (row.length == 0) {
                    res.json({
                        "error": true,
                        "error_message": "no solution",
                        "solution": ""
                    });
                } else {
                    res.json({
                        "error": false,
                        "error_message": "success",
                        "solution": "" + row[0].solution
                    });
                }
            }
        });
    })
}

var AUTHENTICATION_ROUTER = function(router, connection) {
    var self = this;
    self.handleRoutes(router, connection);
};
AUTHENTICATION_ROUTER.prototype.handleRoutes = function(router, connection) {

    router.post('/createNewUser', function(req, res) {
        if (!req.body.username && !req.body.password) {
            res.json({
                success: false,
                message: 'no username and password'
            });
            return;
        }
        if (!req.body.username) {
            res.json({
                success: false,
                message: 'no username'
            });
            return;
        }
        if (!req.body.password) {
            res.json({
                success: false,
                message: 'no username'
            });
            return;
        }
        bcrypt.genSalt(10,function(err,salt){
          if(err){
            console.log("gen: "+err);
            res.json({
              'error gen':err
            });
          }
          else{
            bcrypt.hash(req.body.password,salt,function functionName(err,hash) {

              if(err){
                              console.log("hash: "+err);
                res.json({
                  'error hash':err
                });
              }
              else{
                console.log(hash);
                var query = "INSERT IGNORE INTO user (username,password) VALUES (" + "'" + req.body.username + "','" + hash + "')";
                connection.query(query, function(err, row) {
                  if (err) {
                    res.json({
                        "error": err,
                        "success":false
                    });
                  }
                  else if(row.affectedRows==1){
                    res.json({
                        "err": err,
                        "success":true
                    });
                  }
                  else{
                    res.json({
                        "err": err,
                        "message":"already have user",
                        "success":false
                    });
                  }



                });
              }
            })

          }
        });

    });
    router.post('/authenticate', function(req, res) {
        var query = "SELECT * FROM user WHERE username = '" + req.body.username + "'";
        connection.query(query, function(err, row) {
            if (err) {
                console.log(err);
                res.json({
                    success: false,
                    message: 'Authentication failed. ERROR'
                });
            } else if (row.length == 0) {
                res.json({
                    success: false,
                    message: 'Authentication failed. User not found.'
                });
            } else if (row.length >= 1) {
              bcrypt.compare(req.body.password,row[0].password,function(err,isMatch){
                if(err){
                  res.json({
                    "error":err
                  });
                }
                else if(isMatch){
                  var token = jwt.sign(row[0], privateKey, {
                      expiresIn: 86400 // expires in 24 hours
                  });
                  res.json({
                      success: true,
                      message: 'Enjoy your token!',
                      token: token
                  });
                }
                else{
                  res.json({
                      success: false,
                      message: 'Authentication failed. Wrong password.'
                  });
                }
              });
            }
        })
    });
    router.use(function(req, res, next) {
        var token = req.body.token || req.param('token') || req.headers['x-access-token'] || req.headers.authorization;
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, privateKey, function(err, decoded) {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    });
    router.get('/check',function(req,res){
        res.json({"username":req.decoded.username});
    });
    router.get('/progress',function(req,res){
      var query = "SELECT * FROM grading_list WHERE username = '"+req.decoded.username+"'";
      connection. query(query,function(err,row){
        if(err){
          res.json({
            "error":true,
            "error_message":err
          });
        }
        else{
          res.json({
            "error":false,
            "row":row
          });
        }
      });

    });
};
REST.prototype.connectMysql = function() {
    var self = this;
    var connectionSandbox = mysql.createConnection({
        host: 'localhost',
        user: 'database',
        password: '123456789',
        database: 'ske'
    });
    connectionSandbox.connect(function(err) {
        if (err) {
            self.stop(err);
            return;
        }

        console.log('connected as id ' + connectionSandbox.threadId);
    });
    connectionProblem = mysql.createConnection({
        host: 'localhost',
        user: 'controler',
        password: 'qwertyuiop',
        database: 'web'
    });
    connectionProblem.connect(function(err) {
        if (err) {
            self.stop(err);
            return;
        }

        console.log('connected as id ' + connectionProblem.threadId);
    });
    self.configureExpress(connectionSandbox, connectionProblem);

}

REST.prototype.configureExpress = function(connectionSandbox, connectionProblem) {
    var self = this;
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    var router = express.Router();
    app.use('/api', router);

    var sandbox_router = new SANDBOX_ROUTER(router, connectionSandbox, connectionProblem);

    var problem_router = new PROBLEM_ROUTER(router, connectionProblem);
    var authentication_router = new AUTHENTICATION_ROUTER(router, connectionProblem);
    self.startServer();
}

REST.prototype.startServer = function() {
    app.listen(80, function(err) {
        if (err)
            console.log(err);
        console.log("All right ! I am alive at Port 80.");
    });
}



REST.prototype.stop - function(err) {
    console.log("ISSURE WITH MYSQL :" + err);
    process.exit(1);
}
new REST();

// app.use(express.static(__dirname + "/public"));
app.use(express.static('public'));

app.get("/public/view/codemirror.js", function(req, res) {
    res.sendFile(__dirname + "/public/view/codemirror.js");
});

app.get('/public/view/main.js', function(req, res) {
    res.sendFile(__dirname + "/public/view/main.js");
})

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/public/view/sidenav.html");
});
app.get('/showTable', function(req, res) {
    res.sendFile(__dirname + "/public/view/showTable.html");
})
// app.get('/images/ic_menu_white_48px',function(req,res){
//
//   var img = fs.readFileSync('./public/images/ic_menu_white_48px.svg');
//   res.end(img,"binary");
// })
app.get('/sidenav', function(req, res) {
    res.sendFile(__dirname + "/public/view/sidenav.html");
})


//app.listen(80,function(){
//  console.log("listen on port: 800");
//});
