var app = angular.module("app", []);
app.controller("ctr", function($scope, $http) {


});
angular.module('sidenav', ['ngMaterial'])
    .controller('AppCtrl', function($scope, $timeout, $mdSidenav, $log, $http) {
        $scope.submit = function() {
            if($scope.buttonSummit =='next'){
              $scope.current_problem_id=$scope.current_problem_id+1;
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
                if(res.data.correct){
                  $scope.buttonSummit="next";
                }
            }, function err(res) {
                console.log("ERR" + res);
            });
        };
        $scope.buttonSummit="submit";
        $scope.subheads = [{
            "name": "1",
            "expand": false
        }, {
            "name": "2",
            "expand": false
        }];
        $scope.isInSub = function(sub, category) {
            return sub == category;
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

        $scope.showbasic = false;
        $scope.showadvance = false;
        $scope.current_problem_id;
        $scope.basicclick = function() {
            if ($scope.showbasic) {
                $scope.showbasic = false;
            } else $scope.showbasic = true;
        };
        $scope.advanceclick = function() {
            if ($scope.showadvance) {
                $scope.showadvance = false;
            } else $scope.showadvance = true;
        };
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

        $scope.toggleLeft = buildDelayedToggler('left');
        $scope.toggleRight = buildToggler('right');
        $scope.isOpenRight = function() {
            return $mdSidenav('right').isOpen();
        };
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
    })
    .controller('LeftCtrl', function($scope, $timeout, $mdSidenav, $log) {
        $scope.close = function() {
            /* Component lookup should always be available since we are not using `ng-if`*/
            $mdSidenav('left').close()
                .then(function() {
                    $log.debug("close LEFT is done");
                });
        };
    })
    .controller('RightCtrl', function($scope, $timeout, $mdSidenav, $log) {
        $scope.close = function() {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav('right').close()
                .then(function() {
                    $log.debug("close RIGHT is done");
                });
        };
    });
