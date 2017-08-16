var app = angular.module('demo', []);

app.controller('Main', function($scope, $http) {
  $scope.results = { "Name" : "example" };

  $scope.search = function() {
    if ($scope.input) {
      $http.get('/search/' + $scope.input).then(function(data) {
        console.log(data);
        $scope.results = data.data.hits;
      }).catch(function(err) {
        console.log("Error: " + err);
      });
    }
  };
});
