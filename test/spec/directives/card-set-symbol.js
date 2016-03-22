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

  it('Should add the correct class', function() {
    var element = $compile('<card-set-symbol data-card="card" data-size="2x" data-tip-text="{{card.setName}}" data-tip-appearance="right"></card-set-symbol>')($rootScope);
    $rootScope.$digest();
    expect(element.find('i').attr('class')).toBe('ss ss-fw ss-lea ss-uncommon ss-2x');
  });

  it('Should add the correct tooltip text and placement', function() {
    var element = $compile('<card-set-symbol data-card="card" data-size="2x" data-tip-text="{{card.setName}}" data-tip-appearance="right"></card-set-symbol>')($rootScope);
    $rootScope.$digest();
    expect(element.find('i').attr('uib-tooltip')).toBe('Limited Edition Alpha');
    expect(element.find('i').attr('uib-tooltip-placement')).toBe('right');
  });

  it('Should set correct rarity', function() {
    $rootScope.card = _.find(cardsExcerpt, {rarity: 'Rare'});
    var element = $compile('<card-set-symbol data-card="card" data-size="2x" data-tip-text="{{card.setName}}" data-tip-appearance="right"></card-set-symbol>')($rootScope);
    $rootScope.$digest();
    expect(element.find('i').hasClass('ss-rare')).toBe(true);

    $rootScope.card = _.find(cardsExcerpt, {rarity: 'Common'});
    $rootScope.$digest();
    expect(element.find('i').hasClass('ss-common')).toBe(true);

    $rootScope.card = _.find(cardsExcerpt, {rarity: 'Uncommon'});
    $rootScope.$digest();
    expect(element.find('i').hasClass('ss-uncommon')).toBe(true);
  });

  it('Should set rarity to c (Common) if card has no rarity field', function() {
    $rootScope.card = _.find(cardsExcerpt, {rarity: 'Rare'});
    delete $rootScope.card.rarity;
    var element = $compile('<card-set-symbol data-card="card" data-size="2x" data-tip-text="{{card.setName}}" data-tip-appearance="right"></card-set-symbol>')($rootScope);
    $rootScope.$digest();
    expect(element.find('i').hasClass('ss-common')).toBe(true);
  });
});
