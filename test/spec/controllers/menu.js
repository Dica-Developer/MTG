'use strict';

describe('Controller: MenuController', function () {

  // load the controller's module
  beforeEach(module('mtgApp'));

  var $rootScope,
    scope,
    deckMock = [1, 2, 3],
    lastChanged;

  beforeEach(inject(function ($injector) {
    $rootScope = $injector.get('$rootScope');
    var $controller = $injector.get('$controller');
    scope = $rootScope.$new();
    $controller('MenuController', {
      $scope: scope,
      decks: {
        getAll: function(){
          return deckMock;
        },
        lastChange: function(){
          return lastChanged;
        }
      }
    });
  }));

  it('should attach a list of decks to scope', function () {
    expect(scope.allDecks.length).toBe(3);
  });

  it('should update list if decks.lastChanged is changed', function () {
    expect(scope.allDecks.length).toBe(3);
    deckMock = [1,2];

    expect(scope.allDecks.length).toBe(3);

    lastChanged = new Date().getTime();
    $rootScope.$apply();
  });
});
