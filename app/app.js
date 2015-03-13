'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngCookies',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'myApp.notes',
  'myApp.login'
]).

config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/login'});
}]).

directive('focusOn', function(){
  return function(scope, elem, attr) {
    scope.$on(attr.focusOn, function(){
      elem[0].focus();
    });
  };
}).

service('NotesBackend', ['$http', '$cookies', function($http, $cookies){

  var notes = [];
  var notelyBasePath = 'https://elevennote-nov-2014.herokuapp.com/api/v1/';
  var apiKey = $cookies.apiKey || '';
  var user = $cookies.user ? JSON.parse($cookies.user) : {};
  var self = this;

  this.getNotes = function() {
    return notes;
  };

  this.getApiKey = function() {
    return apiKey;
  };

  this.getUser = function() {
    return user;
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

  this.deleteCookie = function() {
    delete $cookies.user;
    delete $cookies.apiKey;
    user = {};
    apiKey = '';
    notes = [];
  };

  this.fetchApiKey = function(user, callback) {
    $http.post(notelyBasePath + 'session', {
      user: user
    }).success(function(userData) {
      apiKey = userData.api_key;
      $cookies.apiKey = apiKey;
      $cookies.user = JSON.stringify(userData);
      self.fetchNotes();
      callback(userData);
    });
  };

}]);
