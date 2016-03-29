import {lastIndexOf, without, sampleSize, includes} from 'lodash';

function generateUUID() {
    var d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        /*jshint bitwise:false*/
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
}

/**
 * @class
 *
 */
export default class Deck {

    /**
     * @constructor
     * @param options
     */
    constructor(options = {}) {
        this.options = Object.assign(
            {},
            {
                id: generateUUID(),
                name: '',
                cards: [],
                sideboard: []
            },
            options
        );
    }

    /**
     * 
     * @param {String} cardId
     */
    addCard(cardId) {

        if(typeof cardId !== 'string') {
            throw new Error('Id is not type of `string` but: ' + typeof cardId);
        }

        this.options.cards.push(cardId);
    }

    /**
     * 
     * @param {String} cardId
     */
    dropCard(cardId) {
        let cardIndex = lastIndexOf(this.options.cards, cardId);
        this.options.cards.splice(cardIndex, 1);
    }

    /**
     * 
     * @param {String} cardId
     */
    dropAll(cardId) {
        this.options.cards = without(this.options.cards, cardId);
    }

    addCardToSideBoard(cardId) {
        this.options.sideboard.push(cardId);
    }

    dropCardFromSideBoard(cardId) {
        var cardIndex = lastIndexOf(this.options.sideboard, cardId);
        this.options.sideboard.splice(cardIndex, 1);
    }

    dropAllFromSideboard(cardId) {
        this.options.sideboard = without(this.options.sideboard, cardId);
    }

    setName(name) {
        this.options.name = name;
    }

    getName() {
        return this.options.name;
    }

    setType(type) {
        this.options.type = type;
    }

    moveCardToSideboard(cardId) {
        var cardIndex = lastIndexOf(this.options.cards, cardId);
        var card = this.options.cards.splice(cardIndex, 1);
        this.addCardToSideBoard(card[0]);
    }

    moveCardToMain(cardId) {
        var cardIndex = lastIndexOf(this.options.sideboard, cardId);
        var card = this.options.sideboard.splice(cardIndex, 1);
        this.addCard(card[0]);
    }

    getShuffle(count) {
        return sampleSize(this.options.cards, count);
    }

    getCountOf(cardId) {
        return this.options.cards.filter(function (card) {
            return card === cardId;
        }).length;
    }

    getSideboardCountOf(cardId) {
        return this.options.sideboard.filter(function (card) {
            return card === cardId;
        }).length;
    }

    getCardCount() {
        return this.options.cards.length;
    }

    getSideboardCount() {
        return this.options.sideboard.length;
    }

    hasCard(cardId) {
        return includes(this.options.cards, cardId);
    }

    getCards() {
        return this.options.cards;
    }
    
    getSidedeckCards() {
        return this.options.sideboard;
    }
    
    getId() {
        return this.options.id;
    }

}