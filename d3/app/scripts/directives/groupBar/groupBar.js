angular.module('d3Components').directive('groupBar', function ($window, $timeout) {
  return {
    restrict: 'EA',
    scope: {
      data: '=',
      label: '@',
      onClick: '&'
    },
    link: function (scope, ele, attrs) {
      var renderTimeout;

      var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

      var x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.1);

      var x1 = d3.scale.ordinal();

      var y = d3.scale.linear()
        .range([height, 0]);

      var color = d3.scale.ordinal()
        .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);

      var xAxis = d3.svg.axis()
        .scale(x0)
        .orient('bottom');

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .tickFormat(d3.format('.2s'));

      var svg = d3.select(ele[0]).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

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

        console.log('Rendering grouped-bar...');
        svg.selectAll('*').remove();
        if (!data) {
          return;
        }

        // Data
        if (renderTimeout) {
          clearTimeout(renderTimeout);
        }

        renderTimeout = $timeout(function () {

          var legendNames = data[0].groupValues.map(function (d) {
            return d.name;
          });

          x0.domain(data.map(function (d) {
            return d.groupName;
          }));
          x1.domain(legendNames).rangeRoundBands([0, x0.rangeBand()]);
          y.domain([0, (legendNames.length * 9) + d3.max(data, function (d) {
            return d3.max(d.groupValues, function (d) {
              return +d.value;
            });
          })]);

          svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

          svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('Population');

          var state = svg.selectAll('.state')
            .data(data)
            .enter().append('g')
            .attr('class', 'g')
            .attr('transform', function (d) {
              return 'translate(' + x0(d.groupName) + ',0)';
            });

          state.selectAll('rect')
            .data(function (d) {
              return d.groupValues;
            })
            .enter().append('rect')
            .attr('width', x1.rangeBand())
            .attr('x', function (d) {
              return x1(d.name);
            })
            .attr('y', function (d) {
              return y(d.value);
            })
            .attr('height', function (d) {
              return height - y(d.value);
            })
            .style('fill', function (d) {
              return color(d.name);
            });

          var legend = svg.selectAll('.legend')
            .data(legendNames.slice().reverse())
            .enter().append('g')
            .attr('class', 'legend')
            .attr('transform', function (d, i) {
              return 'translate(0,' + i * 20 + ')';
            });

          legend.append('rect')
            .attr('x', width - 18)
            .attr('width', 18)
            .attr('height', 18)
            .style('fill', color);

          legend.append('text')
            .attr('x', width - 24)
            .attr('y', 9)
            .attr('dy', '.35em')
            .style('text-anchor', 'end')
            .text(function (d) {
              return d;
            });

        }, 200);
      };//render
    }
  };
});
