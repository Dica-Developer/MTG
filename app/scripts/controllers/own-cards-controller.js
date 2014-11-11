'use strict';

angular.module('mtgApp')
  .controller('OwnCardsController', [
    '$scope',
    '$modal',
    'cards',
    'ownCards',
    function ($scope, $modal, cards, ownCards) {
      var ownCardsTmpDB = TAFFY();
      ownCardsTmpDB.insert(cards.filter({
        multiverseid: _.map(_.pluck(ownCards.getAll(), 'multiverseid'), Number)
      }));
      $scope.scope = $scope;
      $scope.db = ownCardsTmpDB;
      $scope.filteredCards = [];
      $scope.maxResultLength = 20;
      $scope.currentPage = 1;
      $scope.cards = [];
      $scope.totalItems = 0;
      $scope.filterCollapsed = true;

      function updateList() {
        $scope.cards = $scope.filteredCards.slice(($scope.currentPage - 1) * $scope.maxResultLength, $scope.currentPage * $scope.maxResultLength);
        $scope.totalItems = $scope.filteredCards.length;
      }

      $scope.showCardModal = function (card) {

        $modal.open({
          templateUrl: '/templates/card-modal.html',
          controller: 'CardModalController',
          size: 'lg',
          resolve: {
            card: function () {
              return card;
            }
          }
        });
      };

      $scope.$watch('currentPage', updateList);
      $scope.$watch('maxResultLength', updateList);
      $scope.$watch('filterUpdateTimeStamp', updateList);
    }
  ]);
