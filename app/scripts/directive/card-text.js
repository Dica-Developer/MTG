'use strict';

angular.module('mtgApp')
  .directive('cardText', ['$compile', 'SYMBOLS_REGEX_WITH_BRACES', function ($compile, SYMBOLS_REGEX_WITH_BRACES) {
    return {
      restrict: 'E',
      template: '<p></p>',
      replace: true,
      scope: {
        'text': '@'
      },
      link: function (scope, element) {

        scope.$watch('text', function(){
          element.empty();

          var newText = scope.text.replace(SYMBOLS_REGEX_WITH_BRACES, function(match){
            return '<mana-cost x-mana-cost="'+ match +'" x-size="16"></mana-cost>';
          });
          element.append(newText);
          $compile(element.contents())(scope);
        });
      }
    };
  }]);
