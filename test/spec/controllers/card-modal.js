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
    modalInstance = jasmine.createSpyObj('$', ['close', 'dismiss']);
    $controller('CardModalController', {
      $scope: scope,
      $uibModalInstance: modalInstance,
      card: card
    });
  }));

  it('$scope.ok should call $uibModalInstance.close', function () {
    scope.ok();
    expect(modalInstance.close).toHaveBeenCalled();
  });

  it('$scope.cancel should call $uibModalInstance.dismiss', function () {
    scope.cancel();
    expect(modalInstance.dismiss).toHaveBeenCalled();
  });
});
