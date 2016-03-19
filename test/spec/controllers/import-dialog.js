'use strict';

describe('Controller: ImportDialogController', function () {

  beforeEach(module('mtgApp'));

  var $rootScope,
    $controller,
    scope,
    modalInstance,
    cards = {},
    importDecks = [
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
    ],
    decks = jasmine.createSpyObj('decks', ['existsByName']);

  beforeEach(inject(function ($injector) {
    $controller = $injector.get('$controller');

    $rootScope = $injector.get('$rootScope');
    scope = $rootScope.$new();
    modalInstance = jasmine.createSpyObj('modalInstance', ['close', 'dismiss']);
  }));

  it('Should set decks correct values', function(){
    $controller('ImportDialogController', {
      $scope: scope,
      $uibModalInstance: modalInstance,
      decks: decks,
      importCards: cards,
      importDecks: importDecks
    });

    expect(_.size(scope.decks)).toBe(3);
    _.each(scope.decks, function(deck){
      expect(deck.selected).toBe(true);
    });
  });

  it('$scope.deselectAll should set "selected" to all decks false', function () {
    $controller('ImportDialogController', {
      $scope: scope,
      $uibModalInstance: modalInstance,
      importCards: cards,
      importDecks: importDecks
    });
    scope.deselectAll();
    _.each(scope.decks, function(deck){
      expect(deck.selected).toBe(false);
    });
  });

  it('$scope.selectAll should set "selected" to all decks true', function () {
    $controller('ImportDialogController', {
      $scope: scope,
      $uibModalInstance: modalInstance,
      importCards: cards,
      importDecks: importDecks
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

  it('$scope.decksToImport should return correct length of all set with "selected = true"', function () {
    $controller('ImportDialogController', {
      $scope: scope,
      $uibModalInstance: modalInstance,
      importCards: cards,
      importDecks: importDecks
    });
    var length = scope.decksToImport();
    expect(length).toBe(3);

    scope.decks[0].selected = false;
    length = scope.decksToImport();
    expect(length).toBe(2);
  });

  it('$scope.ok should call $uibModalInstance.close', function () {
    $controller('ImportDialogController', {
      $scope: scope,
      $uibModalInstance: modalInstance,
      importCards: cards,
      importDecks: importDecks
    });
    scope.ok();
    expect(modalInstance.close).toHaveBeenCalled();
  });

  it('$scope.cancel should call $uibModalInstance.dismiss', function () {
    $controller('ImportDialogController', {
      $scope: scope,
      $uibModalInstance: modalInstance,
      importCards: cards,
      importDecks: importDecks
    });
    scope.cancel();
    expect(modalInstance.dismiss).toHaveBeenCalled();
  });
});
