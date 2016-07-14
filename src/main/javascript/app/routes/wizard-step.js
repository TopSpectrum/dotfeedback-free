"use strict";

import Ember from 'ember';

/**
 * Abstract base class for all wizard-step routes
 *
 * @class WizardStepRoute
 */
export default Ember.Route.extend({

    contextService: Ember.inject.service('context'),

    /**
     *
     * @param {Ember.Transition} transition
     */
    beforeModel(transition) {
        let targetName = Ember.get(transition, 'targetName');

        if (targetName === 'step-welcome') {
            return;
        }

        /**
         * @type {boolean}
         */
        let hasActiveOrder = this.get('contextService.hasActiveOrder');

        if (!hasActiveOrder) {
            this.transitionTo('step-welcome');
        }
    },

    model() {
        return this.get('contextService.model');
    },

    actions: {
        willTransition() {
            this._super(...arguments);

            this.refresh();
        }
    }
});
