var express = require("express");
var mysql = require("mysql");
var app = express();
var bodyParser = require("body-parser");
var fs = require('fs');
app.disable('x-powered-by');


var nodeadmin = require('nodeadmin');
app.use(nodeadmin(app));

function REST() {
    var self = this;
    self.connectMysql();
}

var SANDBOX_ROUNTER = function(router, connectionSandbox, connectionProblem) {
    var self = this;
    self.handleRoutes(router, connectionSandbox, connectionProblem);
}

SANDBOX_ROUNTER.prototype.handleRoutes = function(router, connectionSandbox, connectionProblem) {
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

                    // console.log(row);
                    // console.log(answer);

                }
            });
        });

    }
    // module.exports = sandbox_rounter;

var PROBLEM_ROUNTER = function(router, connection) {
    var self = this;
    self.handleRoutes(router, connection);
};

PROBLEM_ROUNTER.prototype.handleRoutes = function(router, connection) {
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
                if (row.lenght >= 1) {
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
                if (row.lenght == 0) {
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
    var sandbox_rounter = new SANDBOX_ROUNTER(router, connectionSandbox, connectionProblem);
    var problem_rounter = new PROBLEM_ROUNTER(router, connectionProblem);
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
    res.sendFile(__dirname + "/public/view/index.html");
});

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
