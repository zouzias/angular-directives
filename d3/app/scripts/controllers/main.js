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

    $scope.words = ['Hello', 'world', 'normally', 'you', 'want', 'more', 'words', 'than', 'this', 'IBM', 'Greece'];

      $scope.pieBar = [
        {'label': '<5'   , 'value' : 2704659},
        {'label': '5-13' , 'value' : 4499890},
        {'label': '14-17', 'value' : 2159981},
        {'label': '18-24', 'value' : 3853788},
        {'label': '25-44', 'value' : 14106543},
        {'label': '45-64', 'value' : 8819342},
        {'label': '>65'  , 'value' : 1612463}];
    };




    $scope.d3OnClick = function (item) {
      console.log('Item is ' + item.name);
    };

    $scope.reload();
  });
