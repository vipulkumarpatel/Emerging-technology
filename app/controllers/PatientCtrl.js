app.controller('PatientCtrl', function ($scope, $http) {

    //get the response from the server and send it to front end to display information
    $scope.renderpatientModels = function (response) {
        $scope.doctorModels = response;
    };

    //get request to get dpctor names from doctor schema
    $scope.DocInfo = function () {
        $http.get('/DocInfo')
            .success($scope.renderpatientModels);
    }
    //initialization of the DocInfo method active when page is loaded
    $scope.DocInfo();

    $scope.register = function (patientModel) {
        $http.post('/patientreg', patientModel)
        .success(function (response) {
            $scope.message = "Patient Registration Completed";
        });
    }
});