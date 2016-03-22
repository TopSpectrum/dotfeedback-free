"use strict";

import Ember from 'ember';

export default Ember.Route.extend({

    beforeModel() {
       this._super(...arguments);

       var model = this.modelFor('application');
       var waitingOnEmail = Ember.get(model, 'waitingOnEmail');

       if (!waitingOnEmail) {
           Ember.Logger.warn('Are not \'waitingOnEmail\', so returning to the index route.');
           this.transitionTo('index');
       }
    },

    model() {
        return this.modelFor('application');
    },

    actions: {
        willTransition(transition) {
            transition.abort();
        }
    }

});
