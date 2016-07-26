import Ember from "ember";

import WizardStepRoute from '../wizard-step';

export default WizardStepRoute.extend({

    beforeModel(transition) {
        let self = this;

        if (self.get('contextService.hasActiveOrder')) {
            return;
        }

        let model = self.get('contextService.model');
        let reservation = self.get('model.reservation');

        if (transition && transition.queryParams) {
            return;
        }

        return super.beforeModel(...arguments);
    },

    model(params) {
        let approvedBy = params.approvedBy;
        let protectedFor = params.protectedFor;
        let website = params.website;
        /**

         * @type {DS.Store}
         */
        let store = this.get('store');
        let self = this;

        let model = this.get('contextService.model');
        let reservation = model.get('reservation');

        if (reservation) {
            return model;
        }

        return Ember.RSVP.Promise
            .resolve(Ember.$.ajax({
                url: '/api/v1/protected-registrations',
                data: {
                    approvedBy,
                    protectedFor,
                    website
                }
            }))
            .then((reservation) => {
                store.pushPayload({
                    reservation: reservation
                });

                let record = store.peekRecord('reservation', reservation.id);

                record.set('approvedBy', approvedBy);
                record.set('protectedFor', protectedFor);

                model.set('email', record.get('email'));
                model.set('reservation', record);

                return model;
            });
    }
});
