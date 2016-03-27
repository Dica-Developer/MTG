import App from '../../../src/js/app';

describe('Filter: cardTypeFilter', function () {
  let cardTypeFilter;

  beforeEach(angular.mock.module(App.name));
  beforeEach(angular.mock.inject(function (_cardTypeFilter_) {
    cardTypeFilter = _cardTypeFilter_;
  }));

  it('should return correct filtered results', function () {
    var filterResult = cardTypeFilter(cardsExcerpt, 'Sorcery');
    expect(filterResult).to.have.length(5);
    filterResult.forEach(function(card){
      expect(card.types).to.include('Sorcery');
    });
  });

  it('should return all cards if filter is empty', function () {
    var filterResult = cardTypeFilter(cardsExcerpt, '');
    expect(filterResult).to.have.length(cardsExcerpt.length);
  });

  it('should return nothing if filter doesn\'t match', function () {
    var filterResult = cardTypeFilter(cardsExcerpt, 'NoMatch');
    expect(filterResult).to.have.length(0);
  });

});
