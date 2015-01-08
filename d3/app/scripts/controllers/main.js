'use strict';

/**
 * @ngdoc function
 * @name d3App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the d3App
 */
angular.module('d3App')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
