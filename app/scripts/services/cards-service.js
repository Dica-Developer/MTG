'use strict';

angular.module('mtgApp')
  .service('cards', ['$q', 'data', 'cardColor', function ($q, data, cardColor) {
    var cardsDb = TAFFY();

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
        data.getCardData().then(function (cardData) {
          _.each(cardData, function (mtgSet) {
            var cards = _.map(mtgSet.cards, function (card) {
              card.cardColor = cardColor.getColorBitsForDb(card.manaCost);
              card.setCode = mtgSet.code;
              card.setName = mtgSet.name;
              card.foreignNames = card.foreignNames || [];
              card.foreignNames.push({name: card.name});
              card.concatNames = _.map(card.foreignNames, 'name').join(' ° ');
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
        });
      } else {
        defer.resolve();
      }
      return defer.promise;
    }

    return {
      db: cardsDb,
      filter: filter,
      limitFilter: limitFilter,
      prepareDataBase: prepareDataBase
    };
  }]);
