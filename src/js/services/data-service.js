/*@ngInject*/
export default function dataService($http, $q, $log) {

    //check if we are in the actual app or in dev mode in browser
    var downloadsBasePath = 'http://mtgjson.com/json/',
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
        setProgress = function (step, complete) {
            complete = complete || 0;
            progressSteps.currentStep = step;
            var currentStep = progressSteps.steps[step],
                oldComplete = currentStep.complete;

            currentStep.complete = oldComplete + complete;

            if (currentStep.complete === currentStep.count) {
                progressSteps.complete = progressSteps.complete + 1;
            }
            overAllProgressDefer.notify(progressSteps);
        };


    //set required paths on startup
    if (process.env.BUILD_MODE === 'BUILD') {

        path = nw.require('path');
        fs = nw.require('fs');
        request = nw.require('request');
        basePath = nw.App.dataPath;
        cardDataPath = path.join(basePath, 'AllSets-x.json');
        setDataPath = path.join(basePath, 'SET_LIST.json');
    } else if (process.env.BUILD_MODE === 'DEV') {
        cardsPath = require('../../dev_data/AllSets-x.json');
        setsPath = require('../../dev_data/SetList.json');
    } else {
        cardsPath = null;
        setsPath = null;
    }

    function isAvailable() {
        if (process.env.BUILD_MODE === 'BUILD') {
            var cardDataExist = fs.existsSync(cardDataPath);
            var setDataExist = fs.existsSync(setDataPath);
            return cardDataExist && setDataExist;
        }

        return true;
    }

    function unlink(path, promise) {
        if (fs.existsSync(path)) {
            fs.unlink(path, function (error) {
                if (error) {
                    $log.error(error);
                    promise.reject();
                } else {
                    setProgress('cleanUp', 1);
                    promise.resolve();
                }
            });
        } else {
            setProgress('cleanUp', 1);
            promise.resolve();
        }
    }

    function cleanUpCurrentDataFolder() {
        var removeCardDataDefer = $q.defer(),
            removeSetDataDefer = $q.defer(),
            deferredList = [
                removeCardDataDefer,
                removeSetDataDefer
            ];
        setProgress('cleanUp');
        unlink(cardDataPath, removeCardDataDefer);
        unlink(setDataPath, removeSetDataDefer);

        return $q.all(deferredList);
    }

    function getCardVersion() {
        return $http.get(versionsPath);
    }

    function requestToWriteStream(url, streamDest, promise) {
        var writeStream = fs.createWriteStream(streamDest),
            req = request(url)
                .pipe(writeStream);

        req.on('error', function (error) {
            $log.error(error);
            promise.reject();
        });

        writeStream.on('finish', function () {
            setProgress('fetchData', 1);
            promise.resolve();
        });
    }

    function fetchSetDataAndWriteToDisk() {
        var defer = $q.defer();

        setProgress('fetchData');
        requestToWriteStream(setsPath, setDataPath, defer);

        return defer.promise;
    }

    function fetchCardsDataZipAndWriteToDisk() {
        var defer = $q.defer();

        setProgress('fetchData');
        requestToWriteStream(cardsPath, cardDataPath + '.zip', defer);

        return defer.promise;
    }

    function unzipCardData() {
        setProgress('unzipData');
        var DecompressZip = nw.require('decompress-zip'),
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
            path: path.resolve(basePath)
        });
        return defer.promise;
    }

    function removeCardDataZip() {
        var defer = $q.defer();

        setProgress('removeZip');
        unlink(cardDataPath + '.zip', defer);

        return defer.promise;
    }

    function fetchAll() {
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

    function readFile(path, promise) {
        fs.readFile(path, { encoding: 'UTF-8' }, function (error, content) {
            if (error) {
                $log.error(error);
                promise.reject();
            } else {
                promise.resolve(JSON.parse(content));
            }
        });
    }

    function getData(filePath, url, promise) {
        if (process.env.BUILD_MODE === 'BUILD') {
            readFile(filePath, promise);
        } else if (process.env.BUILD_MODE === 'DEV') {
            $http.get(url).then(function (response) {
                promise.resolve(response.data);
            });
        } else {
            promise.resolve('[]');
        }
    }

    function getCardData() {
        var defer = $q.defer();

        getData(cardDataPath, cardsPath, defer);
        return defer.promise;
    }

    function getSetList() {
        var defer = $q.defer();

        getData(setDataPath, setsPath, defer);
        return defer.promise;
    }

    return {
        isAvailable: isAvailable,
        getCardVersion: getCardVersion,
        fetchData: fetchData,
        getCardData: getCardData,
        getSetList: getSetList
    };
};
