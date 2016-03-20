'use strict';

angular.module('mtgApp')
  .directive('cardSetSymbol', function () {

    return {
      restrict: 'E',
      templateUrl: '/templates/set-symbol.html',
      replace: true,
      scope: {
        'card': '=',
        'size': '@',
        'tipText': '@',
        'tipAppearance': '@'
      },
      controller: ['$scope', function ($scope) {
        $scope.$watch('card', function (card) {
          if(card){
            $scope.setCode = card.setCode;
            $scope.rarity = card.rarity ? card.rarity.toLowerCase() : 'common';
            if(_.includes(card.types, 'Land')){
              $scope.rarity = 'common';
            }
          }
        }, true);
      }]
    };
  });
