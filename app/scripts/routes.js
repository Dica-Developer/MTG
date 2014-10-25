'use strict';

angular.module('mtgApp')
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider
      .otherwise('/');

    $stateProvider
      .state('card-explorer', {
        url: '/',
        templateUrl: '/templates/card-explorer.html',
        controller: 'CardExplorerController',
        resolve: {
          allCards: ['cards', function (cards) {
            return cards.fetchCards();
          }],
          setList: ['cards', function (cards) {
            return cards.fetchSetList();
          }]
        }
      });
  }]);
