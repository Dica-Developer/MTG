'use strict';

describe('Controller: ExportDialogController', function () {

  beforeEach(module('mtgApp'));

  var $rootScope,
    $controller,
    scope,
    modalInstance,
    cards = {},
    decks = [
      {
        name: 'test Deck 1',
        id: '1'
      },
      {
        name: 'test Deck 2',
        id: '2'
      },
      {
        name: 'test Deck 3',
        id: '3'
      }
    ];

  beforeEach(inject(function ($injector) {
    $controller = $injector.get('$controller');

    $rootScope = $injector.get('$rootScope');
    scope = $rootScope.$new();
    modalInstance = jasmine.createSpyObj('modalInstance', ['close', 'dismiss']);
  }));

  it('Should set decks correct values', function(){
    $controller('ExportDialogController', {
      $scope: scope,
      $modalInstance: modalInstance,
      exportCards: cards,
      exportDecks: decks
    });

    expect(_.size(scope.decks)).toBe(3);
    _.each(scope.decks, function(deck){
      expect(deck.selected).toBe(true);
    });
  });

  it('Should set decks to null', function(){
    $controller('ExportDialogController', {
      $scope: scope,
      $modalInstance: modalInstance,
      exportCards: cards,
      exportDecks: void 0
    });

    expect(scope.decks).toBeNull();
  });

  it('$scope.deselectAll should set "selected" to all decks false', function () {
    $controller('ExportDialogController', {
      $scope: scope,
      $modalInstance: modalInstance,
      exportCards: cards,
      exportDecks: decks
    });
    scope.deselectAll();
    _.each(scope.decks, function(deck){
      expect(deck.selected).toBe(false);
    });
  });

  it('$scope.selectAll should set "selected" to all decks true', function () {
    $controller('ExportDialogController', {
      $scope: scope,
      $modalInstance: modalInstance,
      exportCards: cards,
      exportDecks: decks
    });
    scope.deselectAll();
    _.each(scope.decks, function(deck){
      expect(deck.selected).toBe(false);
    });

    scope.selectAll();
    _.each(scope.decks, function(deck){
      expect(deck.selected).toBe(true);
    });
  });

  it('$scope.decksToExport should return correct length of all set with "selected = true"', function () {
    $controller('ExportDialogController', {
      $scope: scope,
      $modalInstance: modalInstance,
      exportCards: cards,
      exportDecks: decks
    });
    var length = scope.decksToExport();
    expect(length).toBe(3);

    scope.decks[0].selected = false;
    length = scope.decksToExport();
    expect(length).toBe(2);
  });

  it('$scope.ok should call $modalInstance.close', function () {
    $controller('ExportDialogController', {
      $scope: scope,
      $modalInstance: modalInstance,
      exportCards: cards,
      exportDecks: decks
    });
    scope.ok();
    expect(modalInstance.close).toHaveBeenCalled();
  });

  it('$scope.cancel should call $modalInstance.dismiss', function () {
    $controller('ExportDialogController', {
      $scope: scope,
      $modalInstance: modalInstance,
      exportCards: cards,
      exportDecks: decks
    });
    scope.cancel();
    expect(modalInstance.dismiss).toHaveBeenCalled();
  });
});
