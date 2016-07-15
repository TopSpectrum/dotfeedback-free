"use strict";

import Ember from 'ember';

export default Ember.Component.extend({

    onInit: function() {
        this.set('initialEmail', this.get('email'));
    }.on('init'),

    actions: {
        selectEmailAlternative(email) {
            this.set('email', email);
        }
    }

});
