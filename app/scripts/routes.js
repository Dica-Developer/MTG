'use strict';

angular.module('mtgApp')
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider
      .otherwise('/');

    $stateProvider
      .state('card-explorer', {
        url: '/',
        templateUrl: '/templates/card-explorer.html',
        controller: 'CardExplorerController'
      })
      .state('own-cards', {
        url: '/own-cards',
        templateUrl: '/templates/own-cards.html',
        controller: 'OwnCardsController'
      })
      .state('deck-list', {
        url: '/deck-list',
        templateUrl: '/templates/deck-list.html',
        controller: 'DeckListController'
      })
      .state('deck-builder', {
        url: '/deck-builder/:deckId',
        templateUrl: '/templates/deck-builder.html',
        controller: 'DeckBuilderController'
      })
      .state('databases', {
        url: '/databases',
        templateUrl: '/templates/databases.html',
        controller: 'DatabasesController'
      });
  }]);
