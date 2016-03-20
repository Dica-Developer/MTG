/*global _*/
'use strict';

describe('Directive: manaCost', function () {
  var $compile,
    $rootScope;

  beforeEach(module('mtgApp'));
  beforeEach(module('templates'));

  beforeEach(inject(function (_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('Should add mana-cost for numbers 0-9', function () {
    var numbers = _.range(10);
    var element = $compile('<mana-cost x-mana-cost="{{manaCost}}" x-size="16"></mana-cost>')($rootScope);
    numbers.forEach(function (number) {
      $rootScope.manaCost = number;
      $rootScope.$digest();
      expect(element.find('img').attr('ng-src')).toBe('http://gatherer.wizards.com/Handlers/Image.ashx?size=medium&name=' + number + '&type=symbol');
    });
  });

  it('Should add correct symbol for mana', function () {
    var manaSymbols = ['W', 'U', 'B', 'R', 'G', 'X', 'P', 'S'];
    manaSymbols.forEach(function (symbol) {
      $rootScope.symbol = symbol;
      var element = $compile('<mana-cost x-mana-cost="{{symbol}}" x-size="16"></mana-cost>')($rootScope);
      $rootScope.$digest();
      expect(element.find('img').attr('ng-src')).toBe('http://gatherer.wizards.com/Handlers/Image.ashx?size=medium&name=' + symbol.toLowerCase() + '&type=symbol');
    });
  });

  it('Should add correct other symbols', function () {
    var manaSymbols = ['T', 'Q', 'C'];
    manaSymbols.forEach(function (symbol) {
      $rootScope.symbol = symbol;
      var element = $compile('<mana-cost x-mana-cost="{{symbol}}" x-size="16"></mana-cost>')($rootScope);
      $rootScope.$digest();
      expect(element.find('img').attr('ng-src')).toBe('http://gatherer.wizards.com/Handlers/Image.ashx?size=medium&name=' + symbol.toLowerCase() + '&type=symbol');
    });
  });

  it('Should leave ng-src blank if mana symbol doesn\'t match', function () {
    $rootScope.symbol = 'd';
    var element = $compile('<mana-cost x-mana-cost="{{symbol}}" x-size="16"></mana-cost>')($rootScope);
    $rootScope.$digest();
    expect(element.find('img').attr('ng-src')).toBeUndefined();
  });

  it('Should add mana if mana cost is devided by a slash ({B/R})', function () {
    var symbol = '{B/R}';
      $rootScope.symbol = symbol;
    var element = $compile('<mana-cost x-mana-cost="{{symbol}}" x-size="16"></mana-cost>')($rootScope);
    $rootScope.$digest();
    expect(element.find('img').attr('ng-src')).toBe('http://gatherer.wizards.com/Handlers/Image.ashx?size=medium&name=br&type=symbol');
  });
});

