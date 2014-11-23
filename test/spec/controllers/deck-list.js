'use strict';

describe('Controller: DeckListController', function () {

  // load the controller's module
  beforeEach(module('mtgApp'));

  var $rootScope,
    $state,
    scope,
    decks,
    event;

  beforeEach(inject(function ($injector) {
    $rootScope = $injector.get('$rootScope');
    decks = $injector.get('decks');
    $state = {
      go: function(){}
    };
    var $controller = $injector.get('$controller');
    scope = $rootScope.$new();
    $controller('DeckListController', {
      $scope: scope,
      decks: decks,
      $state: $state
    });
    event = jasmine.createSpyObj('event', ['preventDefault', 'stopImmediatePropagation']);
  }));

  it('$scope.addNew should call decks.addNew() and $state.go', function () {
    spyOn(decks, 'addNew').and.callThrough();
    spyOn($state, 'go');
    scope.addDeck();
    expect(decks.addNew).toHaveBeenCalled();
    expect($state.go).toHaveBeenCalled();
    expect($state.go.calls.mostRecent().args[0]).toBe('deck-builder');
  });

  it('$scope.removeDeck should call decks.removeDeck() with correct id', function () {
    spyOn(decks, 'removeDeck');
    var deck = decks.addNew();
    scope.removeDeck(event, deck.options.id);
    expect(decks.removeDeck).toHaveBeenCalledWith(deck.options.id);
    expect(event.stopImmediatePropagation).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('decks.getAll should called if a deck is removed', function () {
    spyOn(decks, 'getAll');
    var deck = decks.addNew();
    scope.removeDeck(event, deck.options.id);
    $rootScope.$digest();
    expect(decks.getAll).toHaveBeenCalled();
  });
});
