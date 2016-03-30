import CardModalTplUrl from '../../templates/card-modal.ejs';

/*@ngInject*/
export default function CardDetailsDialogService($uibModal) {
    this.show = (card) => {

        $uibModal.open({
            templateUrl: CardModalTplUrl,
            controller: 'CardModalController',
            size: 'lg',
            resolve: {
                card: function () {
                    return card;
                }
            }
        });
    }
};