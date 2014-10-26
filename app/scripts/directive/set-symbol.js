'use strict';

angular.module('mtgApp')
  .directive('setSymbol', function () {

    var mtgSetSymbols = {'LEA':['c','u','r'],'LEB':['c','u','r'],'ARN':['c','u','r'],'2ED':['c','u','r'],'pDRC':[],'ATQ':['c','u','r'],'3ED':['c','u','r'],'LEG':['c','u','r'],'DRK':['c','u','r'],'pMEI':['c','u','m','s'],'FEM':['c','u','r'],'pLGM':['c','u','r','s'],'4ED':['c','u','r'],'ICE':['c','u','r'],'CHR':['c','u','r'],'HML':['c','u','r'],'ALL':['c','u','r'],'RQS':[],'pARL':['c','u','r','s'],'pCEL':[],'MIR':['c','u','r'],'MGB':[],'ITP':[],'VIS':['c','u','r'],'5ED':['c','u','r'],'pPOD':['c','u','r','s'],'POR':['c','u','r'],'VAN':['s'],'WTH':['c','u','r'],'pPRE':[],'TMP':['c','u','r'],'STH':['c','u','r'],'PO2':['c','u','r'],'pJGP':[],'EXO':['c','u','r'],'UGL':['c','u','r'],'pALP':[],'USG':['c','u','r'],'ATH':['c','u','r','s'],'ULG':['c','u','r'],'6ED':['c','u','r'],'PTK':['c','u','r'],'UDS':['c','u','r'],'S99':['c','u','r'],'pGRU':[],'pWOR':['c','u','r','s'],'pWOS':[],'MMQ':['c','u','r'],'BRB':['c','u','r'],'pSUS':['c','u','r','s'],'pFNM':[],'pELP':[],'NMS':['c','u','r'],'S00':['c','u','r'],'PCY':['c','u','r'],'BTD':['c','u','r'],'INV':['c','u','r'],'PLS':['c','u','r'],'7ED':['c','u','r'],'pMPR':[],'APC':['c','u','r'],'ODY':['c','u','r'],'DKM':['c','u','r','s'],'TOR':['c','u','r'],'JUD':['c','u','r'],'ONS':['c','u','r'],'LGN':['c','u','r'],'SCG':['c','u','r'],'pREL':[],'8ED':['c','u','r'],'8BS':[],'MRD':['c','u','r'],'DST':['c','u','r'],'5DN':['c','u','r'],'CHK':['c','u','r'],'UNH':['c','u','r','s'],'BOK':['c','u','r'],'SOK':['c','u','r'],'9ED':['c','u','r'],'9BS':[],'RAV':['c','u','r'],'p2HG':['c','u','r','s'],'pWPN':[],'GPT':['c','u','r'],'pCMP':[],'DIS':['c','u','r'],'CSP':['c','u','r'],'CST':[],'TSP':['c','u','r'],'TSB':['s'],'pHHO':['c','u','r','m','s'],'PLC':['c','u','r'],'pPRO':[],'pGPX':[],'FUT':['c','u','r'],'10E':['c','u','r'],'pMGD':[],'MED':['c','u','r'],'LRW':['c','u','r'],'EVG':['c','u','r'],'pLPA':[],'MOR':['c','u','r'],'p15A':[],'SHM':['c','u','r'],'pSUM':['c','u','r','s'],'EVE':['c','u','r'],'DRB':['c','u','r','m'],'ME2':['c','u','r'],'ALA':['c','u','r','m'],'DD2':['c','u','r','m'],'CON':['c','u','r','m'],'DDC':['c','u','r','m'],'ARB':['c','u','r','m'],'M10':['c','u','r','m'],'V09':['c','u','r','m'],'HOP':['c','u','r','s'],'ME3':['c','u','r'],'ZEN':['c','u','r','m'],'DDD':['c','u','r','m'],'H09':['c','u','r','m'],'WWK':['c','u','r','m'],'DDE':['c','u','r','m'],'ROE':['c','u','r','m'],'DPA':['c','u','r','s'],'ARC':['c','u','r'],'M11':['c','u','r','m'],'V10':['c','u','r','m'],'DDF':['c','u','r','m'],'SOM':['c','u','r','m'],'PD2':['c','u','r','m'],'ME4':['c','u','r'],'MBS':['c','u','r','m'],'DDG':['c','u','r','m'],'NPH':['c','u','r','m'],'CMD':['c','u','r','m'],'M12':['c','u','r','m'],'V11':['c','u','r','m'],'DDH':['c','u','r','m'],'ISD':['c','u','r','m'],'PD3':['c','u','r','m'],'DKA':['c','u','r','m'],'DDI':['c','u','r','m'],'AVR':['c','u','r','m'],'PC2':['c','u','r','m'],'M13':['c','u','r','m'],'V12':['c','u','r','m'],'DDJ':['c','u','r','m'],'RTR':['c','u','r','m'],'CM1':['c','u','r','m'],'GTC':['c','u','r','m'],'DDK':['c','u','r','m'],'pWCQ':['c','u','r','m','s'],'DGM':['c','u','r','m'],'MMA':['c','u','r','m'],'M14':['c','u','r','m'],'V13':['c','u','r','m'],'DDL':['c','u','r','m'],'THS':['c','u','r','m'],'C13':['c','u','r','m'],'BNG':['c','u','r','m'],'DDM':['c','u','r','m'],'JOU':['c','u','r','m'],'MD1':['c','u','r','m'],'CNS':['c','u','r','m'],'VMA':['c','u','r','m','s'],'M15':['c','u','r','m','s'],'V14':['m'],'DDN':['c','u','r','m'],'KTK':['c','u','r','m']};


    return {
      restrict: 'E',
      templateUrl: '/templates/set-symbol.html',
      replace: true,
      scope: {
        'setCode': '@',
        'size': '@',
        'showTip': '@',
        'tipText': '@',
        'tipAppearance': '@'
      },
      controller: ['$scope', function ($scope) {
        $scope.$watch('setCode', function(){
          $scope.rarity = mtgSetSymbols[$scope.setCode][0] || null;
        });
      }]
    };
  });
