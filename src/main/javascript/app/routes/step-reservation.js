"use strict";

import Ember from 'ember';
import WizardStepRoute from "./wizard-step";

/**
 * This route needs to determine which component to show.
 *
 *    IF UNKNOWN, show 'wizard-step-referral-code'
 *    IF KNOWN, show 'wizard-step-enter-email'
 *
 * @class StepWhoisRoute
 */
export default WizardStepRoute.extend({

    contextService: Ember.inject.service('context'),

    afterModel(model, transition) {
        let sourceFullDomainName = Ember.get(model, 'sourceFullDomainName');

        if (!Ember.isBlank(sourceFullDomainName)) {
            this.get('contextService')
                .queryForWhois(sourceFullDomainName)
                .then(function () {
                    // TODO: not sure what this is.
                    Ember.set(model, 'newSourceFullDomainName', Ember.get(model, 'sourceFullDomainName'));
                });
        }
    },

    actions: {

        next() {
            debugger;

            this.transitionTo('step-registrar');
        },

        changeSourceFullDomainName(model, sourceFullDomainName) {
            if (Ember.isBlank(sourceFullDomainName)) {
                alert('Please enter a valid domain name');
                return;
            }

            let contextService = this.get('contextService');

            contextService.queryForWhois(sourceFullDomainName);
        }
    }
});
