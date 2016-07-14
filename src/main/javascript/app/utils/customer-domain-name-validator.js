'use strict';

import Ember from 'ember';

let customerDomainNameRegex = /^[\w-]+$/;

export default function (/** @type {String} */ string) {

    if (!string || 'string' === Ember.typeOf(string)) {
        return false;
    }

    return customerDomainNameRegex.test(string);
}
