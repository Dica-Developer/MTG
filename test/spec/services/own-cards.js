/*global cardsExcerpt, _*/
'use strict';

describe('Service: ownCards', function () {

  beforeEach(module('mtgApp'));

  //This is needed to use jasmine clock, usually it will not work with _.debounce
  beforeEach(function(){
    spyOn(_, 'debounce').and.callFake(function (func, timeout) {
      return function () {
        setTimeout(function(){
          func.apply(this, arguments);
        }, timeout);
      };
    });
  });

  var ownCards, cards, localStorageService;

  beforeEach(inject(function (_ownCards_, _cards_, _localStorageService_) {
    jasmine.clock().install();
    cards = _cards_;
    cards.db.insert(cardsExcerpt);
    localStorageService = _localStorageService_;
    ownCards = _ownCards_;
  }));

  afterEach(function(){
    jasmine.clock().uninstall();
  });

  it('should have correct API', function () {
    expect(ownCards.getAll).toBeDefined();
    expect(ownCards.getById).toBeDefined();
    expect(ownCards.getCountOf).toBeDefined();
    expect(ownCards.addCard).toBeDefined();
    expect(ownCards.removeCard).toBeDefined();
    expect(ownCards.importData).toBeDefined();
  });

  it('.addCard should call localStorageService.set after 1000ms', function(){
    var card = cardsExcerpt[0];
    spyOn(localStorageService, 'set');

    ownCards.addCard(card.multiverseid);
    expect(localStorageService.set).not.toHaveBeenCalled();


    jasmine.clock().tick(800);
    expect(localStorageService.set).not.toHaveBeenCalled();

    jasmine.clock().tick(201);
    expect(localStorageService.set).toHaveBeenCalled();

    ownCards.addCard(card.multiverseid);
    jasmine.clock().tick(1001);
    expect(localStorageService.set.calls.count()).toBe(2);
  });

  it('.addCard should set correct card count', function(){
    var card = cardsExcerpt[0];
    spyOn(localStorageService, 'set');

    expect(ownCards.getCountOf(card.multiverseid)).toBe(0);

    ownCards.addCard(card.multiverseid);
    expect(ownCards.getCountOf(card.multiverseid)).toBe(1);

    ownCards.addCard(card.multiverseid);
    expect(ownCards.getCountOf(card.multiverseid)).toBe(2);
  });

  it('.removeCard should call localStorageService.set after 1000ms', function(){
    var card = cardsExcerpt[0];
    spyOn(localStorageService, 'set');
    ownCards.addCard(card.multiverseid);
    jasmine.clock().tick(1001);
    localStorageService.set.calls.reset();

    ownCards.removeCard(card.multiverseid);
    expect(localStorageService.set).not.toHaveBeenCalled();


    jasmine.clock().tick(800);
    expect(localStorageService.set).not.toHaveBeenCalled();

    jasmine.clock().tick(201);
    expect(localStorageService.set).toHaveBeenCalled();
  });

  it('.removeCard should set correct card count', function(){
    var card = cardsExcerpt[0];
    spyOn(localStorageService, 'set');
    ownCards.addCard(card.multiverseid);
    ownCards.addCard(card.multiverseid);
    ownCards.addCard(card.multiverseid);

    ownCards.removeCard(1);
    expect(ownCards.getCountOf(card.multiverseid)).toBe(3);

    ownCards.removeCard(card.multiverseid);
    expect(ownCards.getCountOf(card.multiverseid)).toBe(2);

    ownCards.removeCard(card.multiverseid);
    expect(ownCards.getCountOf(card.multiverseid)).toBe(1);

    ownCards.removeCard(card.multiverseid);
    expect(ownCards.getCountOf(card.multiverseid)).toBe(0);
  });

  it('.getById should return correct card entry', function(){
    var card = cardsExcerpt[0];
    spyOn(localStorageService, 'set');

    var ownCard = ownCards.getById(card.multiverseid);
    expect(ownCard).toBeUndefined();

    ownCards.addCard(card.multiverseid);

    ownCard = ownCards.getById(card.multiverseid);
    expect(ownCard.multiverseid).toBe(card.multiverseid);
  });

});
