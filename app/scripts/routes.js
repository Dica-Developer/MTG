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
      })
      .state('own-cards', {
        url: '/own-cards',
        templateUrl: '/templates/own-cards.html',
        controller: 'OwnCardsController',
        resolve: {
          allCards: ['cards', function (cards) {
            return cards.fetchCards();
          }],
          setList: ['cards', function (cards) {
            return cards.fetchSetList();
          }]
        }
      })
      .state('deck-list', {
        url: '/deck-list',
        templateUrl: '/templates/deck-list.html',
        controller: 'DeckListController',
        resolve: {
          allCards: ['cards', function (cards) {
            return cards.fetchCards();
          }],
          setList: ['cards', function (cards) {
            return cards.fetchSetList();
          }]
        }
      })
      .state('deck-builder', {
        url: '/deck-builder/:deckId',
        templateUrl: '/templates/deck-builder.html',
        controller: 'DeckBuilderController',
        resolve: {
          allCards: ['cards', function (cards) {
            return cards.fetchCards();
          }],
          setList: ['cards', function (cards) {
            return cards.fetchSetList();
          }]
        }
      })
      .state('databases', {
        url: '/databases',
        templateUrl: '/templates/databases.html',
        controller: 'DatabasesController'
      });
  }]);
