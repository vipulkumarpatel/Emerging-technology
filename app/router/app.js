var app = angular.module("App", ["ngRoute"]);

app.config(function ($routeProvider,$httpProvider){ 
        $routeProvider.
            when('/', {
            templateUrl: 'View/Home.html'
        }).
        when('/DocReg', {
            templateUrl: 'View/DoctorReg.html',
            controller: 'DocRegCtrl'
        }).
        when('/PatientList', {
            templateUrl: 'View/Doctor/PatientList.html',
            controller: 'patientListCtrl'
        }).
        when('/profile', {
            templateUrl: 'View/Doctor/Profile.html',
            controller: 'DocProfileCtrl',
            resolve: {
                loggedin: checkLoggedin
            }
        }).
        when('/PatientReg', {
            templateUrl: 'View/Patient/PatientReg.html',
            controller: 'PatientCtrl'
        }).
        when('/PatientVisit', {
            templateUrl: 'View/Patient/PatientVisit.html',
            controller: 'PatientVisitCtrl'
        }).
        when('/PatientDetails', {
            templateUrl: 'View/Patient/PatientDetails.html',
            controller: 'PatientDetailsCtrl'
        }).
        when('/DocLogin', {
            templateUrl: 'View/DocLogin.html',
            controller:'DocLoginCtrl'
        }).
        otherwise({
            redirectTo:'/'
        });
});

var checkLoggedin = function ($q, $timeout, $http, $location, $rootScope) {
    var deferred = $q.defer();

    $http.get('/loggedin').success(function (user) {
        $rootScope.errorMessage = null;
        // User is Authenticated
        if (user !== '0') {
            $rootScope.currentUser = user;
            deferred.resolve();
        }
            // User is Not Authenticated
        else {
            $rootScope.errorMessage = 'You need to log in.';
            deferred.reject();
            $location.url('/DocLogin');
        }
    });

    return deferred.promise;
};

app.controller("NavCtrl", function ($scope, $http, $location, $rootScope) {
    $scope.logout = function () {
        $http.post("/logout")
        .success(function () {
            $rootScope.currentUser = null;
            $location.url("/home");
        });
    };
});