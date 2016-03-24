'use strict';

angular.module('mtgApp')
  .service('backup', ['cards', 'decks', 'ownCards', function (cards, decks, ownCards) {

    function isMigrationNeeded(data) {
      return _.isUndefined(data.version);
    }

    function tryToParseData(data) {
      var parsedData = false;
      try {
        parsedData = JSON.parse(data);
      } catch (err) {
        console.error('backup.tryToParseData: Cannot parse data');
      }

      return parsedData;
    }

    function updateCards(oldCards) {
      var dbCardsId = cards.db({'multiverseid': _.map(_.map(oldCards, 'multiverseid'), Number)}).select('id');
      return _.map(oldCards, function (card, index) {
        return {
          id: dbCardsId[index],
          count: card.count
        };
      });
    }

    function updateDecks(decks) {
      return _.each(decks, function (deck) {
        deck.cards = cards.db({'multiverseid': _.map(deck.cards, Number)}).select('id');

        if(deck.sideboard && deck.sideboard.length){
          deck.sideboard = cards.db({'multiverseid': _.map(deck.sideboard, Number)}).select('id');
        }
      });
    }

    function migrateData(data) {
      data.cards = data.cards || data.ownCards;
      if (data.cards.length && data.cards[0].multiverseid) {
        data.cards = updateCards(data.cards);
      }

      if (_.size(data.decks) > 0) {
        data.decks = updateDecks(data.decks);
      }

      return data;
    }

    function getImportData(rawData) {
      var data = tryToParseData(rawData);

      if (!data) {
        return false;
      }

      if (isMigrationNeeded(data)) {
        data = migrateData(data);
      }

      return data;
    }

    function importData(data) {
      if(data.decks){
        decks.importData(data.decks);
      }

      if(data.cards){
        ownCards.importData(data.cards);
      }
    }

    return {
      getImportData: getImportData,
      importData: importData
    }

  }]);
