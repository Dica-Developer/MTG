/*global require, process*/
'use strict';

angular.module('mtgApp')
  .service('data', ['$http', '$q', '$log', function ($http, $q, $log) {

    //check if we are in the actual app or in dev mode in browser
    var nodeApp = typeof process !== 'undefined',
      downloadsBasePath = 'http://mtgjson.com/json/',
      cardsPath = downloadsBasePath + 'AllSets-x.json.zip',
      setsPath = downloadsBasePath + 'SetList.json',
      versionsPath = downloadsBasePath + 'version-full.json',
      overAllProgressDefer, basePath, cardDataPath, setDataPath, fs, request, path,
      progressSteps = {
        steps: {
          'cleanUp': {
            description: 'Remove old data.',
            count: 2,
            complete: 0
          },
          'fetchData': {
            description: 'Receive new card and set data.',
            count: 2,
            complete: 0
          },
          'unzipData': {
            description: 'Unzipping new card data.',
            count: 1,
            complete: 0
          },
          'removeZip': {
            description: 'Removing card zip.',
            count: 1,
            complete: 0
          }
        },
        complete: 0,
        currentStep: 0,
        overallCount: 4
      },
      setProgress = function(step, complete){
        complete = complete || 0;
        progressSteps.currentStep = step;
        var currentStep = progressSteps.steps[step],
          oldComplete = currentStep.complete;

        currentStep.complete = oldComplete + complete;

        if(currentStep.complete === currentStep.count){
          progressSteps.complete = progressSteps.complete + 1;
        }
        overAllProgressDefer.notify(progressSteps);
      };


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
        return true;
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
      setProgress('cleanUp');
      if(fs.existsSync(cardDataPath)){
        fs.unlink(cardDataPath, function (error) {
          if (error) {
            removeCardDataDefer.reject();
            $log.error(error);
          } else {
            setProgress('cleanUp', 1);
            removeCardDataDefer.resolve();
          }
        });
      } else {
        setProgress('cleanUp', 1);
        removeCardDataDefer.resolve();
      }

      if(fs.existsSync(setDataPath)){
        fs.unlink(setDataPath, function (error) {
          if (error) {
            removeSetDataDefer.reject();
            $log.error(error);
          } else {
            setProgress('cleanUp', 1);
            removeSetDataDefer.resolve();
          }
        });
      } else {
        setProgress('cleanUp', 1);
        removeSetDataDefer.resolve();
      }

      return $q.all(deferredList);
    }

    function getCardVersion() {
      return $http.get(versionsPath);
    }

    function fetchSetDataAndWriteToDisk() {
      setProgress('fetchData');
      var defer = $q.defer(),
        writeStream = fs.createWriteStream(setDataPath),
        req = request(setsPath)
          .pipe(writeStream);

      req.on('error', function (error) {
        $log.error(error);
        defer.reject();
      });

      writeStream.on('finish', function () {
        setProgress('fetchData', 1);
        defer.resolve();
      });

      return defer.promise;
    }

    function fetchCardsDataZipAndWriteToDisk() {
      setProgress('fetchData');
      var defer = $q.defer(),
        writeStream = fs.createWriteStream(cardDataPath + '.zip'),
        req = request(cardsPath)
          .pipe(writeStream);

      req.on('error', function (error) {
        $log.error(error);
        defer.reject();
      });

      writeStream.on('finish', function () {
        setProgress('fetchData', 1);
        defer.resolve();
      });
      return defer.promise;
    }

    function unzipCardData(){
      setProgress('unzipData');
      var DecompressZip = require('decompress-zip'),
        unzipper = new DecompressZip(cardDataPath + '.zip'),
        defer = $q.defer();

      unzipper.on('error', function (error) {
        $log.error(error);
        defer.reject();
      });

      unzipper.on('extract', function () {
        setProgress('unzipData', 1);
        defer.resolve();
      });

      unzipper.extract({
        path: path.join(basePath, 'data')
      });
      return defer.promise;
    }

    function removeCardDataZip(){
      var defer = $q.defer();
      setProgress('removeZip');

      if(fs.existsSync(cardDataPath + '.zip')){
        fs.unlink(cardDataPath + '.zip', function(error){
          if(error){
            $log.error(error);
            defer.reject();
          } else {
            setProgress('removeZip', 1);
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
      var defer = $q.defer();
      fs.readFile(setDataPath, {encoding: 'UTF-8'}, function(error, content){
        if(error){
          $log.error(error);
          defer.reject();
        } else {
          defer.resolve(JSON.parse(content));
        }
      });
      return defer.promise;
    }

    return {
      isAvailable: isAvailable,
      getCardVersion: getCardVersion,
      fetchData: fetchData,
      getCardData: getCardData,
      getSetList: getSetList
    };
  }]);
