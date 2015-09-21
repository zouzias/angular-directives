/**
 *  Histogram
 *
 *  Input data object: { 'max' : max_value, 'min' : min_value,
 *  'buckets': [{'x' : left side value, 'interval', 'count': num_of_points},...]}
 *
*/
angular.module('d3Components').directive('histogram', function ($window, $timeout) {
  return {
    restrict: 'EA',
    scope: {
      data: '=',
      label: '@',
      onClick: '&'
    },
    templateUrl: 'views/d3-histogram.html',
    link: function (scope, ele, attrs) {
      var renderTimeout;

      var margin = {top: 10, right: 30, bottom: 30, left: 30},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;


      var svg = d3.select("#d3-histogram").append("svg");

      $window.onresize = function () {
        scope.$apply();
      };

      scope.$watch(function () {
        return angular.element($window)[0].innerWidth;
      }, function () {
        scope.render(scope.data);
      });

      scope.$watch('data', function (newData) {
        scope.render(newData);
      }, true);


      scope.render = function (data) {

        console.log('Rendering histogram...');
        svg.selectAll('*').remove();
        if (!data) {
          return;
        }

        // Data
        if (renderTimeout) {
          clearTimeout(renderTimeout);
        }

        renderTimeout = $timeout(function () {


          // Get parent elmenets width and subtract fixed width
          width = angular.element($window)[0].innerWidth * ( 8 / 12) - margin.left - margin.right;

          svg.attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


          // Formatters for counts and times (converting numbers to Dates).
          var formatCount = d3.format(",.0f");

          var xRange = [data.min, data.max];

          var x = d3.scale.linear()
            .domain(xRange)
            .range([0, width]);

          var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");


          console.log('Range: '   + data.min + " - " + data.max);
          console.log('Buckets: ' + data.buckets.length);

          var y = d3.scale.linear()
            .domain([0, d3.max(data.buckets, function(d) { return d.count; })])
            .range([height, 0]);

          var bar = svg.selectAll(".histogram-bar")
            .data(data.buckets)
            .enter().append("g")
            .attr("class", "histogram-bar")
            .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.count) + ")"; });

          bar.append("rect")
            .attr("x", 1)
            .attr("width", function(d){return x(d.interval) -1;})
            .attr("height", function(d) { return height - y(d.count); });

          bar.append("text")
            .attr("dy", ".75em")
            .attr("y", 6)
            .attr("x", function(d){return x(d.interval) / 2;})
            .attr("text-anchor", "middle")
            .text(function(d) {
              var value = formatCount(d.count);
              if ( value == 0){
                return "";
              }
              else{
                return value;
              }
            });

          svg.append("g")
            .attr("class", "x histogram-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);


        }, 200);
      };//render
    }
  };
});
