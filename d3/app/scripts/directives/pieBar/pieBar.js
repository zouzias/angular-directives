
angular.module('d3Components').directive('pieBar', function ($window, $timeout) {
  return {
    restrict: 'EA',
    scope: {
      data: '=',
      label: '@',
      onClick: '&'
    },
    link: function (scope, ele, attrs) {
      var renderTimeout;

      var width = 960,
        height = 500,
        radius = Math.min(width, height) / 2;

      var color = d3.scale.ordinal()
        .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);

      var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

      var pie = d3.layout.pie()
        .sort(null)
        .value(function (d) {
          return d.value;
        });

      var svg = d3.select(ele[0]).append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

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

        console.log('Rendering word-cloud...');
        svg.selectAll('*').remove();
        if (!data) {
          return;
        }

        // Data
        if (renderTimeout) {
          clearTimeout(renderTimeout);
        }

        renderTimeout = $timeout(function () {

          // Aggregate value
          data.forEach(function (d) {
            d.value = +d.value;
          });

          var g = svg.selectAll('.arc')
            .data(pie(data))
            .enter().append('g')
            .attr('class', 'arc');

          g.append('path')
            .attr('d', arc)
            .style('fill', function (d) {
              return color(d.data.label);
            });

          g.append('text')
            .attr('transform', function (d) {
              return 'translate(' + arc.centroid(d) + ')';
            })
            .attr('dy', '.35em')
            .style('text-anchor', 'middle')
            .text(function (d) {
              return d.data.label;
            });
        }, 200);

      };//render
    }
  };
});
