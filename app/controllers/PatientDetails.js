app.controller('PatientDetailsCtrl', function ($scope, $http) {
    //get the response from the server and send it to front end to display information
    $scope.renderpatientModels = function (response) {
        $scope.patientModels = response;
    };

    //get request to get dpctor names from doctor schema
    $scope.PatientInfo = function () {
        $http.get('/PatientInfo')
            .success($scope.renderpatientModels);
    }
    //initialization of the DocInfo method active when page is loaded
    $scope.PatientInfo();

    $scope.select = function (id) {
        $http.get('/patientModels/' + id)
        .success(function (response) {
            $scope.patientModel = response;
        });
    };

    //update selected patient record
    $scope.update = function () {
        $http.put('/patientModelsUpdate/' + $scope.patientModel._id, $scope.patientModel)
        .success(function (response) {
            $scope.PatientInfo();
            $scope.message = "Patient record updated";
            $scope.query = angular.copy($scope.master);
        });
    };

    //Remove selected patient record
    $scope.remove = function (patientModel) {
        $http.delete('/patientModelsRemove/' + patientModel._id)
        .success(function (response) {
            $scope.PatientInfo();
        });
    }
});