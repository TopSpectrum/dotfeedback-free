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

    this.route('step-registrar', {
        path: '/registrar'
    });

    this.route('step-checkout', {
        path: '/checkout'
    });

    this.route('step-finished', {
        path: '/finished'
    });

    this.route('terms');
    this.route('privacy');

    this.route('manage');
});

export default Router;
