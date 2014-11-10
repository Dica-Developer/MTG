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
        var cardRarityAbbr = {
          'Common': 'c',
          'Uncommon': 'u',
          'Rare': 'r',
          'Mythic Rare': 'm',
          'Special': 's'
        };
        $scope.$watch('card', function (card) {
          if(card){
            $scope.setCode = card.setCode;
            if(_.contains(card.types, 'Land')){
              $scope.rarity = 'c';
            }
            if(cardRarityAbbr[card.rarity]){
              $scope.rarity = cardRarityAbbr[card.rarity];
            }
          }
        }, true);
      }]
    };
  });
