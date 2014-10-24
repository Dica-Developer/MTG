'use strict';

/**
 * @ngdoc function
 * @name mtgApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the mtgApp
 */
angular.module('mtgApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
