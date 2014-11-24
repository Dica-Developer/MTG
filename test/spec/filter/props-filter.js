/*global cardsExcerpt*/
'use strict';

describe('Filter: propsFilter', function () {

  // load the controller's module
  beforeEach(module('mtgApp'));

  var propsFilter;

  beforeEach(inject(function (_propsFilterFilter_) {
    propsFilter = _propsFilterFilter_;
  }));

  it('should return correct filtered results if search term matches', function () {
    var filterResult = propsFilter(cardsExcerpt, {name: 'Air Elemental'});
    expect(filterResult.length).toBe(1);
    expect(filterResult[0].name).toBe('Air Elemental');
  });

  it('should return correct filtered results if search term matches partly', function () {
    var filterResult = propsFilter(cardsExcerpt, {name: 'Artifact'});
    expect(filterResult.length).toBe(2);
    expect(filterResult[0].name).toBe('Animate Artifact');
    expect(filterResult[1].name).toBe('Copy Artifact');
  });

  it('should return items to search as is if it is not an array', function () {
    var filterResult = propsFilter('NotAnArray', {name: 'Artifact'});
    expect(filterResult).toBe('NotAnArray');
  });

});
