/*global TAFFY*/
'use strict';

describe('Controller: CardFilterController', function () {

  // load the controller's module
  beforeEach(module('mtgApp'));

  var $rootScope, scope;

  beforeEach(inject(function ($injector) {
    $rootScope = $injector.get('$rootScope');
    var $controller = $injector.get('$controller');
    var $q = $injector.get('$q');
    scope = $rootScope.$new();
    scope.db = TAFFY();
    $controller('CardFilterController', {
      $scope: scope,
      data: {
        getSetList: function(){
          return $q.when([
            {
              code: 'TEST'
            }
          ]);
        },
        isAvailable: function(){
          return true;
        }
      }
    });
  }));

  it('should have correct initial values', function () {
    expect(scope.cardName).toBe('');
    expect(scope.filteredCards.length).toBe(0);
    expect(scope.selectedSets).toBeNull();
    expect(scope.combinedManaCost).toBe(-1);
    expect(scope.colors).toEqual({
      White: false,
      Black: false,
      Green: false,
      Blue: false,
      Red: false
    });
    $rootScope.$apply();
    expect(scope.setList).toEqual([{ code: 'TEST' }]);
  });

  it('should query db with correct card name', function () {
    spyOn(scope, 'db').and.callThrough();
    $rootScope.$apply();
    expect(scope.db).not.toHaveBeenCalledWith();
    $rootScope.$apply(function(){
      scope.cardName = 'Test Creature';
    });
    expect(scope.db).toHaveBeenCalledWith({ concatNames : { likenocase : 'Test Creature' } });
    expect(scope.filterUpdated).toEqual(jasmine.any(Number));
  });

  it('should query db with correct set code', function () {
    spyOn(scope, 'db').and.callThrough();
    $rootScope.$apply();
    expect(scope.db).not.toHaveBeenCalledWith();
    $rootScope.$apply(function(){
      scope.selectedSets = [scope.setList[0]];
    });
    expect(scope.db).toHaveBeenCalledWith({ setCode : [ 'TEST' ] });
    expect(scope.filterUpdated).toEqual(jasmine.any(Number));
  });

  it('should query db with correct color', function () {
    spyOn(scope, 'db').and.callThrough();
    $rootScope.$apply();
    expect(scope.db).not.toHaveBeenCalledWith();
    $rootScope.$apply(function(){
      scope.colors.White = true;
      scope.colors.Black = true;
    });
    expect(scope.db).toHaveBeenCalledWith({ colors : { hasAll : [ 'White', 'Black' ] } });
    expect(scope.filterUpdated).toEqual(jasmine.any(Number));
  });

  it('should query db with correct cmc', function () {
    spyOn(scope, 'db').and.callThrough();
    $rootScope.$apply();
    expect(scope.db).not.toHaveBeenCalledWith();
    $rootScope.$apply(function(){
      scope.combinedManaCost = 2;
    });
    expect(scope.db).toHaveBeenCalledWith({ cmc : 2 });
    expect(scope.filterUpdated).toEqual(jasmine.any(Number));
  });

  it('should query db with correct value', function () {
    spyOn(scope, 'db').and.callThrough();
    $rootScope.$apply();
    expect(scope.db).not.toHaveBeenCalledWith();
    scope.cardName = 'Test Creature';
    scope.selectedSets = [scope.setList[0]];
    scope.colors.White = true;
    scope.combinedManaCost = 2;
    $rootScope.$apply();
    expect(scope.db).toHaveBeenCalledWith({ concatNames : { likenocase : 'Test Creature' }, setCode : [ 'TEST' ], cmc : 2, colors : { hasAll : [ 'White' ] } });
    expect(scope.filterUpdated).toEqual(jasmine.any(Number));
  });
});
