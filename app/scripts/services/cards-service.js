'use strict';

angular.module('mtgApp')
  .service('cards', ['$q', '$http', function cardsService($q, $http) {
    var allCards = [],
      setList = [],
      cardsDb = TAFFY();

    window.cardsDb = cardsDb;

    function filter(search) {
      return cardsDb(search).get();
    }

    function limitFilter(searchQuery, limit) {
      return cardsDb(searchQuery).limit(limit).get();
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
                card.concatNames = card.name;
                if (card.foreignNames) {
                  card.concatNames += ' ° ' + _.pluck(card.foreignNames, 'name').join(' ° ');
                }
                return card;
              });
              allCards = allCards.concat(cards);
            });
            cardsDb.insert(allCards);
            cardsDb.sort('name');
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
      if(setList.length === 0){
        $http.get('/data/SET_LIST.json')
          .success(function (response) {
            setList = _.sortBy(response, function(cardSet){
              return new Date(cardSet.releaseDate);
            });
            defer.resolve(setList);
          });
      } else {
        defer.resolve(setList);
      }
      return defer.promise;
    }

    return {
      db: cardsDb,
      filter: filter,
      limitFilter: limitFilter,
      fetchCards: fetchCards,
      fetchSetList: fetchSetList
    };
  }]);
