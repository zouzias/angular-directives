'use strict';


// The bar chart directive is based on
// http://www.ng-newsletter.com/posts/d3-on-angular.html
angular.module('d3App').directive('d3Bar', function ($window, $timeout) {
    return {
        restrict: 'EA',
        scope: {
            data: '=',
            label: '@',
            onClick: '&'
        },
        link: function (scope, ele, attrs) {
            var renderTimeout;
            var margin = parseInt(attrs.margin) || 20,
                    barHeight = parseInt(attrs.barHeight) || 20,
                    barPadding = parseInt(attrs.barPadding) || 5;

            var svg = d3.select(ele[0])
                    .append('svg')
                    .style('width', '100%');

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

                console.log('Rendering d3bar...');
                svg.selectAll('*').remove();
                if (!data) {
                    return;
                }

                if (renderTimeout) {
                    clearTimeout(renderTimeout);
                }

                renderTimeout = $timeout(function () {
                    var width = d3.select(ele[0])[0][0].offsetWidth - margin,
                            height = scope.data.length * (barHeight + barPadding),
                            color = d3.scale.category20(),
                            xScale = d3.scale.linear()
                            .domain([0, d3.max(data, function (d) {
                                    return d.score;
                                })])
                            .range([0, width]);
                    svg.attr('height', height);
                    svg.selectAll('rect')
                            .data(data)
                            .enter()
                            .append('rect')
                            .on('click', function (d) {
                                return scope.onClick({item: d});
                            })
                            .attr('height', barHeight)
                            .attr('width', 140)
                            .attr('x', Math.round(margin / 2))
                            .attr('y', function (d, i) {
                                return i * (barHeight + barPadding);
                            })
                            .attr('fill', function (d) {
                                return color(d.score);
                            })
                            .transition()
                            .duration(1000)
                            .attr('width', function (d) {
                                return xScale(d.score);
                            });
                    svg.selectAll('text')
                            .data(data)
                            .enter()
                            .append('text')
                            .attr('fill', '#000')
                            .attr('y', function (d, i) {
                                return i * (barHeight + barPadding) + 15;
                            })
                            .attr('x', 15)
                            .text(function (d) {
                                return d.name + ' (' + d.score + ')';
                            });
                }, 200);
            };
        }};
});


angular.module('d3App').directive('scatter', function ($window, $timeout) {
    return {
        restrict: 'EA',
        scope: {
            data: '=',
            label: '@',
            onClick: '&'
        },
        link: function (scope, ele, attrs) {
            var renderTimeout;
            var barHeight = parseInt(attrs.barHeight) || 20,
                    barPadding = parseInt(attrs.barPadding) || 5;

            var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 900 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;


            // add the tooltip area to the webpage
            var tooltip = d3.select('body').append('div')
                    .attr('class', 'tooltip')
                    .style('opacity', 0);

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

                console.log('Rendering scatter...');
                svg.selectAll('*').remove();
                if (!data) {
                    return;
                }

                // Data
                if (renderTimeout) {
                    clearTimeout(renderTimeout);
                }

                renderTimeout = $timeout(function () {

                    /*
                     * value accessor - returns the value to encode for a given data object.
                     * scale - maps value to a visual display encoding, such as a pixel position.
                     * map function - maps from data value to display value
                     * axis - sets up axis
                     */

                    // setup x
                    var xValue = function (d) {
                        return d.x;
                    }, // data -> value
                            xScale = d3.scale.linear().range([0, width]), // value -> display
                            xMap = function (d) {
                                return xScale(xValue(d));
                            }, // data -> display
                            xAxis = d3.svg.axis().scale(xScale).orient('bottom');

                    // setup y
                    var yValue = function (d) {
                        return d.y;
                    }, // data -> value
                            yScale = d3.scale.linear().range([height, 0]), // value -> display
                            yMap = function (d) {
                                return yScale(yValue(d));
                            }, // data -> display
                            yAxis = d3.svg.axis().scale(yScale).orient('left');

                    // setup fill color
                    var cValue = function (d) {
                        return d.text;
                    },
                            color = d3.scale.category10();

                    svg.attr('width', width + margin.left + margin.right)
                            .attr('height', height + margin.top + margin.bottom)
                            .append('g')
                            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                    // don't want dots overlapping axis, so add in buffer to data domain
                    xScale.domain([d3.min(data, xValue) - 1, d3.max(data, xValue) + 1]);
                    yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]);

                    // x-axis
                    svg.append('g')
                            .attr('class', 'axis')
                            .attr('transform', 'translate(0,' + height + ')')
                            .call(xAxis)
                            .append('text')
                            .attr('class', 'label')
                            .attr('x', width)
                            .attr('y', -6)
                            .style('text-anchor', 'end')
                            .text('x-axis');

                    // y-axis
                    svg.append('g')
                            .attr('class', 'axis')
                            .attr('transform', 'translate(20,' + 0 + ')')
                            .call(yAxis)
                            .append('text')
                            .attr('class', 'label')
                            .attr('transform', 'rotate(-90)')
                            .attr('y', 6)
                            .attr('dy', '.71em')
                            .style('text-anchor', 'end')
                            .text('y-axis');

                    // draw dots
                    svg.selectAll('.dot')
                            .data(data)
                            .enter().append('circle')
                            .attr('class', 'dot')
                            .attr('r', 3.5)
                            .attr('cx', xMap)
                            .attr('cy', yMap)
                            .style('fill', function (d) {
                                return color(cValue(d));
                            })
                            .on('mouseover', function (d) {
                                tooltip.transition()
                                        .duration(200)
                                        .style('opacity', 0.9);
                                tooltip.html(d.text + '<br/> (' + xValue(d) + ', ' + yValue(d) + ')')
                                        .style('left', (d3.event.pageX + 5) + 'px')
                                        .style('top', (d3.event.pageY - 28) + 'px');
                            })
                            .on('mouseout', function (d) {
                                tooltip.transition()
                                        .duration(500)
                                        .style('opacity', 0);
                            });


                    // draw legend
                    var legend = svg.selectAll('.legend')
                            .data(color.domain())
                            .enter().append('g')
                            .attr('class', 'legend')
                            .attr('transform', function (d, i) {
                                return 'translate(0,' + i * 20 + ')';
                            });

                    // draw legend colored rectangles
                    legend.append('rect')
                            .attr('x', width - 18)
                            .attr('width', 18)
                            .attr('height', 18)
                            .style('fill', color);

                    // draw legend text
                    legend.append('text')
                            .attr('x', width - 24)
                            .attr('y', 9)
                            .attr('dy', '.35em')
                            .style('text-anchor', 'end')
                            .text(function (d) {
                                return d;
                            });

                }, 200);
            };
        }};
});


angular.module('d3App').directive('heatmap', function ($window, $timeout) {
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
                var margin = { top: 50, right: 0, bottom: 100, left: 30 },
                width = 960 - margin.left - margin.right,
                height = 430 - margin.top - margin.bottom,
                gridSize = Math.floor(width / 24),
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
                        .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
                        .range(colors);
                        var dayLabels = svg.selectAll('.dayLabel')
                        .data(days)
                        .enter().append('text')
                        .text(function (d) { return d; })
                        .attr('x', 0)
                        .attr('y', function (d, i) { return i * gridSize; })
                        .style('text-anchor', 'end')
                        .attr('transform', 'translate(-6,' + gridSize / 1.5 + ')')
                        .attr('class', function (d, i) { return ((i >= 0 && i <= 4) ? 'dayLabel mono axis axis-workweek' : 'dayLabel mono axis'); });
                        var timeLabels = svg.selectAll('.timeLabel')
                        .data(times)
                        .enter().append('text')
                        .text(function(d) { return d; })
                        .attr('x', function(d, i) { return i * gridSize; })
                        .attr('y', - 10)
                        .style('text-anchor', 'middle')
                        .attr('transform', 'translate(' + gridSize / 2 + ', -6)')
                        .attr('class', function(d, i) { return ((i >= 7 && i <= 16) ? 'timeLabel mono axis axis-worktime' : 'timeLabel mono axis'); });
                        var heatMap = svg.selectAll('.hour')
                        .data(data)
                        .enter().append('rect')
                        .attr('x', function(d) { return (d.hour - 1) * gridSize; })
                        .attr('y', function(d) { return (d.day - 1) * gridSize; })
                        .attr('rx', 4)
                        .attr('ry', 4)
                        .attr('class', 'hour bordered')
                        .attr('width', gridSize)
                        .attr('height', gridSize)
                        .style('fill', colors[0]);
                        heatMap.transition().duration(1000)
                        .style('fill', function(d) { return colorScale(d.value); });
                        heatMap.append('title').text(function(d) { return d.value; });
                        var legend = svg.selectAll('.legend')
                        .data([0].concat(colorScale.quantiles()), function(d) { return d; })
                        .enter().append('g')
                        .attr('class', 'legend');
                        legend.append('rect')
                        .attr('x', function(d, i) { return legendElementWidth * i; })
                        .attr('y', height)
                        .attr('width', legendElementWidth)
                        .attr('height', gridSize / 2)
                        .style('fill', function(d, i) { return colors[i]; });
                        legend.append('text')
                        .attr('class', 'mono')
                        .text(function(d) { return '≥ ' + Math.round(d); })
                        .attr('x', function(d, i) { return legendElementWidth * i; })
                        .attr('y', height + gridSize);
                }, 200);
                };
        }};



        });


angular.module('d3App').directive('wordCloud', function ($window, $timeout) {
return {
restrict: 'EA',
        scope: {
        data: '=',
                label: '@',
                onClick: '&'
        },
        link: function (scope, ele, attrs) {

        scope.draw = function(words){
                    var fill = d3.scale.category20();

                    svg.selectAll('text')
                        .data(words)
                        .enter().append('text')
                        .style('font-size', function(d) { return d.size + 'px'; })
                        .style('font-family', 'Impact')
                        .style('fill', function(d, i) { return fill(i); })
                        .attr('text-anchor', 'middle')
                        .attr('transform', function(d) {
                        return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
                                })
                        .text(function(d) { return d.text; });
                };
          var renderTimeout;

                //var margin = parseInt(attrs.margin) || 20,
                var barHeight = parseInt(attrs.barHeight) || 20,
                barPadding = parseInt(attrs.barPadding) || 5;

                var width  = 960,
                    height = 600;

                var svg = d3.select(ele[0]).append('svg')
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', 'translate('+ width / 2 + ',' + height / 2 + ')');

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

                  if (renderTimeout) {
                    clearTimeout(renderTimeout);
                  }

                  renderTimeout = $timeout(function () {
                    d3.layout.cloud().size([width, height])
                      .words(scope.data.map(function(d) {
                        return {text: d, size: 10 + Math.random() * 90};
                      }))
                      .padding(5)
                      .rotate(function() { return ~~(Math.random() * 2) * 90; })
                      .font('Impact')
                      .fontSize(function(d) { return d.size; })
                      .on('end', scope.draw)
                      .start();
                  }, 200);
                };//render
        }};
});



angular.module('d3App').directive('pieBar', function ($window, $timeout) {
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
        .value(function(d) { return d.value; });

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
            data.forEach(function(d) {
              d.value = + d.value;
            });

            var g = svg.selectAll('.arc')
              .data(pie(data))
              .enter().append('g')
              .attr('class', 'arc');

            g.append('path')
              .attr('d', arc)
              .style('fill', function(d) { return color(d.data.label); });

            g.append('text')
              .attr('transform', function(d) { return 'translate(' + arc.centroid(d) + ')'; })
              .attr('dy', '.35em')
              .style('text-anchor', 'middle')
              .text(function(d) { return d.data.label; });
          }, 200);

      };//render
    }};
});



angular.module('d3App').directive('groupBar', function ($window, $timeout) {
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

  var legendNames = data[0].groupValues.map(function(d){ return d.name;});

  x0.domain(data.map(function(d) { return d.groupName; }));
  x1.domain(legendNames).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, (legendNames.length * 9) + d3.max(data, function(d) { return d3.max(d.groupValues, function(d) { return +d.value; }); })]);

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
      .attr('transform', function(d) { return 'translate(' + x0(d.groupName) + ',0)'; });

  state.selectAll('rect')
      .data(function(d) { return d.groupValues; })
    .enter().append('rect')
      .attr('width', x1.rangeBand())
      .attr('x', function(d) { return x1(d.name); })
      .attr('y', function(d) { return y(d.value); })
      .attr('height', function(d) { return height - y(d.value); })
      .style('fill', function(d) { return color(d.name); });

  var legend = svg.selectAll('.legend')
      .data(legendNames.slice().reverse())
    .enter().append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) { return 'translate(0,' + i * 20 + ')'; });

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
      .text(function(d) { return d; });
            
          }, 200);

      };//render
    }};
});
