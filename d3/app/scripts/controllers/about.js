'use strict';

/**
 * @ngdoc function
 * @name d3App.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the d3App
 */
angular.module('d3Components')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
