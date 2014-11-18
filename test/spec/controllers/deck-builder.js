'use strict';

describe('Controller: DeckBuilderController', function () {

  // load the controller's module
  beforeEach(module('mtgApp'));

  var $rootScope, scope, ownCards, decks, cards, fakeEvent, newDeck;

  beforeEach(inject(function ($injector) {
    var $controller = $injector.get('$controller');
    $rootScope = $injector.get('$rootScope');
    scope = $rootScope.$new();
    ownCards = $injector.get('ownCards');
    decks = $injector.get('decks');
    cards = $injector.get('cards');
    cards.db.insert(cardsExcerpt);

    newDeck = decks.addNew();

    $controller('DeckBuilderController', {
      $scope: scope,
      ownCards: ownCards,
      decks: decks,
      cards: cards,
      $stateParams: {
        deckId: newDeck.options.id
      }
    });
    fakeEvent = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
  }));

  afterEach(function(){
    console.log(JSON.stringify(window.localStorage, null, 2));
    window.localStorage.clear();
  });

  it('should have correct initial values', function () {
    expect(scope.scope).toBe(scope);
    expect(scope.db).toBe(cards.db);
    expect(scope.ownCards).toBe(ownCards);
    expect(scope.deck).toBe(newDeck);
    expect(scope.cards.length).toBe(0);
    expect(scope.saveDeck).toEqual(jasmine.any(Function));
    expect(scope.totalCardCount).toBe(0);
    expect(scope.sampleHand).toEqual([]);
    expect(scope.typeFilter).toBe('');
    expect(scope.orderPredicate).toBe('types');
    expect(scope.orderReverse).toBe(false);
    expect(scope.sideboard.length).toBe(0);
    expect(scope.editname).toBe(false);
  });

  it('$scope.editName should set $scope.editname to "true"', function () {
    expect(scope.editname).toBe(false);
    scope.editName();
    expect(scope.editname).toBe(true);
  });

  it('$scope.saveName should call $scope.saveDeck and set $scope.editname to "false"', function () {
    spyOn(scope, 'saveDeck');
    expect(scope.editname).toBe(false);
    scope.editName();
    expect(scope.editname).toBe(true);
    scope.saveName();
    expect(scope.editname).toBe(false);
    expect(scope.saveDeck).toHaveBeenCalled();
  });

  describe('Card actions', function(){

    it('$scope.addCard should call $scope.deck.addCard and update $scope.totalCardCount', function(){
      spyOn(deck, 'addCard').and.callThrough();
      expect(scope.totalCardCount).toBe(0);
      scope.addCard(fakeEvent, 94);

      expect(fakeEvent.stopPropagation).toHaveBeenCalled();
      expect(deck.addCard).toHaveBeenCalledWith(94);
      expect(scope.totalCardCount).toBe(1);
    });

    it('$scope.dropCard should call $scope.deck.dropCard and update $scope.totalCardCount', function(){
      scope.addCard(fakeEvent, 94);
      spyOn(deck, 'dropCard').and.callThrough();
      expect(scope.totalCardCount).toBe(1);
      scope.dropCard(fakeEvent, 94);

      expect(fakeEvent.stopPropagation).toHaveBeenCalled();
      expect(deck.dropCard).toHaveBeenCalledWith(94);
      expect(scope.totalCardCount).toBe(0);
    });

    it('$scope.dropAll should call $scope.deck.dropAll and update $scope.totalCardCount', function(){
      scope.addCard(fakeEvent, 94);
      scope.addCard(fakeEvent, 94);
      spyOn(deck, 'dropAll').and.callThrough();
      expect(scope.totalCardCount).toBe(2);
      scope.dropAll(fakeEvent, 94);

      expect(fakeEvent.stopPropagation).toHaveBeenCalled();
      expect(deck.dropAll).toHaveBeenCalledWith(94);
      expect(scope.totalCardCount).toBe(0);
    });

    it('$scope.addCardToSideBoard should call $scope.deck.addCardToSideBoard', function(){
      spyOn(deck, 'addCardToSideBoard');
      scope.addCardToSideBoard(fakeEvent, 94);

      expect(fakeEvent.stopPropagation).toHaveBeenCalled();
      expect(deck.addCardToSideBoard).toHaveBeenCalledWith(94);
    });

    it('$scope.dropCardFromSideBoard should call $scope.deck.dropCardFromSideBoard', function(){
      spyOn(deck, 'dropCardFromSideBoard');
      scope.dropCardFromSideBoard(fakeEvent, 94);

      expect(fakeEvent.stopPropagation).toHaveBeenCalled();
      expect(deck.dropCardFromSideBoard).toHaveBeenCalledWith(94);
    });

    it('$scope.dropAllFromSideboard should call $scope.deck.dropAllFromSideboard', function(){
      spyOn(deck, 'dropAllFromSideboard');
      scope.dropAllFromSideboard(fakeEvent, 94);

      expect(fakeEvent.stopPropagation).toHaveBeenCalled();
      expect(deck.dropAllFromSideboard).toHaveBeenCalledWith(94);
    });

    it('$scope.moveCardToSideboard should call $scope.deck.moveCardToSideboard', function(){
      spyOn(deck, 'moveCardToSideboard');
      scope.moveCardToSideboard(fakeEvent, 94);

      expect(fakeEvent.stopPropagation).toHaveBeenCalled();
      expect(deck.moveCardToSideboard).toHaveBeenCalledWith(94);
    });

    it('$scope.moveCardToMain should call $scope.deck.moveCardToMain', function(){
      spyOn(deck, 'moveCardToMain');
      scope.moveCardToMain(fakeEvent, 94);

      expect(fakeEvent.stopPropagation).toHaveBeenCalled();
      expect(deck.moveCardToMain).toHaveBeenCalledWith(94);
    });
  });

  it('$scope.filterByType should set typeFilter to given type or to "" if type is already filter', function(){
    expect(scope.typeFilter).toBe('');
    scope.filterByType('Instant');
    expect(scope.typeFilter).toBe('Instant');
    scope.filterByType('Instant');
    expect(scope.typeFilter).toBe('');
  });

  it('$scope.alreadyInDeck should return correctly whether is already in deck or not', function(){
    expect(scope.alreadyInDeck(93)).toBe(false);
    scope.addCard(fakeEvent, 93);
    expect(scope.alreadyInDeck(93)).toBe(true);
    scope.dropCard(fakeEvent, 93);
    expect(scope.alreadyInDeck(93)).toBe(false);
  });

  it('$scope.shuffle should set scope.sampleHand exact 7 cards', function(){
    scope.addCard(fakeEvent, 93);
    scope.addCard(fakeEvent, 93);
    scope.addCard(fakeEvent, 93);
    scope.addCard(fakeEvent, 93);
    scope.addCard(fakeEvent, 93);
    scope.addCard(fakeEvent, 93);
    scope.addCard(fakeEvent, 93);
    scope.addCard(fakeEvent, 93);

    scope.shuffle();
    expect(scope.sampleHand.length).toBe(7);
  });

  it('$scope.mulligan should set scope.sampleHand one less with each call until 1', function(){
    scope.addCard(fakeEvent, 93);
    scope.addCard(fakeEvent, 93);
    scope.addCard(fakeEvent, 93);
    scope.addCard(fakeEvent, 93);
    scope.addCard(fakeEvent, 93);
    scope.addCard(fakeEvent, 93);
    scope.addCard(fakeEvent, 93);
    scope.addCard(fakeEvent, 93);

    scope.shuffle();
    expect(scope.sampleHand.length).toBe(7);
    scope.mulligan();
    expect(scope.sampleHand.length).toBe(6);
    scope.mulligan();
    expect(scope.sampleHand.length).toBe(5);
    scope.mulligan();
    expect(scope.sampleHand.length).toBe(4);
    scope.mulligan();
    expect(scope.sampleHand.length).toBe(3);
    scope.mulligan();
    expect(scope.sampleHand.length).toBe(2);
    scope.mulligan();
    expect(scope.sampleHand.length).toBe(1);
    scope.mulligan();
    expect(scope.sampleHand.length).toBe(1);
  });

});
