'use strict';

import Ember from 'ember';

export function initialize(/** @type {Application} */ application) {
    // application.inject('route', 'foo', 'service:foo');

    // http://stackoverflow.com/a/22949859/2407309
    var backspaceIsPressed = false;

    function intercept() {
        if (backspaceIsPressed) {
            Ember.Logger.info('Backspace intercepting');

            backspaceIsPressed = false;

            return "Are you sure you want to leave this page?"
        }
    }

    $(document)
        .keydown(function (event) {
            if (event.which == 8) {
                Ember.Logger.info('Backspace pressed');
                backspaceIsPressed = true;
            }
        })
        .keyup(function (event) {
            if (event.which == 8) {
                Ember.Logger.info('Backspace unpressed');
                backspaceIsPressed = false;
            }
        });

    $(window).on('beforeunload', intercept);

    Ember.Route = Ember.Route.reopen({

        actions: {
            willTransition: function(transition) {
                this._super(...arguments);

                Ember.Logger.info('willTransition in Ember.Route');
                let message = intercept();

                if (message) {
                    if (!confirm(message)) {
                        transition.abort();
                    }
                }
            }
        }
    });

}

export default {
    name: 'prevent-backspace',
    initialize
};
