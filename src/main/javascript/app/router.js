"use strict";

import Ember from "ember";
import config from "./config/environment";

const Router = Ember.Router.extend({
    location: config.locationType
});

/**
 * @class Router
 */
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

    this.route('protected-registrations', function () {
        this.route('review');
    });


    





    /*
     * THIS WILDCARD ROUTE MUST BE THE LAST ROUTE!
     */
    this.route('not-found', {
        path: '/*path'
    });
});

export default Router;
