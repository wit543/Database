var app = angular.module("app", []);
app.controller("ctr", function($scope, $http) {
    $scope.submit = function() {
        console.log($scope.query);
        $http.post("/api/query", {
            "query": $scope.query
        }).then(function success(res) {
            console.log("success: " + res.data.Error);
            if (res.data.Error == true) {
                $scope.error = res.data.Message;
            } else {
                $scope.error = null;
            }
            console.log(res.data.row);
            $scope.result = res.data.row;
        }, function err(res) {
            console.log("ERR" + res);
        });
    }
});
