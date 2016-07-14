'use strict';

import Ember from 'ember';

let EMAIL_PATTERN = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.([a-z]{2,10}))$/;

export default function(/** @type {String} */string) {
    if (!string || 'string' != Ember.typeOf(string)) {
        return false;
    }

    return EMAIL_PATTERN.test(string);
}
