'use strict';

angular.module('asbuiltsApp')
  .directive('pdfCarousel', function () {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        docs: "="
      },
      templateUrl: 'views/pdf-carousel.html',
      link: function (scope, element, attr) {
          // scope.docs = docs;
          scope.$watchCollection('docs', function(){
            console.log(scope.docs);
          });
      }
    }
});
