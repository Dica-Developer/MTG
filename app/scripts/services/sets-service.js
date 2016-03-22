'use strict';

angular.module('mtgApp')
  .service('sets', ['$q', 'data', function ($q, data) {
    var setsDb = TAFFY();

    function filter() {
      return setsDb().order('releaseDate desc').get();
    }

    function prepareDataBase() {
      var defer = $q.defer();
      if (setsDb().count() === 0) {
        data.getSetList().then(function (setsData) {
          defer.notify('Fill sets database with ' + setsData.length + ' cards.');
          setsDb.insert(setsData);
          defer.notify('Presort sets database by release date.');
          setsDb.sort('releaseDate desc');
          defer.resolve();
        });
      } else {
        defer.resolve();
      }
      return defer.promise;
    }

    return {
      filter: filter,
      prepareDataBase: prepareDataBase
    };
  }]);
