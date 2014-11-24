/*global cardsExcerpt*/
'use strict';

describe('Directive: cardCounter', function () {
  var $compile,
    $rootScope,
    cards,
    ownCards;

  beforeEach(module('mtgApp'));
  beforeEach(module('templates'));

  beforeEach(inject(function (_$compile_, _$rootScope_, _ownCards_, _cards_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    cards = _cards_;
    ownCards = _ownCards_;

    cards.db.insert(cardsExcerpt);
  }));

  it('Should display correct amount of own cards', function () {
    $rootScope.multiverseid = 279;
    var element = $compile('<card-counter x-card-id="{{multiverseid}}" ></card-counter>')($rootScope);
    $rootScope.$digest();
    expect(element.find('.label-default').text()).toBe('0');

    ownCards.addCard('279');

    $rootScope.$digest();
    expect(element.find('.label-default').text()).toBe('1');

    ownCards.removeCard('279');

    $rootScope.$digest();
    expect(element.find('.label-default').text()).toBe('0');
  });
});

