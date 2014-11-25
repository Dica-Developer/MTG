/*global require, process*/
'use strict';

angular.module('mtgApp')
  .service('data', ['$http', '$q', function ($http, $q) {

    //check if we are in the actual app or in dev mode in browser
    var nodeApp = typeof process !== 'undefined',
      downloadsBasePath = 'http://mtgjson.com/json/',
      cardsPath = downloadsBasePath + 'AllSets-x.json.zip',
      setsPath = downloadsBasePath + 'SetList.json',
      versionsPath = downloadsBasePath + 'version-full.json',
      overAllProgressDefer, basePath, cardDataPath, setDataPath, fs, request, path;


    //set required paths on startup
    if (nodeApp) {
      var filePath = process.mainModule.filename;

      path = require('path');
      fs = require('fs');
      request = require('request');
      basePath = filePath.substring(0, filePath.indexOf('.nw') + 3);
      cardDataPath = path.join(basePath, 'data', 'AllSets-x.json');
      setDataPath = path.join(basePath, 'data', 'SET_LIST.json');
    }

    function isAvailable() {
      if (!nodeApp) {
        return false;
      } else {
        var cardDataExist = fs.existsSync(cardDataPath);
        var setDataExist = fs.existsSync(setDataPath);
        return cardDataExist && setDataExist;
      }
    }

    //TODO reduce complexity
    function cleanUpCurrentDataFolder() {
      var removeCardDataDefer = $q.defer(),
        removeSetDataDefer = $q.defer(),
        deferredList = [
          removeCardDataDefer,
          removeSetDataDefer
        ];
      overAllProgressDefer.notify('Remove old card data.');
      overAllProgressDefer.notify('Remove old set data.');
      if(fs.existsSync(cardDataPath)){
        fs.unlink(cardDataPath, function (error) {
          if (error) {
            removeCardDataDefer.reject();
            console.error(error);
          } else {
            removeCardDataDefer.resolve();
          }
        });
      } else {
        removeCardDataDefer.resolve();
      }

      if(fs.existsSync(setDataPath)){
        fs.unlink(setDataPath, function (error) {
          if (error) {
            removeSetDataDefer.reject();
            console.error(error);
          } else {
            removeSetDataDefer.resolve();
          }
        });
      } else {
        removeSetDataDefer.resolve();
      }

      return $q.all(deferredList);
    }

    function getCardVersion() {
      return $http.get(versionsPath);
    }

    function fetchSetDataAndWriteToDisk() {
      var defer = $q.defer(),
        writeStream = fs.createWriteStream(setDataPath),
        req = request(setsPath)
          .pipe(writeStream);

      overAllProgressDefer.notify('Fetch new set data.');
      req.on('error', function () {
        defer.reject();
      });

      writeStream.on('finish', function () {
        defer.resolve();
      });

      return defer.promise;
    }

    function fetchCardsDataZipAndWriteToDisk() {
      var defer = $q.defer(),
        writeStream = fs.createWriteStream(cardDataPath + '.zip'),
        req = request(cardsPath)
          .pipe(writeStream);

      overAllProgressDefer.notify('Fetch new card data.');
      req.on('error', function () {
        defer.reject();
      });

      req.on('data', function(data){
        console.log(data);
      });

      writeStream.on('finish', function () {
        defer.resolve();
      });
      return defer.promise;
    }

    function unzipCardData(){
      var DecompressZip = require('decompress-zip'),
        unzipper = new DecompressZip(cardDataPath + '.zip'),
        defer = $q.defer();

      overAllProgressDefer.notify('Unzip new card data.');
      unzipper.on('error', function (error) {
        console.error(error);
        defer.reject();
      });

      unzipper.on('extract', function () {
        defer.resolve();
      });

      unzipper.extract({
        path: path.join(basePath, 'data')
      });
      return defer.promise;
    }

    function removeCardDataZip(){
      var defer = $q.defer();

      overAllProgressDefer.notify('Remove card data zip file.');
      if(fs.existsSync(cardDataPath + '.zip')){
        fs.unlink(cardDataPath + '.zip', function(error){
          if(error){
            console.error(error);
            defer.reject();
          } else {
            defer.resolve();
          }
        });
      } else {
        defer.resolve();
      }

      return defer.promise;
    }

    function fetchAll(){
      return $q.all([fetchCardsDataZipAndWriteToDisk(), fetchSetDataAndWriteToDisk()]);
    }

    function fetchData() {
      overAllProgressDefer = $q.defer();
      cleanUpCurrentDataFolder()
        .then(fetchAll, overAllProgressDefer.reject)
        .then(unzipCardData, overAllProgressDefer.reject)
        .then(removeCardDataZip, overAllProgressDefer.reject)
        .then(overAllProgressDefer.resolve, overAllProgressDefer.reject);
      return overAllProgressDefer.promise;
    }

    function getCardData(){
      var file = fs.readFileSync(cardDataPath, {encoding: 'UTF-8'});
      return JSON.parse(file);
    }

    function getSetList(){
      var setList = fs.readFileSync(setDataPath, {encoding: 'UTF-8'});
      return JSON.parse(setList);
    }

    return {
      isAvailable: isAvailable,
      getCardVersion: getCardVersion,
      fetchData: fetchData,
      getCardData: getCardData,
      getSetList: getSetList
    };
  }]);
