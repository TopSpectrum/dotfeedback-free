"use strict";

import Ember from "ember";
import config from "./config/environment";

const Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function () {
    this.route('step-enter-email', {path: '/email'});

    this.route('step-select-domains', {path: '/domains'}, function () {
        this.route('whois', {
            resetNamespace: true
        });
    });

    this.route('step-select-registrar', {path: '/registrar'});

    this.route('step-check-email');

    this.route('step-checkout', {path: '/checkout'});

    this.route('checkout');
    this.route('complete');
    this.route('step-submitting');
    
    this.route('terms');

    this.route('privacy');

});

export default Router;
