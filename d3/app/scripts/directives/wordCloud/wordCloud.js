angular.module('d3Components').directive('wordCloud', function ($window, $timeout) {
  return {
    restrict: 'EA',
    scope: {
      data: '=',
      label: '@',
      onClick: '&'
    },
    link: function (scope, ele, attrs) {

      scope.draw = function (words) {
        var fill = d3.scale.category20();

        svg.selectAll('text')
          .data(words)
          .enter().append('text')
          .style('font-size', function (d) {
            return d.size + 'px';
          })
          .style('font-family', 'Impact')
          .style('fill', function (d, i) {
            return fill(i);
          })
          .attr('text-anchor', 'middle')
          .attr('transform', function (d) {
            return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
          })
          .text(function (d) {
            return d.text;
          });
      };
      var renderTimeout;

      //var margin = parseInt(attrs.margin) || 20,
      var barHeight = parseInt(attrs.barHeight) || 20,
        barPadding = parseInt(attrs.barPadding) || 5;

      var width = 960,
        height = 600;

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

        if (renderTimeout) {
          clearTimeout(renderTimeout);
        }

        renderTimeout = $timeout(function () {
          d3.layout.cloud().size([width, height])
            .words(scope.data.map(function (d) {
              return {text: d, size: 10 + Math.random() * 90};
            }))
            .padding(5)
            .rotate(function () {
              return ~~(Math.random() * 2) * 90;
            })
            .font('Impact')
            .fontSize(function (d) {
              return d.size;
            })
            .on('end', scope.draw)
            .start();
        }, 200);
      };//render
    }
  };
});
