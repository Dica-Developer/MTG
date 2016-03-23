'use strict';

describe('Service: cardColor', function () {

  var cardColor;

  beforeEach(module('mtgApp'));
  beforeEach(inject(function (_cardColor_) {
    cardColor = _cardColor_;
  }));

  describe('getColorBitsForDb', function() {

    it('Should return correct color bits', function () {
      var colorBits = cardColor.getColorBitsForDb('{W}{U}');
      expect(colorBits).toBe(3);
    });

    it('Should return 0 if no color is in the mana cost string', function () {
      var colorBits = cardColor.getColorBitsForDb('{2}{1}');
      expect(colorBits).toBe(0);
    });

    it('Should return 0 mana cost string is null', function () {
      var colorBits = cardColor.getColorBitsForDb(null);
      expect(colorBits).toBe(0);
    });

  });

  describe('getColorBitsFromMap', function() {
    var DEFAULT_COLOR_MAP = {
      W: false,
      B: false,
      G: false,
      U: false,
      R: false,
      C: false
    };

    it('Should return correct color bits', function () {
      var colorMapToCheck = _.assign({}, DEFAULT_COLOR_MAP, { W: true, U: true }),
        colorBits = cardColor.getColorBitsFromMap(colorMapToCheck);
      expect(colorBits).toBe(3);
    });

    it('Should return 0 if every color is false', function () {
      var colorBits = cardColor.getColorBitsFromMap(DEFAULT_COLOR_MAP);
      expect(colorBits).toBe(0);
    });
  });

});
