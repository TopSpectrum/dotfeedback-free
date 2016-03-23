"use strict";

import Ember from 'ember';

export default Ember.Route.extend({

    context: Ember.inject.service('context'),

    referralCodeState: Ember.computed.alias('context.model.referralCodeState'),

    beforeModel(transition) {
        let referralCodeState = this.get('referralCodeState');

        if (referralCodeState) {
            return;
        }

        var accepted = Ember.get(referralCodeState, 'accepted');
        var required = Ember.get(referralCodeState, 'required');

        if (accepted || !required) {
            // They have accepted, or are not required to.
            return this.transitionTo('step-enter-email');
        } else {
            // They have not accepted, but are required to.
            if ('index' !== transition.targetName) {
                return this.transitionTo('index`');
            }
        }
    },

    model() {
        var model = this.get('context.model');

        return Ember.RSVP.Promise.resolve(model);
    }
});
