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
        var filePath = nw.process.mainModule.filename;

        path = nw.require('path');
        fs = nw.require('fs');
        request = nw.require('request');
        basePath = filePath.substring(0, filePath.indexOf('.nw') + 3);
        cardDataPath = path.join(basePath, 'AllSets-x.json');
        setDataPath = path.join(basePath, 'SET_LIST.json');
    } else if (process.env.BUILD_MODE === 'DEV') {
        cardsPath = require('../../dev_data/AllSets-x.json');
        setsPath = require('../../dev_data/SET_LIST.json');
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

    //TODO reduce complexity
    function cleanUpCurrentDataFolder() {
        var removeCardDataDefer = $q.defer(),
            removeSetDataDefer = $q.defer(),
            deferredList = [
                removeCardDataDefer,
                removeSetDataDefer
            ];
        setProgress('cleanUp');
        if (fs.existsSync(cardDataPath)) {
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

        if (fs.existsSync(setDataPath)) {
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

        if (fs.existsSync(cardDataPath + '.zip')) {
            fs.unlink(cardDataPath + '.zip', function (error) {
                if (error) {
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

    function getCardData() {
        var defer = $q.defer();
        if (process.env.BUILD_MODE === 'BUILD') {
            fs.readFile(cardDataPath, { encoding: 'UTF-8' }, function (error, content) {
                if (error) {
                    $log.error(error);
                    defer.reject();
                } else {
                    defer.resolve(JSON.parse(content));
                }
            });
        } else if (process.env.BUILD_MODE === 'DEV') {
            $http.get(cardsPath).then(function (cardData) {
                defer.resolve(cardData.data);
            });
        } else {
            defer.resolve('[]');
        }

        return defer.promise;
    }

    function getSetList() {
        var defer = $q.defer();
        if (process.env.BUILD_MODE === 'BUILD') {
            fs.readFile(setDataPath, { encoding: 'UTF-8' }, function (error, content) {
                if (error) {
                    $log.error(error);
                    defer.reject();
                } else {
                    defer.resolve(JSON.parse(content));
                }
            });
        } else if (process.env.BUILD_MODE === 'DEV') {
            $http.get(setsPath).then(function (setData) {
                defer.resolve(setData.data);
            });
        } else {
            defer.resolve('[]');
        }
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
