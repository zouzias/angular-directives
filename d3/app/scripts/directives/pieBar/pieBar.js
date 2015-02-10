
angular.module('d3Components').directive('pieBar', function ($window, $timeout) {
  return {
    restrict: 'EA',
    scope: {
      data: '=',
      label: '@',
      onClick: '&'
    },
    templateUrl: 'scripts/directives/pieBar/pieBar.html',
    link: function (scope, ele, attrs) {
      var renderTimeout;

      var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
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

      // Format numbers with 'comma'
      var formatCount = d3.format(",.0f");

      // Tooltip
      // add the tooltip area to the webpage
      var tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

      var svg = d3.select("#d3-pie-bar").append('svg')
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

        console.log('Rendering pie-bar...');
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

          var g = svg.selectAll('.pie-arc')
            .data(pie(data))
            .enter().append('g')
            .attr('class', 'arc');

          g.append('path')
            .attr('d', arc)
            .style('fill', function (d) {
              return color(d.data.label);
            })
            .on('mouseover', function (d) {
              tooltip.transition()
                .duration(200)
                .style('opacity', 0.9);
              tooltip.html('Label:<strong>'+ d.data.label + '</strong><br/>Count:(' + formatCount(d.data.value) + ')' + '<br/>')
                .style('left', (d3.event.pageX + 5) + 'px')
                .style('top', (d3.event.pageY - 28) + 'px');
            })
            .on('mouseout', function (d) {
              tooltip.transition()
                .duration(500)
                .style('opacity', 0);
            });


          var legend = svg.selectAll('.legend')
            .data(data)
            .enter().append('g')
            .attr('class', 'legend')
            .attr('transform', function (d, i) {
              return 'translate(0,' + i * 20 + ')';
            });

          legend.append('rect')
            .attr('x', width / 2.3 - 18)
            .attr('width', 18)
            .attr('height', 18)
            .style('fill', function (d) {
              return color(d.label);
            });

          legend.append('text')
            .attr('x', width / 2.3 - 24)
            .attr('y', 9)
            .attr('dy', '.35em')
            .style('text-anchor', 'end')
            .text(function (d) {
              return d.label + ' (' + formatCount(d.value) + ')';
            });


        }, 200);

      };//render
    }
  };
});
