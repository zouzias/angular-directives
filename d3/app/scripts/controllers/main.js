'use strict';

/**
 * @ngdoc function
 * @name d3App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the d3App
 */
angular.module('d3Components')
  .controller('MainCtrl', function ($scope) {

    var myRand = function () {
      return Number(10 * Math.random().toFixed(2));
    };

    var randInteger = function (n) {
      return Math.floor(Math.random() * (n + 1));
    };

    $scope.reload = function () {

      $scope.data = [{'name': 'hello wolrd', 'score': randInteger(10)},
        {'name': 'world', 'score': randInteger(10)},
        {'name': 'third item', 'score': randInteger(10)}];

      $scope.scatter = [{'text': 'Greece', 'x': myRand(), 'y': myRand()},
        {'text': 'Italy', 'x': myRand(), 'y': myRand()},
        {'text': 'Greece', 'x': myRand(), 'y': myRand()},
        {'text': 'Canada', 'x': myRand(), 'y': myRand()},
        {'text': 'Greece', 'x': myRand(), 'y': myRand()},
        {'text': 'Canada', 'x': myRand(), 'y': myRand()},
        {'text': 'USA', 'x': myRand(), 'y': myRand()},
        {'text': 'Croatia', 'x': myRand(), 'y': myRand()},];


      $scope.heatmap = [];

      for (var i = 1; i <= 7; i++) {
        for (var j = 1; j <= 24; j++) {
          var o = {'day': i, 'hour': j, 'value': randInteger(10)};
          $scope.heatmap.push(o);
        }
      }

      $scope.words = ['Hello', 'world', 'normally', 'you', 'want', 'more', 'words', 'than', 'this', 'IBM', 'Greece'];

      $scope.pieBar = [
        {'label': '<5', 'value': 2704659},
        {'label': '5-13', 'value': 4499890},
        {'label': '14-17', 'value': 2159981},
        {'label': '18-24', 'value': 3853788},
        {'label': '25-44', 'value': 14106543},
        {'label': '45-64', 'value': 8819342},
        {'label': '>65', 'value': 1612463}];

      $scope.groupbar = [];

      $scope.groupNames = ['CA', 'TX', 'NY', 'FL', 'IL', 'PA'];

      for (var i = 0; i < $scope.groupNames.length; i++) {
        var o = [{'name': 'Under 5 Years', 'value': randInteger(100)},
          {'name': '5 to 13 Years', 'value': randInteger(100)},
          {'name': '14 to 17 Years', 'value': randInteger(100)},
          {'name': '18 to 24 Years', 'value': randInteger(100)},
          {'name': '25 to 44 Years', 'value': randInteger(100)},
          {'name': '45 to 64 Years', 'value': randInteger(100)},
          {'name': '65 Years and Over', 'value': randInteger(100)}];
        $scope.groupbar.push({'groupName': $scope.groupNames[i], 'groupValues': o});
      }


      $scope.timeSeries = [];
      var year = 2012;
      for (var month = 1; month < 12; month++) {
        for (var day = 1; day < 30; day++) {
          $scope.timeSeries.push({
            'date': new Date(year, month, day),
            'stock A': month + randInteger(10),
            'stock B': (2 * month) + randInteger(5),
            'stock C': (3 * month) + randInteger(1)
          });
        }
      }

      $scope.boxPlot = [];
      for (var j = 1; j <= 100; j++) {
        $scope.boxPlot.push({
          'Q1': randInteger(100),
          'Q2': 2 * randInteger(100),
          'Q3': 3 * randInteger(100),
          'Q4': 4 * randInteger(100)
        });
      }

      $scope.tuckers = [0.009259259,0.014285714,0.014285714,0.016666667,0.016666667,0.017857143,0.018518519,0.027777778,0.028571429,0.028571429,0.028571429,0.033333333,0.033333333,0.035714286,0.0375,0.041666667,0.041666667,0.041666667,0.041666667,0.042857143,0.042857143,0.042857143,0.05,0.055555556,0.069444444,0.083333333,0.083333333,0.083333333,0.083333333,0.083333333,0.083333333,0.085714286,0.1,0.1,0.101851852,0.104166667,0.111111111,0.111111111,0.114285714,0.114285714,0.116666667,0.12037037,0.125,0.125,0.128571429,0.133333333,0.138888889,0.141666667,0.142857143,0.142857143,0.15,0.152777778,0.158333333,0.166666667,0.171428571,0.183333333,0.185714286,0.185714286,0.1875,0.190140845,0.194444444,0.2,0.204545455,0.208333333,0.214285714,0.214285714,0.253521127,0.271428571,0.277777778,0.291666667,0.3,0.3,0.307017544,0.324074074,0.328571429,0.333333333,0.333333333,0.342857143,0.357142857,0.358333333,0.378787879,0.381355932,0.395833333,0.4,0.414285714,0.414285714,0.414285714,0.414285714,0.43,0.433333333,0.4375,0.445833333,0.450704225,0.453333333,0.458333333,0.466666667,0.476666667,0.494736842,0.5,0.516666667,0.533333333,0.55,0.557142857,0.56884058,0.569444444,0.571428571,0.585714286,0.61,0.622222222,0.657407407,0.666666667,0.678947368,0.685714286,0.685714286,0.69047619,0.7,0.7,0.7,0.711538462,0.763888889,0.771428571,0.788888889,0.8,0.8,0.808333333,0.824712644,0.828571429,0.836842105,0.839285714,0.839285714,0.84,0.842857143,0.842857143,0.842857143,0.85,0.859649123,0.869791667,0.871428571,0.871428571,0.892344498,0.914285714,0.928571429,0.933908046,0.953703704,0.973684211,0.975,0.981481481,0.983333333,0.985714286,0.985714286,0.985714286,0.985714286,0.985714286,0.985714286,0.985714286,0.985714286,0.985714286,0.985714286,0.985714286,0.985714286,0.985714286,0.985714286,0.987096774,0.990740741,0.991666667,0.992,0.994047619,0.996666667,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];


     var values = d3.range(20).map(d3.random.bates(10));

      $scope.histogram = [];
      for ( var i = 0; i < values.length; i++){
        $scope.histogram.push({"value" : values[i] , "count" : randInteger(10)});
      }

      //$scope.histogram = d3.range(20).map(d3.random.bates(10));
    };

    $scope.d3OnClick = function (item) {
      console.log('Item is ' + item.name);
    };

    $scope.reload();
  });
