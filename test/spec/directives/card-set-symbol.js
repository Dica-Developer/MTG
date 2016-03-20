/*global cardsExcerpt, _*/
'use strict';

describe('Directive: cardSetSymbol', function() {
  var $compile,
    $rootScope;

  beforeEach(module('mtgApp'));
  beforeEach(module('templates'));

  beforeEach(inject(function(_$compile_, _$rootScope_){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $rootScope.card = cardsExcerpt[0];
  }));

  it('Should add the correct image path', function() {
    var element = $compile('<card-set-symbol data-card="card" data-size="24" data-tip-text="{{card.setName}}" data-tip-appearance="right"></card-set-symbol>')($rootScope);
    $rootScope.$digest();
    expect(element.find('img').attr('ng-src')).toBe('http://gatherer.wizards.com/Handlers/Image.ashx?type=symbol&set=LEA&size=small&rarity=u');
  });

  it('Should add the correct tooltip text and placement', function() {
    var element = $compile('<card-set-symbol data-card="card" data-size="24" data-tip-text="{{card.setName}}" data-tip-appearance="right"></card-set-symbol>')($rootScope);
    $rootScope.$digest();
    expect(element.find('img').attr('tooltip')).toBe('Limited Edition Alpha');
    expect(element.find('img').attr('tooltip-placement')).toBe('right');
  });

  it('Should set the correct dimension', function() {
    var element = $compile('<card-set-symbol data-card="card" data-size="24" data-tip-text="{{card.setName}}" data-tip-appearance="right"></card-set-symbol>')($rootScope);
    $rootScope.$digest();
    expect(element.find('img').width()).toBe(24);
    expect(element.find('img').height()).toBe(24);
  });

  it('Should add no image path if card is undefined or null', function() {
    $rootScope.card = null;
    var element = $compile('<card-set-symbol data-card="card" data-size="24" data-tip-text="{{card.setName}}" data-tip-appearance="right"></card-set-symbol>')($rootScope);
    $rootScope.$digest();
    expect(element.find('img').attr('ng-src')).toBeUndefined();

    delete $rootScope.card;
    $rootScope.$digest();
    expect(element.find('img').attr('ng-src')).toBeUndefined();
  });

  it('Should set rarity to c (common) if it is a land', function() {
    $rootScope.card = _.findWhere(cardsExcerpt, {multiverseid: 279});
    var element = $compile('<card-set-symbol data-card="card" data-size="24" data-tip-text="{{card.setName}}" data-tip-appearance="right"></card-set-symbol>')($rootScope);
    $rootScope.$digest();
    expect(element.find('img').attr('ng-src')).toBe('http://mtgimage.com/symbol/set/LEA/c.svg');
  });

  it('Should set correct rarity', function() {
    $rootScope.card = _.findWhere(cardsExcerpt, {rarity: 'Rare'});
    var element = $compile('<card-set-symbol data-card="card" data-size="24" data-tip-text="{{card.setName}}" data-tip-appearance="right"></card-set-symbol>')($rootScope);
    $rootScope.$digest();
    expect(element.find('img').attr('ng-src')).toBe('http://mtgimage.com/symbol/set/LEA/r.svg');

    $rootScope.card = _.findWhere(cardsExcerpt, {rarity: 'Common'});
    $rootScope.$digest();
    expect(element.find('img').attr('ng-src')).toBe('http://mtgimage.com/symbol/set/LEA/c.svg');

    $rootScope.card = _.findWhere(cardsExcerpt, {rarity: 'Uncommon'});
    $rootScope.$digest();
    expect(element.find('img').attr('ng-src')).toBe('http://mtgimage.com/symbol/set/LEA/u.svg');
  });

  it('Should set rarity to c (Common) if card has no rarity field', function() {
    $rootScope.card = _.findWhere(cardsExcerpt, {rarity: 'Rare'});
    delete $rootScope.card.rarity;
    var element = $compile('<card-set-symbol data-card="card" data-size="24" data-tip-text="{{card.setName}}" data-tip-appearance="right"></card-set-symbol>')($rootScope);
    $rootScope.$digest();
    expect(element.find('img').attr('ng-src')).toBe('http://gatherer.wizards.com/Handlers/Image.ashx?type=symbol&set=LEA&size=small&rarity=c');
  });
});
