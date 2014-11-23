'use strict';

describe('Controller: CardModalController', function () {

  beforeEach(module('mtgApp'));

  var $rootScope,
    scope,
    modalInstance,
    card = {};

  beforeEach(inject(function ($injector) {
    var $controller = $injector.get('$controller');

    $rootScope = $injector.get('$rootScope');
    scope = $rootScope.$new();
    modalInstance = jasmine.createSpyObj('modalInstance', ['close', 'dismiss']);
    $controller('CardModalController', {
      $scope: scope,
      $modalInstance: modalInstance,
      card: card
    });
  }));

  it('$scope.ok should call $modalInstance.close', function () {
    scope.ok();
    expect(modalInstance.close).toHaveBeenCalled();
  });

  it('$scope.cancel should call $modalInstance.dismiss', function () {
    scope.cancel();
    expect(modalInstance.dismiss).toHaveBeenCalled();
  });
});
