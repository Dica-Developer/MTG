'use strict';

angular.module('mtgApp')
  .directive('setSymbol', function () {
    return {
      restrict: 'E',
      template: '<img ng-src="http://mtgimage.com/symbol/set/{{setCode}}/{{rarity}}/{{size}}.png">',
      replace: true,
      scope: {
        'setCode': '@',
        'size': '@'
      },
      controller: ['$scope', function ($scope) {
        $scope.rarity = 'c';
        if($scope.setCode === 'TSB' || $scope.setCode === 'VAN'){
          $scope.rarity = 's';
        } else if($scope.setCode === 'V14') {
          $scope.rarity = 'm';
        }
      }]
    };
  });
