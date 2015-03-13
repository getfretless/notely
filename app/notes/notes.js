'use strict';

angular.module('myApp.notes', ['ngRoute', 'textAngular'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/notes', {
    templateUrl: 'notes/notes.html',
    controller: 'NotesController'
  });
}])

.controller('NotesController', ['$scope', '$location', 'NotesBackend', function($scope, $location, NotesBackend) {

  NotesBackend.fetchNotes();

  $scope.notes = function() {
    return NotesBackend.getNotes();
  };

  $scope.user = function() {
    return NotesBackend.getUser();
  }

  $scope.hasNotes = function() {
    return $scope.notes().length > 0;
  };

  $scope.buttonText = function(note) {
    return (note && note.id) ? 'Update Note' : 'Create Note';
  };

  $scope.logout = function() {
    NotesBackend.deleteCookie();
    $location.path('login');
  };

  $scope.saveNote = function() {
    if ($scope.note.id) {
      NotesBackend.updateNote($scope.note);
    }
    else {
      NotesBackend.postNote($scope.note, function(newNote) {
        $scope.note = JSON.parse(JSON.stringify(newNote));
      });
    }
  };

  $scope.loadNote = function(note) {
    $scope.note = JSON.parse(JSON.stringify(note));
  };

  $scope.findNoteById = function(noteId) {
    var notes = $scope.notes();
    for (var i=0; i < notes.length; i++) {
      if (notes[i].id === noteId) {
        return notes[i];
      }
    }
  };

  $scope.clearNote = function() {
    $scope.note = {};
    // These do the same thing, but the broadcast listener in the
    // focusOn directive provides a cleaner separation of code from HTML
    // document.getElementById('note_title').focus();
    $scope.$broadcast('noteCleared');
  };

  $scope.deleteNote = function(note) {
    NotesBackend.deleteNote(note, function() {
      $scope.clearNote();
    });
  };

}]);
