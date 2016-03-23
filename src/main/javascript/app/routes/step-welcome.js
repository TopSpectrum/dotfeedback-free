"use strict";

import Ember from 'ember';
import WizardStepRoute from './wizard-step';

/**
 * This is the main entry point
 *
 * @class WelcomeWizardStepRoute
 * @extends WizardStepRoute
 */
export default WizardStepRoute.extend({

    // beforeModel() {
    //     //var applicationModel = this.modelFor('application');
    //     //
    //     //let accepted = Ember.get(applicationModel, 'referralCodeState.accepted');
    //     //let required = Ember.get(applicationModel, 'referralCodeState.required');
    //     //
    //     //if (true === accepted || false === required) {
    //     //
    //     //  this.transitionTo('step-enter-email');
    //     //}
    //     //
    //     //console.log(Ember.get(applicationModel, 'referralCodeState'), accepted, required);
    //     //
    //     //Ember.Logger.debug('applicationModel', applicationModel);
    //     this.transitionTo('step-enter-email');
    // },

    model() {
        return Ember.RSVP.hash({
            state: this._super(),
            isReferralCodeStateBlockingAppUsage: this.get('contextService.isReferralCodeStateBlockingAppUsage')
        });
    },

    actions: {

        next() {
            // The current step needs to be recalculated.
            let isInvalid = this.get('context.isReferralCodeStateBlockingAppUsage');

            if (!isInvalid) {
                this.transitionTo('step-reservation');
            }
        }
    }
});
