
app.controller('DocRegCtrl', function ($scope, $http, $location, $rootScope) {
    $rootScope.message = "";
    $scope.register = function (user) {
        console.log(user);
        if (user.password != user.cnfpassword || !user.password || !user.cnfpassword) {
            $rootScope.message = "Your passwords don't match";
        }
        else {
            $rootScope.message = "";
            $http.post("/docregister", user)
            .success(function (response) {
                console.log(response);
                if (response == null) {
                    $rootScope.message = "Username already exists";
                } else {
                    $rootScope.currentUser = response;
                    $location.url("/profile");
                }
            });
        }
    };
});
