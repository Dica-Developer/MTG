import App from '../../../src/js/app';

describe('Controller: CardModalController', function () {
  let scope, modalInstance, card = {};

  beforeEach(angular.mock.module(App.name));
  beforeEach(angular.mock.inject(function ($controller, $rootScope) {

    scope = $rootScope.$new();
    modalInstance = sinon.stub({'close': function(){}, 'dismiss': function(){}});
    $controller('CardModalController', {
      $scope: scope,
      $uibModalInstance: modalInstance,
      card: card
    });
  }));

  it('$scope.ok should call $uibModalInstance.close', function () {
    scope.ok();
    expect(modalInstance.close).to.have.been.called;
  });

  it('$scope.cancel should call $uibModalInstance.dismiss', function () {
    scope.cancel();
    expect(modalInstance.dismiss).to.have.been.called;
  });
});
