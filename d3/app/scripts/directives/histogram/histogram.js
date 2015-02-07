angular.module('d3Components').directive('histogram', function ($window, $timeout) {
  return {
    restrict: 'EA',
    scope: {
      data: '=',
      label: '@',
      onClick: '&'
    },
    link: function (scope, ele, attrs) {
      var renderTimeout;

      var margin = {top: 10, right: 30, bottom: 30, left: 30},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;


      var svg = d3.select(ele[0]).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
          // Formatters for counts and times (converting numbers to Dates).
          var formatCount = d3.format(",.0f");

          var xRange = [0, d3.max(data, function(d){ return Number(d.value) + 0.2;})];
          //var xRange = [0, d3.max(data, function(d){ return Number(d);})];

          var x = d3.scale.linear()
            .domain(xRange)
            .range([0, width]);

          var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");
          
          var buckets = x.ticks(20);
          var interval = (xRange[1] - xRange[0]) / buckets.length;

          console.log('Range: '   + xRange[0] + " - " + xRange[1] );
          console.log('Buckets: ' + buckets.length);
          console.log('Interval: '+ interval);
          console.log(buckets);
          var histData = [];
          for ( var i = 0 ; i < buckets.length ; i++){
            histData.push({'x' : buckets[i] , 'dx': interval , 'y' : 0});
          }

          for ( var i = 0 ; i < data.length; i++){
            var bucketIndex = Math.floor((Number(data[i].value) - xRange[0]) / interval);

            // Avoid overflow
            if ( bucketIndex === buckets.length){
              bucketIndex--;
            }

            histData[bucketIndex].y = histData[bucketIndex].y + data[i].count;
          }

          var y = d3.scale.linear()
            .domain([0, d3.max(histData, function(d) { return d.y; })])
            .range([height, 0]);

          var bar = svg.selectAll(".histogram-bar")
            .data(histData)
            .enter().append("g")
            .attr("class", "histogram-bar")
            .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

          bar.append("rect")
            .attr("x", 1)
            .attr("width", x(histData[0].dx) - 1)
            .attr("height", function(d) { return height - y(d.y); });

          bar.append("text")
            .attr("dy", ".75em")
            .attr("y", 6)
            .attr("x", x(histData[0].dx) / 2)
            .attr("text-anchor", "middle")
            .text(function(d) {
              var value = formatCount(d.y);
              if ( value === 0){
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
