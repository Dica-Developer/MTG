'use strict';

angular.module('mtgApp')
  .service('cards', ['$q', 'data', function ($q, data) {
    var setList = [],
      cardsDb = TAFFY();

    window.cardsDb = cardsDb;

    function filter(search) {
      return cardsDb(search).get();
    }

    function limitFilter(searchQuery, limit) {
      return cardsDb(searchQuery).limit(limit).get();
    }

    function prepareDataBase() {
      var defer = $q.defer(),
        allCards = null;
      if (cardsDb().count() === 0) {
        _.each(data.getCardData(), function (mtgSet) {
          var cards = _.map(mtgSet.cards, function (card) {
            card.setCode = mtgSet.code;
            card.setName = mtgSet.name;
            card.foreignNames = card.foreignNames || [];
            card.foreignNames.push({name: card.name});
            card.concatNames = _.pluck(card.foreignNames, 'name').join(' ° ');
            return card;
          });
          allCards = !allCards ? cards : allCards.concat(cards);
        });
        defer.notify('Fill database with ' + allCards.length + ' cards.');
        cardsDb.insert(allCards);
        defer.notify('Presort database by card name.');
        cardsDb.sort('name');
        defer.resolve();
        allCards = null;
      } else {
        defer.resolve();
      }
      return defer.promise;
    }

    function getSetList() {
      if(!setList){
        setList = data.getSetList();
      }
      return setList;
    }

    return {
      db: cardsDb,
      filter: filter,
      limitFilter: limitFilter,
      prepareDataBase: prepareDataBase,
      getSetList: getSetList
    };
  }]);
