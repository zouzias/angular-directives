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

    $scope.data = [{"name": "hello wolrd", "score": 10},
                    {"name": "world", "score": 15},
      {'name' : 'third item','score' : 3}];

    $scope.d3OnClick = function (item) {
      console.log('Item is ' + item.name);
    };
  });
