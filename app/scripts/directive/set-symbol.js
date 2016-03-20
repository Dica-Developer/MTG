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
          case 'V14':
            rarity = 'mythic';
            break;
          case 'VAN':
          case 'TSB':
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
