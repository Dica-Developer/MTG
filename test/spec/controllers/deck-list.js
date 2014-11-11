'use strict';

describe('Controller: DeckListController', function () {

  // load the controller's module
  beforeEach(module('mtgApp'));

  var $rootScope,
    $state,
    scope,
    decks;

  beforeEach(inject(function ($injector) {
    $rootScope = $injector.get('$rootScope');
    decks = $injector.get('decks');
    $state = $injector.get('$state');
    var $controller = $injector.get('$controller');
    scope = $rootScope.$new();
    $controller('DeckListController', {
      $scope: scope,
      decks: decks,
      $state: $state
    });
  }));

  it('$scope.addNew should call decks.addNew() and $state.go', function () {
    spyOn(decks, 'addNew').and.callThrough();
    spyOn($state, 'go');
    scope.addDeck();
    expect(decks.addNew).toHaveBeenCalled();
    expect($state.go).toHaveBeenCalled();
    expect($state.go.calls.mostRecent().args[0]).toBe('deck-builder');
  });
});
