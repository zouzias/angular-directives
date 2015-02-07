angular.module('d3Components').directive('qqPlot', function ($window, $timeout) {
  return {
    restrict: 'EA',
    scope: {
      data: '=',
      label: '@',
      onClick: '&'
    },
    link: function (scope, ele, attrs) {
      var renderTimeout;

      var width = 270,
        height = 270,
        margin = {top: 20, right: 20, bottom: 20, left: 35};

      function randomize(d) {
        d.y = d3.range(n).map(Math.random);
        return d;
      }

      // Sample from a normal distribution with mean 0, stddev 1.
      function normal() {
        var x = 0, y = 0, rds, c;
        do {
          x = Math.random() * 2 - 1;
          y = Math.random() * 2 - 1;
          rds = x * x + y * y;
        } while (rds == 0 || rds > 1);
        c = Math.sqrt(-2 * Math.log(rds) / rds); // Box-Muller transform
        return x * c; // throw away extra sample y * c
      }

      // Simple 1D Gaussian (normal) distribution
      function normal1(mean, deviation) {
        return function () {
          return mean + deviation * normal();
        };
      }

      // Gaussian Mixture Model (k=3) fit using E-M algorithm
      function normal3(dd) {
        return function () {
          var r = Math.random(),
            i = r < dd[0][2] ? 0 : r < dd[0][2] + dd[1][2] ? 1 : 2,
            d = dd[i];
          return d[0] + Math.sqrt(d[1]) * normal();
        }
      }

      // Welford's algorithm.
      function mean(x) {
        var n = x.length;
        if (n === 0) return NaN;
        var m = 0,
          i = -1;
        while (++i < n) m += (x[i] - m) / (i + 1);
        return m;
      }

      // Unbiased estimate of a sample's variance.
      // Also known as the sample variance, where the denominator is n - 1.
      function variance(x) {
        var n = x.length;
        if (n < 1) return NaN;
        if (n === 1) return 0;
        var m = mean(x),
          i = -1,
          s = 0;
        while (++i < n) {
          var v = x[i] - m;
          s += v * v;
        }
        return s / (n - 1);
      }

      var chart = d3.qq()
        .width(width)
        .height(height)
        .domain([-.1, 1.1])
        .tickFormat(function (d) {
          return ~~(d * 100);
        });

      var svg = d3.select(ele[0]).append("svg")
        .attr("width", (width + margin.right + margin.left) * 3)
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

        svg.selectAll('*').remove();
        if (!data) {
          return;
        }

        if (renderTimeout) {
          clearTimeout(renderTimeout);
        }

        renderTimeout = $timeout(function () {
          console.log('Rendering qq-plot...');

          var n = data.length;

          svg.append("svg")
            .attr("width", (width + margin.right + margin.left) * 3)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          var tm = mean(data),
            td = Math.sqrt(variance(data)),
            dd = [
              [0.10306430789206111, 0.0036139086950272735, 0.30498647327844536],
              [0.5924252668569606, 0.0462763685758622, 0.4340870312025223],
              [0.9847627827855167, 2.352350767874714e-4, 0.2609264955190324]
            ];

          // There is problem with .data the first object is ignored!!!
          var g = svg.selectAll("g")
            .data([{}, {
              x: d3.range(n).map(Math.random),
              y: data,
              label: "Uniform Distribution"
            }, {
              x: d3.range(n).map(normal1(tm, td)),
              y: data,
              label: "Gaussian (Normal) Distribution"
            }, {
              x: d3.range(n).map(normal3(dd)),
              y: data,
              label: "Mixture of 3 Gaussians"
            }])
            .enter().append("g")
            .attr("class", "qq")
            .attr("transform", function (d, i) {
              return "translate(" + ((width + margin.right + margin.left) * (i - 1) )+ ")";
            });

          g.append("rect")
            .attr("class", "box")
            .attr("width", width)
            .attr("height", height);


          g.append("text")
            .attr("dy", "1.3em")
            .attr("dx", ".6em")
            .text(function (d) {
              return d.label;
            });

          g.call(chart);

          chart.duration(1000);

          $window.transition = function () {
            g.datum(randomize).call(chart);
          };

        }, 200);

      };//render
    }
  };
});

