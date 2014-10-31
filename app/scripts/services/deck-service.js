'use strict';

angular.module('mtgApp')
  .service('decks', ['localStorageService', 'cards', function (localStorageService, cards) {

    var generateUUID = function () {
      var d = new Date().getTime();
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        /*jshint bitwise:false*/
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
        cards: options.cards || [],
        sideboard: options.sideboard || []
      };
      this.cardsFull = [];
      this.sideboardFull = [];
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

    Deck.prototype.addCardToSideBoard = function (cardId) {
      this.options.sideboard.push(cardId);
      this.updateFullCardInfo();
    };

    Deck.prototype.dropCardFromSideBoard = function (cardId) {
      var cardIndex = _.lastIndexOf(this.options.sideboard, cardId);
      this.options.sideboard.splice(cardIndex, 1);
      this.updateFullCardInfo();
    };

    Deck.prototype.dropAllFromSideboard = function (cardId) {
      this.options.cards = _.without(this.options.sideboard, cardId);
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

    Deck.prototype.getFullCards = function () {
      return this.cardsFull;
    };

    Deck.prototype.getFullSideboard = function () {
      return this.sideboardFull;
    };

    Deck.prototype.moveCardToSideboard = function (cardId) {
      var cardIndex = _.lastIndexOf(this.options.cards, cardId);
      var card = this.options.cards.splice(cardIndex, 1);
      this.addCardToSideBoard(card[0]);
    };

    Deck.prototype.moveCardToMain = function (cardId) {
      var cardIndex = _.lastIndexOf(this.options.sideboard, cardId);
      var card = this.options.sideboard.splice(cardIndex, 1);
      this.addCard(card[0]);
    };

    Deck.prototype.getManaCurve = function () {
      var generatedCurve = _.countBy(this.cardsFull, 'cmc');
      _.range(1, 8).forEach(function(number){
        if(!generatedCurve[number]){
          generatedCurve[number] = 0;
        }
      });
      if(!generatedCurve.undefined){
        delete generatedCurve.undefined;
      }
      return generatedCurve;
    };

    Deck.prototype.getShuffleSeven = function () {
      var cardIds = _.sample(this.options.cards, 7),
        sample = [];
      cardIds.forEach(function(cardId){
        sample.push(cards.filter({multiverseid: cardId})[0]);
      });
      return sample;
    };

    Deck.prototype.getCountOf = function (cardId) {
      return this.options.cards.filter(function (card) {
        return card === cardId;
      }).length;
    };

    Deck.prototype.getSideboardCountOf = function (cardId) {
      return this.options.sideboard.filter(function (card) {
        return card === cardId;
      }).length;
    };

    Deck.prototype.getCardCount = function () {
      return this.options.cards.length;
    };

    Deck.prototype.getSideboardCount = function () {
      return this.options.sideboard.length;
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
      this.sideboardFull = cards.filter({multiverseid: _.uniq(this.options.sideboard)});
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

    function count() {
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
