"use strict";

import Ember from 'ember';
import WizardStepRoute from './wizard-step';

/**
 * @class step-finished
 */
export default WizardStepRoute.extend({

    contextService: Ember.inject.service('context'),

    // /**
    //  *
    //  * @param {Ember.Transition} transition
    //  */
    // beforeModel() {
    //    this._super(...arguments);
    //
    //    var waitingOnEmail = this.get('model.waitingOnEmail');
    //
    //    if (!waitingOnEmail) {
    //        Ember.Logger.warn('Are not \'waitingOnEmail\', so returning to the index route.');
    //
    //        this.transitionTo('step-welcome');
    //    }
    // },

    actions: {
        willTransition(transition) {
            this.get('contextService').reset();

            let targetName = Ember.get(transition, 'targetName');

            if ('step-welcome' !== targetName) {
                transition.abort();

                this.transitionTo('step-welcome');
            }
        }
    }
});
