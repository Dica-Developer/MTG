import App from '../../../src/js/app';

describe('Directive: cardSetSymbol', function() {
  let compile, scope;

  beforeEach(angular.mock.module(App.name));
  beforeEach(angular.mock.inject(function($compile, $rootScope){
    compile = $compile;
    scope = $rootScope.$new();
    scope.card = cardsExcerpt[0];
  }));

  it('Should add the correct class', function() {
    var element = compile('<card-set-symbol data-card="card" data-size="2x" data-tip-text="{{card.setName}}" data-tip-appearance="right"></card-set-symbol>')(scope);
    scope.$digest();
    expect(element.find('i').hasClass('ss ss-fw ss-lea ss-uncommon ss-2x')).to.be.true;
  });

  it('Should add the correct tooltip text and placement', function() {
    var element = compile('<card-set-symbol data-card="card" data-size="2x" data-tip-text="{{card.setName}}" data-tip-appearance="right"></card-set-symbol>')(scope);
    scope.$digest();
    expect(element.find('i').attr('uib-tooltip')).to.equal('Limited Edition Alpha');
    expect(element.find('i').attr('uib-tooltip-placement')).to.equal('right');
  });

  it('Should set correct rarity', function() {
    scope.card = _.find(cardsExcerpt, {rarity: 'Rare'});
    var element = compile('<card-set-symbol data-card="card" data-size="2x" data-tip-text="{{card.setName}}" data-tip-appearance="right"></card-set-symbol>')(scope);
    scope.$digest();
    expect(element.find('i').hasClass('ss-rare')).to.be.true;

    scope.card = _.find(cardsExcerpt, {rarity: 'Common'});
    scope.$digest();
    expect(element.find('i').hasClass('ss-common')).to.be.true;

    scope.card = _.find(cardsExcerpt, {rarity: 'Uncommon'});
    scope.$digest();
    expect(element.find('i').hasClass('ss-uncommon')).to.be.true;
  });

  it('Should set rarity to c (Common) if card has no rarity field', function() {
    scope.card = _.find(cardsExcerpt, {rarity: 'Rare'});
    delete scope.card.rarity;
    var element = compile('<card-set-symbol data-card="card" data-size="2x" data-tip-text="{{card.setName}}" data-tip-appearance="right"></card-set-symbol>')(scope);
    scope.$digest();
    expect(element.find('i').hasClass('ss-common')).to.be.true;
  });
});
