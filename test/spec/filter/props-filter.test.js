import App from '../../../src/js/app';

describe('Filter: propsFilter', function () {
  let propsFilter;

  beforeEach(angular.mock.module(App.name));
  beforeEach(angular.mock.inject(function (_propsFilterFilter_) {
    propsFilter = _propsFilterFilter_;
  }));

  it('should return correct filtered results if search term matches', function () {
    var filterResult = propsFilter(cardsExcerpt, {name: 'Air Elemental'});
    expect(filterResult).to.have.length(1);
    expect(filterResult[0]).to.have.property('name', 'Air Elemental');
  });

  it('should return correct filtered results if search term matches partly', function () {
    var filterResult = propsFilter(cardsExcerpt, {name: 'Artifact'});
    expect(filterResult).to.have.length(2);
    expect(filterResult[0]).to.have.property('name', 'Animate Artifact');
    expect(filterResult[1]).to.have.property('name', 'Copy Artifact');
  });

  it('should return items to search as is if it is not an array', function () {
    var filterResult = propsFilter('NotAnArray', {name: 'Artifact'});
    expect(filterResult).to.equal('NotAnArray');
  });

});
