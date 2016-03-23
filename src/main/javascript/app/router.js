"use strict";

import Ember from "ember";
import config from "./config/environment";

const Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function () {
    this.route('step-welcome', {
        path: '/'
    });

    this.route('step-reservation', {
        path: '/reservation'
    });

    this.route('step-select-registrar', {
        path: '/registrar'
    });

    this.route('step-checkout', {
        path: '/checkout'
    });

    // this.route('checkout');
    // this.route('complete');
    // this.route('step-submitting');
    //
    // this.route('terms');
    //
    // this.route('privacy');
    //
    // this.route('step-welcome');
    // this.route('step-whois');
    // this.route('abstract-route');
    // this.route('wizard-step');
});

export default Router;
