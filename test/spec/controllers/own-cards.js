/*global _*/
'use strict';

describe('Controller: OwnCardsController', function () {

  // load the controller's module
  beforeEach(module('mtgApp'));

  var $rootScope, scope, ownCards, cards, $modal;

  beforeEach(inject(function ($injector) {
    var $controller = $injector.get('$controller');

    $rootScope = $injector.get('$rootScope');
    scope = $rootScope.$new();
    scope.cardId = 23;
    ownCards = $injector.get('ownCards');
    cards = $injector.get('cards');
    spyOn(cards, 'filter').and.returnValue(
      _.chain()
        .range(100)
        .map(function(value){
          return {multiverseid: value};
        })
        .value()
    );
    $modal = $injector.get('$uibModal');
    $controller('OwnCardsController', {
      $scope: scope,
      ownCards: ownCards,
      $modal: $modal
    });
  }));

  it('should have correct initial values', function () {
    expect(scope.db).toBeDefined();
    expect(scope.filteredCards.length).toBe(0);
    expect(scope.maxResultLength).toBe(20);
    expect(scope.currentPage).toBe(1);
    expect(scope.cards.length).toBe(0);
    expect(scope.totalItems).toBe(0);
    expect(scope.filterCollapsed).toBe(true);
  });

  it('change scope.currentPage should update scope.cards and scope.totalItems', function () {
    $rootScope.$apply();
    expect(scope.totalItems).toBe(0);
    scope.filteredCards = scope.db().get();
    scope.currentPage = 2;
    $rootScope.$apply();
    expect(scope.totalItems).toBe(100);
    expect(scope.cards.length).toBe(scope.maxResultLength);
    expect(scope.cards[0].multiverseid).toBe(20);
  });

  it('change scope.maxResultLength should update scope.cards', function () {
    $rootScope.$apply();
    scope.filteredCards = scope.db().get();
    scope.maxResultLength = 23;
    $rootScope.$apply();
    expect(scope.cards.length).toBe(23);
    expect(scope.cards[0].multiverseid).toBe(0);
  });

  it('change scope.filterUpdateTimeStamp should update scope.cards', function () {
    $rootScope.$apply();
    scope.filteredCards = scope.db().get();
    scope.filterUpdateTimeStamp = new Date().getTime();
    scope.currentPage = 4;
    $rootScope.$apply();
    expect(scope.cards.length).toBe(20);
    expect(scope.cards[0].multiverseid).toBe(60);
  });

  it('scope.showCardModal should call modal.open', function () {
    spyOn($modal, 'open');
    scope.showCardModal();
    expect($modal.open).toHaveBeenCalled();
  });
});
