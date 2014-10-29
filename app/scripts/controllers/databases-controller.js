'use strict';

angular.module('mtgApp')
.controller('DatabasesController', ['$scope', 'decks', 'ownCards', function($scope, decks, ownCards){
    $scope.downloadData = function(){
      var dataToExport = {
        decks: decks.exportData(),
        ownCards: ownCards.getAll()
      };

      var blob = new Blob([JSON.stringify(dataToExport)], {type: "application/json;charset=utf-8"});
      saveAs(blob, "databases.json");
    };
    $scope.getAsText = function(event, files) {
      var  readFile = files[0],
        reader = new FileReader();
      reader.readAsText(readFile, "UTF-8");
      reader.onload = function(event){
        var data = JSON.parse(event.target.result);
        decks.importData(data.decks);
        ownCards.importData(data.ownCards);
      };
    };
  }]);
