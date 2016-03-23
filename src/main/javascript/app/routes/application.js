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
    },

    actions: {

        clearCookies() {
            // http://stackoverflow.com/questions/179355/clearing-all-cookies-with-javascript
            var cookieString = document.cookie;

            if (!Ember.isBlank(cookieString)) {
                var cookies = cookieString.split(";");
                
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i];
                    var eqPos = cookie.indexOf("=");
                    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                }
            }

            document.location.reload();
        }
    }
});
