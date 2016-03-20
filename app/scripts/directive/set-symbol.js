'use strict';

angular.module('mtgApp')
  .directive('setSymbol', function () {

    return {
      restrict: 'E',
      templateUrl: '/templates/set-symbol.html',
      replace: true,
      scope: {
        'setCode': '@',
        'size': '@'
      },
      controller: ['$scope', function ($scope) {
        function update() {
          var rarity = '';
          switch ($scope.setCode) {
          case 'v14':
            rarity = 'mythic';
            break;
          case 'van':
          case 'tsb':
            rarity = 's';
            break;
          default :
            rarity = 'common';
            break;
          }
          $scope.rarity = rarity;
        }


        $scope.$watch('setCode', update);
      }]
    };
  });
