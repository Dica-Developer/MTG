'use strict';

describe('Filter: cardTypeFilter', function () {

  // load the controller's module
  beforeEach(module('mtgApp'));

  var cardTypeFilter;

  beforeEach(inject(function (_cardTypeFilter_) {
    cardTypeFilter = _cardTypeFilter_;
  }));

  it('should return correct filtered results', function () {
    var filterResult = cardTypeFilter(cardsExcerpt, 'Sorcery');
    expect(filterResult.length).toBe(5);
    filterResult.forEach(function(card){
      expect(_.contains(card.types, 'Sorcery'));
    });
  });

  it('should return all cards if filter is empty', function () {
    var filterResult = cardTypeFilter(cardsExcerpt, '');
    expect(filterResult.length).toBe(cardsExcerpt.length);
  });

  it('should return nothing if filter doesn\'t match', function () {
    var filterResult = cardTypeFilter(cardsExcerpt, 'NoMatch');
    expect(filterResult.length).toBe(0);
  });

});
