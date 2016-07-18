import Ember from "ember";

export default Ember.Route.extend({

    contextService: Ember.inject.service('context'),

    model(params) {
        let approvedBy = params.approvedBy;
        let protectedFor = params.protectedFor;
        let website = params.website;
        /**

         * @type {DS.Store}
         */
        let store = this.get('store');
        let self = this;

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

                let model = self.get('contextService.model');

                model.set('email', record.get('email'));
                model.set('reservation', record);

                return model;
            });
    }

});
