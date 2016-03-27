#Deck Builder
[![Travis](https://img.shields.io/travis/Dica-Developer/MTG.svg?style=flat-square)](https://travis-ci.org/Dica-Developer/MTG) [![Coveralls](https://img.shields.io/coveralls/Dica-Developer/MTG.svg?style=flat-square)](https://coveralls.io/github/Dica-Developer/MTG) [![Code Climate](https://img.shields.io/codeclimate/github/Dica-Developer/MTG.svg?style=flat-square)](https://codeclimate.com/github/Dica-Developer/MTG) [![open issues](http://img.shields.io/github/issues/Dica-Developer/MTG.svg?style=flat-square)](https://github.com/Dica-Developer/MTG/issues)

##Development

###Prerequisite

We recommend following versions minimum as our tests runs with these.

* `node v4.4.1` 
* `npm v2.14.20`

In order to get the best experience you need to download the some json files anf place it well.
Add a folder named `dev_data` to the `src` folder.

####Card Data
Download the card data [zip](http://mtgjson.com/json/AllSets-x.json.zip) and decrompress in `src/dev_data`.

####Set Data
Download the set data [json](http://mtgjson.com/json/SetList.json) and copy to `src/dev_data`.

If you want to build a dist you need to have the [nw-builder](https://github.com/nwjs/nw-builder) installed.
I recommend to install it globally as it is not registered to this package.
`npm install nw-builder -g`

###NPM Commands

####Development

* `npm run dev` starts the webpack dev server (http://localhost:9000)
* `npm run test` does a single test run
* `npm run test:live` starts a file watcher and keeps the test running
* `npm run build` starts a single test run first, after success it will compile all source code and output to `dist` folder
