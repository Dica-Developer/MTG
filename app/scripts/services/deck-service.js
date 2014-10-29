'use strict';

angular.module('mtgApp')
  .service('decks', ['localStorageService', 'cards', function (localStorageService, cards) {

    var generateUUID = function () {
      var d = new Date().getTime();
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
      });
    }, tmpDecks = {};

    function Deck(options) {
      this.options = {
        id: options.id || generateUUID(),
        name: options.name || '',
        colors: options.colors || [],
        cards: options.cards || []
      };
      this.cardsFull = [];
      this.updateFullCardInfo();
    }

    Deck.prototype.save = function () {
      var deckIds = localStorageService.get('decks') || [];
      if (!_.contains(deckIds, this.options.id)) {
        deckIds.push(this.options.id);
        localStorageService.set('decks', deckIds);
      }
      localStorageService.set('deck-' + this.options.id, this.options);
    };

    Deck.prototype.addCard = function (cardId) {
      this.options.cards.push(cardId);
      this.updateFullCardInfo();
    };

    Deck.prototype.dropCard = function (cardId) {
      var cardIndex = _.lastIndexOf(this.options.cards, cardId);
      this.options.cards.splice(cardIndex, 1);
      this.updateFullCardInfo();
    };

    Deck.prototype.dropAll = function (cardId) {
      this.options.cards = _.without(this.options.cards, cardId);
      this.updateFullCardInfo();
    };

    Deck.prototype.setName = function (name) {
      this.options.name = name;
    };

    Deck.prototype.setType = function (type) {
      this.options.type = type;
    };

    Deck.prototype.getColors = function () {
      return this.options.colors;
    };

    Deck.prototype.remove = function () {

    };

    Deck.prototype.getCards = function () {
      return this.options.cards;
    };

    Deck.prototype.getFullCards = function () {
      return this.cardsFull;
    };

    Deck.prototype.getManaCurve = function () {
      return _.countBy(this.cardsFull, 'cmc');
    };

    Deck.prototype.getShuffleSeven = function () {
      return _.sample(this.getFullCards(), 7);
    };

    Deck.prototype.getCountOf = function (cardId) {
      return this.options.cards.filter(function (card) {
        return card === cardId;
      }).length;
    };

    Deck.prototype.getCardCount = function () {
      return this.options.cards.length;
    };

    Deck.prototype.hasCard = function (cardId) {
      return _.contains(this.options.cards, cardId);
    };

    Deck.prototype.getCountByCardType = function () {
      var types = {},
        _this = this;
      this.cardsFull.forEach(function (card) {
        if (!types[card.types.join('-')]) {
          types[card.types.join('-')] = 0;
        }
        types[card.types.join('-')] = types[card.types.join('-')] + _this.getCountOf(card.multiverseid);
      });
      return types;
    };

    Deck.prototype.updateFullCardInfo = function () {
      this.cardsFull = cards.filter({multiverseid: _.uniq(this.options.cards)});
    };


    function getAll() {
      var deckIds = localStorageService.get('decks'),
        decks = [];
      if (deckIds) {
        deckIds.forEach(function (deckId) {
          var deckOptions = localStorageService.get('deck-' + deckId);
          decks.push(new Deck(deckOptions));
        });
      }
      return decks;
    }

    function getById(id) {
      var deck = tmpDecks[id] || null;
      if (!deck) {
        var deckOptions = localStorageService.get('deck-' + id);
        deck = new Deck(deckOptions);
      }

      return deck;
    }

    function addNew() {
      var deck = new Deck({});
      tmpDecks[deck.options.id] = deck;
      return deck;
    }

    function exportData() {
      var deckIds = localStorageService.get('decks'),
        decks = {};
      if (deckIds) {
        deckIds.forEach(function (deckId) {
          decks[deckId] = localStorageService.get('deck-' + deckId);
        });
      }
      return decks;
    }

    function importData(decks) {
      _.each(decks, function (deckOptions) {
        var deck = new Deck(deckOptions);
        deck.save();
      });
    }

    function count(){
      var decks = localStorageService.get('decks');
      return decks ? decks.length : 0;
    }

    return {
      getAll: getAll,
      getById: getById,
      addNew: addNew,
      exportData: exportData,
      importData: importData,
      count: count
    };
  }]);
