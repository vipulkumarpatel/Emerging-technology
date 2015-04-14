app.controller('PatientVisitCtrl', function ($scope, $http) {
    
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


    //Submit patient visits information
    $scope.submit = function (visit) {
        console.log(visit);
        $http.post('/patientVists', visit)
        .success(function (response) {
            if (response === undefined) {
                $scope.message = "Patient's visted information not submitted";
            } else {
                $scope.message = "Patient's visted information submitted";
            }
        });
    }
});