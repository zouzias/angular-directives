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

    $scope.data = [{'name': 'hello wolrd', 'score': 10},
                    {'name': 'world', 'score': 15},
      {'name' : 'third item','score' : 3}];

    var myRand = function(){
      return Number(Math.random().toFixed(2));
    };

    $scope.scatter =  [ {'text': 'Greece', 'x': myRand(), 'y' : myRand()},
    {'text': 'Italy', 'x': myRand(), 'y' : myRand()},
    {'text': 'Greece', 'x': myRand(), 'y' : myRand()},
    {'text': 'Canada', 'x': myRand(), 'y' : myRand()},
    {'text': 'Greece', 'x': myRand(), 'y' : myRand()},
    {'text': 'Canada', 'x': myRand(), 'y' : myRand()},
    {'text': 'USA', 'x': myRand(), 'y' : myRand()},
    {'text': 'Croatia', 'x': myRand(), 'y' : myRand()}, ];

    $scope.d3OnClick = function (item) {
      console.log('Item is ' + item.name);
    };
  });
