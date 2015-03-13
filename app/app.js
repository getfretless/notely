'use strict';

// var apiKey = '$2a$10$Z96eCeXE/kPt/l1Yuvg5xuJr1MArnxV33yJ2z0hjBcVZZCiJtHwZa';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'myApp.notes',
  'myApp.login'
]).

config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/notes'});
}]).

directive('focusOn', function(){
  return function(scope, elem, attr) {
    scope.$on(attr.focusOn, function(){
      elem[0].focus();
    });
  };
}).

service('NotesBackend', ['$http', function($http){

  var notes = [];
  var notelyBasePath = 'https://elevennote-nov-2014.herokuapp.com/api/v1/';
  var apiKey = '';
  var self = this;

  this.getNotes = function() {
    return notes;
  };

  this.getApiKey = function() {
    return apiKey;
  };

  this.fetchNotes = function() {
    $http.get(notelyBasePath + 'notes.json?api_key=' + apiKey)
    .success(function(notes_data) {
      notes = notes_data;
    });
  };

  this.postNote = function(noteData, callback) {
    $http.post(notelyBasePath + 'notes', {
      api_key: apiKey,
      note: noteData
    }).success(function(newNoteData) {
      notes.push(newNoteData);
      callback(newNoteData);
    });
  };

  this.updateNote = function(note) {
    $http.put(notelyBasePath + 'notes/' + note.id, {
      api_key: apiKey,
      note: note
    }).success(function(response){
      // TODO: replace note in notes variable instead of full refresh
      self.fetchNotes();
    });
  };

  this.deleteNote = function(note, callback) {
    $http.delete(notelyBasePath + 'notes/' + note.id + '?api_key=' + apiKey).success(function(response) {
      self.fetchNotes();
      callback();
    });
  };

  this.fetchApiKey = function(user, callback) {
    $http.post(notelyBasePath + 'session', {
      user: user
    }).success(function(userData) {
      apiKey = userData.api_key;
      self.fetchNotes();
      callback(userData);
    });
  };

}]);
