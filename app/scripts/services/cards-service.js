'use strict';

angular.module('mtgApp')
  .service('cards', ['$q', '$http', 'localStorageService', function ($q, $http) {
    var allCards = [],
      setList = [],
      cardsDb = TAFFY();

    window.cardsDb = cardsDb;

    function filter() {
      return cardsDb(arguments).get();
    }

    function fetchCards() {
      var defer = $q.defer();
      if (cardsDb().count() === 0) {
        $http.get('/data/ALL_SETS.json')
          .success(function (response) {

            _.each(response, function (mtgSet) {
              var cards = _.map(mtgSet.cards, function (card) {
                card.setCode = mtgSet.code;
                card.setName = mtgSet.name;
                return card;
              });
              allCards = allCards.concat(cards);
            });
            cardsDb.insert(allCards);
            defer.resolve(cardsDb().get());
            allCards = [];
          });
      } else {
        defer.resolve(cardsDb().get());
      }
      return defer.promise;
    }

    function fetchSetList() {
      var defer = $q.defer();
      $http.get('/data/SET_LIST.json')
        .success(function (response) {
          setList = response;
          defer.resolve(setList);
        });
      return defer.promise;
    }

    return {
      filter: filter,
      fetchCards: fetchCards,
      fetchSetList: fetchSetList
    };
  }]);
