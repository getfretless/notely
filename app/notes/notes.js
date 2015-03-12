'use strict';

var notelyBasePath = 'https://elevennote-nov-2014.herokuapp.com/api/v1/';
var apiKey = '$2a$10$Z96eCeXE/kPt/l1Yuvg5xuJr1MArnxV33yJ2z0hjBcVZZCiJtHwZa';

angular.module('myApp.notes', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/notes', {
    templateUrl: 'notes/notes.html',
    controller: 'NotesController'
  });
}])

.controller('NotesController', ['$scope', 'NotesBackend', function($scope, NotesBackend) {

  NotesBackend.fetchNotes();

  $scope.notes = function() {
    return NotesBackend.getNotes();
  };

  $scope.commit = function() {
    NotesBackend.postNote({
      title: $scope.noteTitle,
      body_html: $scope.noteBody
    });
  };

}])

.service('NotesBackend', ['$http', function($http){

  var notes = [];

  this.getNotes = function() {
    return notes;
  };

  this.fetchNotes = function() {
    $http.get(notelyBasePath + 'notes.json?api_key=' + apiKey)
    .success(function(notes_data) {
      notes = notes_data;
    });
  };

  this.postNote = function(noteData) {
    $http.post(notelyBasePath + 'notes', {
      api_key: apiKey,
      note: noteData
    }).success(function(newNoteData) {
      notes.push(newNoteData);
    });
  }

}]);
