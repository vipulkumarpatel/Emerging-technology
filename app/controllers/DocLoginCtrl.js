app.controller("DocLoginCtrl", function ($scope, $http, $location, $rootScope) {
    $scope.login = function (user) {
        $http.post("/doclogin", user)
        .success(function (response) {
            $rootScope.currentUser = response;
            $location.url("/profile");
        });
    };
});