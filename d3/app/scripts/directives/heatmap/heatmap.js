angular.module('d3Components').directive('heatmap', function ($window, $timeout) {
  return {
    restrict: 'EA',
    scope: {
      data: '=',
      label: '@',
      onClick: '&'
    },
    link: function (scope, ele, attrs) {
      var renderTimeout;
      //var margin = parseInt(attrs.margin) || 20,

      var barHeight = parseInt(attrs.barHeight) || 20,
        barPadding = parseInt(attrs.barPadding) || 5;

      var width = parseInt(attrs.width) || 960;
      var height = parseInt(attrs.height) || 400;

      var margin = {top: 50, right: 0, bottom: 100, left: 30};

      width = width - margin.left - margin.right;
      height = height - margin.top - margin.bottom;

      var gridSize = Math.floor(width / 24),
        legendElementWidth = gridSize * 2,
        buckets = 9,
        colors = ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58'], // alternatively colorbrewer.YlGnBu[9]
        days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        times = ['1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12a', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p', '12p'];
      var svg = d3.select(ele[0])
        .append('svg').attr('width', width + margin.left + margin.right)
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

        // add the tooltip area to the webpage
        var tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('opacity', 0);

        console.log('Rendering heatmap...');
        svg.selectAll('*').remove();
        if (!data) {
          return;
        }

        // Data
        if (renderTimeout) {
          clearTimeout(renderTimeout);
        }

        renderTimeout = $timeout(function () {

          var colorScale = d3.scale.quantile()
            .domain([0, buckets - 1, d3.max(data, function (d) {
              return d.value;
            })])
            .range(colors);

          var dayLabels = svg.selectAll('.dayLabel')
            .data(days)
            .enter().append('text')
            .text(function (d) {
              return d;
            })
            .attr('x', 0)
            .attr('y', function (d, i) {
              return i * gridSize;
            })
            .style('text-anchor', 'end')
            .attr('transform', 'translate(-6,' + gridSize / 1.5 + ')')
            .attr('class', function (d, i) {
              return ((i >= 0 && i <= 4) ? 'dayLabel mono axis axis-workweek' : 'dayLabel mono axis');
            });

          var timeLabels = svg.selectAll('.timeLabel')
            .data(times)
            .enter().append('text')
            .text(function (d) {
              return d;
            })
            .attr('x', function (d, i) {
              return i * gridSize;
            })
            .attr('y', -10)
            .style('text-anchor', 'middle')
            .attr('transform', 'translate(' + gridSize / 2 + ', -6)')
            .attr('class', function (d, i) {
              return ((i >= 7 && i <= 16) ? 'timeLabel mono axis axis-worktime' : 'timeLabel mono axis');
            });

          var heatMap = svg.selectAll('.hour')
            .data(data)
            .enter().append('rect')
            .attr('x', function (d) {
              return (d.hour - 1) * gridSize;
            })
            .attr('y', function (d) {
              return (d.day - 1) * gridSize;
            })
            .attr('rx', 4)
            .attr('ry', 4)
            .attr('class', 'hour bordered')
            .attr('width', gridSize)
            .attr('height', gridSize)
            .style('fill', colors[0])
            .on('mouseover', function (d) {
              tooltip.transition()
                .duration(200)
                .style('opacity', 0.9);
              tooltip.html('Value: ' + d.value + '<br/> ' + days[d.day - 1] + ', ' + times[d.hour - 1] + 'm')
                .style('left', (d3.event.pageX + 5) + 'px')
                .style('top', (d3.event.pageY - 28) + 'px');
            })
            .on('mouseout', function (d) {
              tooltip.transition()
                .duration(500)
                .style('opacity', 0);
            });

          heatMap.transition().duration(1000)
            .style('fill', function (d) {
              return colorScale(d.value);
            });
          heatMap.append('title').text(function (d) {
            return d.value;
          });
          var legend = svg.selectAll('.legend')
            .data([0].concat(colorScale.quantiles()), function (d) {
              return d;
            })
            .enter().append('g')
            .attr('class', 'legend');
          legend.append('rect')
            .attr('x', function (d, i) {
              return legendElementWidth * i;
            })
            .attr('y', height)
            .attr('width', legendElementWidth)
            .attr('height', gridSize / 2)
            .style('fill', function (d, i) {
              return colors[i];
            });
          legend.append('text')
            .attr('class', 'mono')
            .text(function (d) {
              return '≥ ' + Math.round(d);
            })
            .attr('x', function (d, i) {
              return legendElementWidth * i;
            })
            .attr('y', height + gridSize);
        }, 200);
      };
    }
  };
});
