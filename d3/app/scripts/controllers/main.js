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

     var myRand = function(){
      return Number(10 * Math.random().toFixed(2));
    };

    var randInteger = function(n){
      return Math.floor(Math.random() * (n + 1));
    };

    $scope.reload = function(){
      
          $scope.data = [{'name': 'hello wolrd', 'score': randInteger(10)},
                    {'name': 'world', 'score': randInteger(10)},
      {'name' : 'third item','score' : randInteger(10)}];

      $scope.scatter =  [ {'text': 'Greece', 'x': myRand(), 'y' : myRand()},
    {'text': 'Italy', 'x': myRand(), 'y' : myRand()},
    {'text': 'Greece', 'x': myRand(), 'y' : myRand()},
    {'text': 'Canada', 'x': myRand(), 'y' : myRand()},
    {'text': 'Greece', 'x': myRand(), 'y' : myRand()},
    {'text': 'Canada', 'x': myRand(), 'y' : myRand()},
    {'text': 'USA', 'x': myRand(), 'y' : myRand()},
    {'text': 'Croatia', 'x': myRand(), 'y' : myRand()}, ];


    $scope.heatmap = [];

    for ( var i = 1; i <= 7; i++){
      for ( var j = 1 ; j <= 24; j++){
        var o = { 'day' : i , 'hour': j, 'value' :  randInteger(10)};
        $scope.heatmap.push(o);
      }
    }

    };
   

    $scope.d3OnClick = function (item) {
      console.log('Item is ' + item.name);
    };

    $scope.reload();
  });
