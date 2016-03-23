'use strict';

angular.module('mtgApp')
  .service('ownCards', ['localStorageService', function (localStorageService) {
    var storedCards = localStorageService.get('cards') || [];
    var ownCardsDb = TAFFY(storedCards);

    function storeDb() {
      localStorageService.set('cards', ownCardsDb().stringify());
    }

    ownCardsDb.settings({
      onUpdate: _.debounce(storeDb, 1000),
      onInsert: _.debounce(storeDb, 1000),
      onRemove: _.debounce(storeDb, 1000)
    });

    function getAll() {
      return ownCardsDb().get();
    }

    function getById(id) {
      return ownCardsDb({id: id}).get()[0];
    }

    function getCountOf(id) {
      var card = getById(id);
      return card ? card.count : 0;
    }

    function addCard(id) {
      var card = getById(id);
      if (card) {
        var count = card.count + 1;
        ownCardsDb({id: id}).update({count: count});
      } else {
        ownCardsDb.insert({
          id: id,
          count: 1
        });
      }
    }

    function removeCard(id) {
      var card = getById(id);
      if (card) {
        var count = card.count - 1;
        if (count > 0) {
          ownCardsDb({id: id}).update({count: count});
        } else {
          ownCardsDb({id: id}).remove();
        }
      }
    }

    function importData(cardData) {
      ownCardsDb.insert(cardData);
      storeDb();
    }

    return {
      getAll: getAll,
      getById: getById,
      getCountOf: getCountOf,
      addCard: addCard,
      removeCard: removeCard,
      importData: importData
    };
  }]);
