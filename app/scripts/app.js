'use strict';

/**
 * @ngdoc overview
 * @name mtgApp
 * @description
 * # mtgApp
 *
 * Main module of the application.
 */
angular
  .module('mtgApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'ui.router',
    'ui.select',
    'LocalStorageModule'
  ])
  .config(function (localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix('mtg');
  })
  .service('cards', ['$q', '$http', 'localStorageService', function ($q, $http) {
    var allCards = [],
      setList = [],
      cardsDb = TAFFY();

    window.cardsDb = cardsDb;
    return {
      filter: function(){
        return cardsDb(arguments).get();
      },
      fetchCards: function () {
        var defer = $q.defer();
        $http.get('/data/ALL_SETS.json')
          .success(function (response) {

            _.each(response, function(mtgSet){
              var cards = _.map(mtgSet.cards, function(card){
                card.setCode = mtgSet.code;
                card.setName = mtgSet.name;
                return card;
              });
              allCards = allCards.concat(cards);
            });
            cardsDb.insert(allCards);
            defer.resolve(cardsDb().get());
          });
        return defer.promise;
      },
      fetchSetList: function () {
        var defer = $q.defer();
        $http.get('/data/SET_LIST.json')
          .success(function (response) {
            setList = response;
            defer.resolve(setList);
          });
        return defer.promise;
      }
    };
  });
