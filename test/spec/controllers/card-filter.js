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
        getSetList: function () {
          return $q.when([
            {
              code: 'TEST'
            }
          ]);
        },
        isAvailable: function () {
          return true;
        }
      },
      sets: {
        filter: function () {
          return [{code: 'TEST'}];
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
      W: false,
      B: false,
      G: false,
      U: false,
      R: false,
      C: false
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
    expect(scope.db).toHaveBeenCalledWith({ concatNames: Object({ likenocase: 'Test Creature' }), cardColor: 0 });
    expect(scope.filterUpdated).toEqual(jasmine.any(Number));
  });

  it('should query db with correct set code', function () {
    spyOn(scope, 'db').and.callThrough();
    $rootScope.$apply();
    expect(scope.db).not.toHaveBeenCalledWith();
    $rootScope.$apply(function(){
      scope.selectedSets = [scope.setList[0]];
    });
    expect(scope.db).toHaveBeenCalledWith({ setCode: [ 'TEST' ], cardColor: 0 });
    expect(scope.filterUpdated).toEqual(jasmine.any(Number));
  });

  it('should query db with correct color', function () {
    spyOn(scope, 'db').and.callThrough();
    $rootScope.$apply();
    expect(scope.db).not.toHaveBeenCalledWith();
    $rootScope.$apply(function(){
      scope.colors.W = true;
      scope.colors.B = true;
    });
    expect(scope.db).toHaveBeenCalledWith({ cardColor: 5 });
    expect(scope.filterUpdated).toEqual(jasmine.any(Number));
  });

  it('should query db with correct cmc', function () {
    spyOn(scope, 'db').and.callThrough();
    $rootScope.$apply();
    expect(scope.db).not.toHaveBeenCalledWith();
    $rootScope.$apply(function(){
      scope.combinedManaCost = 2;
    });
    expect(scope.db).toHaveBeenCalledWith({ cmc: 2, cardColor: 0 });
    expect(scope.filterUpdated).toEqual(jasmine.any(Number));
  });

  it('should query db with correct value', function () {
    spyOn(scope, 'db').and.callThrough();
    $rootScope.$apply();
    expect(scope.db).not.toHaveBeenCalledWith();
    scope.cardName = 'Test Creature';
    scope.selectedSets = [scope.setList[0]];
    scope.colors.W = true;
    scope.combinedManaCost = 2;
    $rootScope.$apply();
    expect(scope.db).toHaveBeenCalledWith({ concatNames : { likenocase : 'Test Creature' }, setCode : [ 'TEST' ], cmc : 2, cardColor: 1});
    expect(scope.filterUpdated).toEqual(jasmine.any(Number));
  });
});
