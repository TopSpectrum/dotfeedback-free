"use strict";

import Ember from "ember";

export default Ember.Route.extend({

    model() {
        return Ember.RSVP.Promise.cast(
            Ember.$.ajax({
                url: '/api/v1/terms'
            }));
    }

});
