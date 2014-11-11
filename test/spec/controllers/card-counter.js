'use strict';

describe('Controller: CardCounterController', function () {

  // load the controller's module
  beforeEach(module('mtgApp'));

  var $rootScope, scope, ownCards, event;

  beforeEach(inject(function ($injector) {
    var $controller = $injector.get('$controller');

    $rootScope = $injector.get('$rootScope');
    scope = $rootScope.$new();
    scope.cardId = 23;
    ownCards = $injector.get('ownCards');
    $controller('CardCounterController', {
      $scope: scope,
      ownCards: ownCards
    });
    event = jasmine.createSpyObj('event', ['preventDefault', 'stopImmediatePropagation'])
  }));

  it('should have correct initial values', function () {
    expect(scope.count).toBe(0);
  });

  it('scope.addCard should prevent default event and call ownCards.addCard', function () {
    spyOn(ownCards, 'addCard');
    scope.addCard(event);
    expect(ownCards.addCard).toHaveBeenCalledWith(23);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopImmediatePropagation).toHaveBeenCalled();
  });

  it('scope.removeCard should prevent default event and call ownCards.removeCard', function () {
    spyOn(ownCards, 'removeCard');
    scope.count = 1;
    scope.removeCard(event);
    expect(ownCards.removeCard).toHaveBeenCalledWith(23);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopImmediatePropagation).toHaveBeenCalled();
  });

  it('scope.removeCard shouldn\'t call ownCards.removeCard if card count is 0', function () {
    spyOn(ownCards, 'removeCard');
    scope.removeCard(event);
    expect(ownCards.removeCard).not.toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopImmediatePropagation).toHaveBeenCalled();
  });

  it('scope.count should update if ownCards.getCountOf return changed value', function () {
    $rootScope.$apply();
    expect(scope.count).toBe(0);
    spyOn(ownCards, 'getCountOf').and.returnValue(2);
    $rootScope.$apply();
    expect(scope.count).toBe(2);
  });

  it('ownCards.getCountOf should called if scope.cardId changes', function () {
    spyOn(ownCards, 'getCountOf');
    $rootScope.$apply();
    expect(scope.cardId).toBe(23);
    expect(ownCards.getCountOf).toHaveBeenCalledWith(23);
    scope.cardId = 66;
    $rootScope.$apply();
    expect(ownCards.getCountOf).toHaveBeenCalledWith(66);
  });
});
