"use strict";

import Ember from 'ember';

export default Ember.Component.extend({

    emailOrAllDisabled: Ember.computed('model.disabled', 'model.emailDisabled', function() {
        let disabled1 = this.get('disabled');
        let disabled2 = this.get('emailDisabled');

        return disabled1 || disabled2;
    }),

    actions: {
        selectEmailAlternative(email) {
            this.set('email', email);
        }
    }

});
