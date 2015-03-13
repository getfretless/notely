'use strict';

angular.module('myApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginController'
  });
}])

.controller('LoginController', ['$scope', '$location', '$window', 'NotesBackend', function($scope, $location, $window, NotesBackend) {

  $scope.user = {};

  $scope.submit = function() {
    NotesBackend.fetchUser($scope.user, function(user) {
      $location.path('notes');
      $window.location.reload();
      $scope.user = user;
    });
  };

}]);
