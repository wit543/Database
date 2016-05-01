<html>

<body>
    <!-- jquery -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
    <!-- angularjs -->
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.3/angular.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.3/angular-animate.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.3/angular-aria.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.3/angular-route.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.3/angular-messages.min.js"></script>
    <!-- angular Material -->
    <script src="https://ajax.googleapis.com/ajax/libs/angular_material/1.1.0-rc2/angular-material.min.js"></script>
    <!-- bootstrap -->
    <script type="text/javascript" src="https://netdna.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" ></script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
    <!-- material style -->
    <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/angular_material/1.1.0-rc2/angular-material.min.css">

    <!-- <script src="main.js"></script> -->
    <script type="text/javascript">
        var app = angular.module('sidenav', ['ngMaterial']);
        app.factory('authInterceptor', function($rootScope, $q, $window) {
            return {
                request: function(config) {
                    config.headers = config.headers || {};
                    if ($window.sessionStorage.token) {
                        console.log("in");
                        config.headers.Authorization = $window.sessionStorage.token;
                        // config.headers.['x-access-token'] =  $window.sessionStorage.token;
                    }
                    return config;
                },
                response: function(response) {
                    if (response.status === 401) {
                        // handle the case where the user is not authenticated
                    }
                    return response || $q.when(response);
                }
            };
        });
        app.config(function($httpProvider) {
            $httpProvider.interceptors.push('authInterceptor');
        });
        app.controller('AppCtrl', function($scope, $timeout, $mdSidenav, $log, $http, $window) {
            $scope.username = "wit";
            $scope.password = "321";
            $scope.isLogin = false;
            $scope.login = function() {
                if ($scope.username == "" || $scope.password == "") {
                    window.alert("Please check your infomation");
                } else {
                    $http.post("api/authenticate", {
                        "username": $scope.username,
                        "password": $scope.password
                    }).then(function success(res) {
                        if (res.data.success) {
                            console.log(res.data.token);
                            $window.sessionStorage.token = res.data.token;
                            $scope.isLogin = true;
                            $scope.getProgress();
                            window.alert("login as: " + $scope.username);
                        } else {
                            console.log(res.data.message);
                            window.alert("Please check your username and password");
                        }
                    }, function err(res) {
                        console.log(res);
                    });
                }
            }
            $scope.logout = function() {
                delete $window.sessionStorage.token;
                window.alert("Log out successful!");
                $scope.isLogin = false;
            };
            $scope.signup = function() {
                if ($scope.username == "" || $scope.password == "" || $scope.confirmpassword == "" || ($scope.password != $scope.confirmpassword)) {
                    window.alert("Please check your infomation");
                } else {
                    window.alert("sign up with username: " + $scope.username + "\npassword: " + $scope.password);
                    if (!$scope.isLogin) {
                        http.post("api/createNewUser", {
                            "username": $scope.usernamem,
                            "password": $scope.password
                        }).then(function success(res) {

                        }, function error(res) {
                            console.log(res);
                        });
                    }
                }
            }
            $scope.getProgress = function() {
                if ($scope.isLogin) {
                    $http.get('/api/progress', function() {
                    }).then(function success(res) {
                      console.log("progrsss");
                      console.log(res.data.row);
                        $scope.progress = res.data.row;
                    }, function error(res) {
                        console.log(res);
                    })
                }

            }
            if ($window.sessionStorage.token) {
                $http.get("/api/check")
                    .then(function success(res) {
                      $scope.isLogin=true;
                      $scope.username= res.data.username;
                      $scope.getProgress();
                        console.log(res);
                    }, function error(res) {
                      $scope.isLogin=false;
                        // $scope.login();
                    });
            }
            $scope.username = "";
            $scope.password = "";

            $scope.confirmpassword = "";


            $scope.submit = function() {
                if ($scope.buttonSummit == 'next') {
                    $scope.buttonSummit = "submit";
                    $scope.query = "";
                    $scope.current_problem_id = $scope.current_problem_id + 1;
                    $scope.selectq($scope.current_problem_id);
                    return;
                }
                console.log($scope.query);
                $http.post("/api/query", {
                    "query": $scope.query,
                    "problem_id": $scope.current_problem_id
                }).then(function success(res) {
                    console.log(res.data);
                    if (res.data.error == true) {
                        $scope.error = res.data.error_message;
                    } else {
                        $scope.error = null;
                    }
                    console.log(res.data.row);
                    $scope.result = res.data.row;
                    if (res.data.correct) {
                        $scope.buttonSummit = "next";
                        $scope.getProgress();
                        // $scope.progressCheck=true;
                    }
                }, function err(res) {
                    console.log("ERR" + res);
                });
            };
            $scope.buttonSummit = "submit";
            $scope.subheads = [{
                "name": "1",
                "expand": false
            }, {
                "name": "2",
                "expand": false
            }];
            $http.get("api/chapters").then(function success(res) {
                if (!res.data.error) {
                    console.log(res.data.row);
                    var array = [];
                    for (var i = 0; i < res.data.row.length; i++) {
                        array.push({
                            "name": res.data.row[i].chapter_name,
                            "id": res.data.row[i].chapter_id,
                            "expand": false
                        });
                    }
                    $scope.subheads = array;
                }
            }, function err(res) {
                console.log("ERR " + res);
            })
            $scope.isInSub = function(sub, category) {
                return sub == category;
            };
            $scope.isDone = function(id){
                for(var i in $scope.progress){
                  console.log($scope.progress[i].problem_id+" "+id+" "+$scope.progress[i].correctness);
                  if($scope.progress[i].problem_id==id && $scope.progress[i].correctness){
                    return true;
                  }
                }
                return false;
            };
            $scope.clickSubHead = function(sub) {
                if (sub.expand) {
                    sub.expand = false;
                } else sub.expand = true;
            };

            $http.post("/api/problems", {
                "command": "problems"
            }).then(function success(res) {
                $scope.questions = res.data.row;
                console.log(res.data.row);
            }, function err(res) {
                console.log("ERR" + res);
            });
            $scope.current_problem_id;
            $scope.selectq = function(id) {
                $scope.current_problem_id = id;
                $http.post("/api/problem", {
                    "id": id
                }).then(function success(res) {
                    if (res.data.error == true) {
                        console.log(res.data.error_message);
                    }
                    $scope.question = res.data.problem;
                    console.log(res.data.problem);
                }, function err(res) {
                    console.log("ERR" + res);
                });
            };
            $scope.getSolution = function() {
                $http.post("/api/solution", {
                    "id": $scope.current_problem_id
                }).then(function success(res) {
                    alert(res.data.solution);
                }, function err(res) {
                    console.log("ERR" + res);
                });
            };
            $scope.toggleLeft = buildDelayedToggler('left');
            /**
             * Supplies a function that will continue to operate until the
             * time is up.
             */
            function debounce(func, wait, context) {
                var timer;
                return function debounced() {
                    var context = $scope,
                        args = Array.prototype.slice.call(arguments);
                    $timeout.cancel(timer);
                    timer = $timeout(function() {
                        timer = undefined;
                        func.apply(context, args);
                    }, wait || 10);
                };
            }
            /**
             * Build handler to open/close a SideNav; when animation finishes
             * report completion in console
             */
            function buildDelayedToggler(navID) {
                return debounce(function() {
                    /* Component lookup should always be available since we are not using `ng-if`*/
                    $mdSidenav(navID)
                        .toggle()
                        .then(function() {
                            $log.debug("toggle " + navID + " is done");
                        });
                }, 200);
            }

            function buildToggler(navID) {
                return function() {
                    /*Component lookup should always be available since we are not using `ng-if`*/
                    $mdSidenav(navID)
                        .toggle()
                        .then(function() {
                            $log.debug("toggle " + navID + " is done");
                        });
                }
            }


            $scope.openLeftMenu = function() {
                console.log("in");
                $mdSidenav('left').toggle();
            };



        });
    </script>




    <div ng-app="sidenav" ng-controller="AppCtrl">
        <div layout="column">
            <md-toolbar class="md-hue-2">
                <div class="md-toolbar-tools" >
                    <md-button class="md-icon-button" aria-label="Settings" ng-click="openLeftMenu()">
                        <img src="http://wit543.xyz/images/ic_list_black_48dp_2x.png">
                    </md-button>
                    <h2>
               <span> Wit543 Database School </span>
             </h2>
                <div flex>
                    <button class="btn btn-primary btn-sm" ng-show="isLogin" ng-click="logout()" style="float: right;">Log out</button>
                    <div style="float: right;">

                    </div>
                    <div ng-show="isLogin" style="float: right;">
                        <p style="white-space: pre;"><FONT SIZE=2>Welcome, {{username}}   </FONT> </p>
                    </div>
                    <button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#signupModal" ng-show="!isLogin" style="float: right; ">Sign up</button>
                    <button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#loginModal" ng-show="!isLogin" style="float: right;">Log in</button>
                </div>
                </div>
            </md-toolbar>
        </div>
        <div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="loginModalLabel">Login</h4>
                </div>
                <div class="modal-body">
                    <p>Username:</p>  <input  ng-model="username"> <br>
                    <p>Password:</p>  <input  ng-model="password"> <br>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal" ng-click="login()">Login</button>
                </div>
            </div>
        </div>
        </div>

        <div class="modal fade" id="signupModal" tabindex="-1" role="dialog" aria-labelledby="signupModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="signupModalLabel">Sign up</h4>
                </div>
                <div class="modal-body">
                    <p>Username:</p>  <input  ng-model="username"> <br>
                    <p>Password:</p>  <input  ng-model="password"> <br>
                    <p>Confirm Password:</p>  <input  ng-model="confirmpassword"> <br>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal" ng-click="signup()">Sign Up</button>
                </div>
            </div>
        </div>
        </div>
        <div layout="column" layout="row" style="overflow-x: hidden; height: calc(100% - 64px);">
            <section layout="row" flex>
                <md-sidenav class="md-sidenav-left " md-component-id="left" md-is-locked-open="$mdMedia('gt-md')" md-disable-backdrop md-whiteframe="4">
                    <md-toolbar class="md-theme-indigo">
                        <h1 class="md-toolbar-tools">Question List</h1>
                    </md-toolbar>
                    <md-content layout-padding style="overflow-x: hidden">
                        <div class="row">
                            <md-button class="md-primary" hide-gt-md>
                                Close Sidenav Left
                            </md-button>
                            <p hide-md show-gt-md>
                                Choose question from the list below. Click 'Show table' for information.
                            </p>
                        </div>
                        <md-content>
                            <md-list flex>
                                <md-list ng-model="progressCheck"  flex ng-repeat="subhead in subheads">
                                    <md-subheader class="md-no-sticky" ng-click="clickSubHead(subhead)"> {{ subhead.name }} </md-subheader>
                                    <ul>
                                        <li ng-repeat="question in questions" ng-if="isInSub(subhead.id,question.chapter_id)" ng-click="selectq(question.problem_id)" ng-show="subhead.expand">
                                            <div layout="row" >
                                              <div style="width:80%;"><p style="font-size:12px" >{{ question.header }}</p></div>
                                                <div ng-if="isDone(question.problem_id)" style="width:20%; height:1em; background-color:#0F0;"></div>
                                            </div>
                                        </li>
                                    </ul>
                                    <md-divider ng-show="subhead.expand"></md-divider>


                                </md-list>
                            </md-list>

                        </md-content>

                    </md-content>
                </md-sidenav>
                <md-content flex layout-padding>


                    <div layout="column">
                        <div class="row">
                            <div class="col-md-4" 　>
                                <form>

                                    <h3>Question: {{question}}</h3>
                                        <textarea type="text" rows="4" cols="50" class="form-control" ng-model="query" placeholder="SELECT * FROM classroom" style="overflow:auto;resize:none ; height: calc(100% - 192px); min-height:64px "></textarea>
                                </form>
                            </div>
                            <div class="col-md-8" id="result" style="  height: calc(100vh - 192px); min-height:128px">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th ng-repeat="(header, value) in result[0]">{{header}}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <h1 ng-bind="error" style="color: #FF5050;"></h1>
                                        <tr ng-repeat="row in result">
                                            <td ng-repeat="cell in row">
                                                {{cell}}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div flex style="position:fixed; bottom:0; background-color:#3F51B5; width:100%; padding: 0px;">
                        <md-button class="md-raised md-primary" ng-click="submit()">{{buttonSummit}}</md-button>
                        <md-button class="md-raised md-warn" ng-click="getSolution()">Give Up</md-button>
                        <md-button class="md-raised" onclick="window.open('http://wit543.xyz/showTable')">Show Table</md-button>
                        
                        <div style="float: right;">
                            <p style="white-space: pre;"><FONT SIZE=1>powered by wit543@gmail.com     </FONT> </p>
                        </div>
                    </div>

                    <!--
                <md-toolbar class="md-hue-2" layout="column" style="position:fixed; bottom:0;">
                    <div class="md-toolbar-tools">
                        <h2>
                         <span>Toolbar with Disabled/Enabled Icon Buttons</span>
                       </h2>
                        <div flex>
                            <md-button class="md-raised md-primary" ng-click="submit()">{{buttonSummit}}</md-button>
                            <md-button class="md-raised md-warn" ng-click="getSolution()">Give Up</md-button>
                        </div>
                    </div>
                </md-toolbar>
-->
                </md-content>


            </section>
        </div>
    </div>


</body>

</html>

