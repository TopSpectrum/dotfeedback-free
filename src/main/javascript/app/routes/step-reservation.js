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

    beforeModel() {
        let model = this.modelFor('application');
        let sourceFullDomainName = Ember.get(model, 'email');

        if (!sourceFullDomainName) {
            Ember.Logger.warn('Could not determine the \'email\', so returning to the index route.');
            this.transitionTo('step-welcome');
        }
    },

    model() {
        return this.modelFor('application');
    },

    afterModel(model, transition) {
        let sourceFullDomainName = Ember.get(model, 'sourceFullDomainName');

        if (!Ember.isBlank(sourceFullDomainName)) {
            this.query(model)
                .then(function () {
                    Ember.set(model, 'newSourceFullDomainName', Ember.get(model, 'sourceFullDomainName'));
                });
        }
    },

    peekAndFind(recordType, recordId) {
        var scope = this;

        return Ember.RSVP.Promise
            .resolve(this.store.peekRecord(recordType, recordId))
            .then(function (record) {
                if (record) {
                    return Ember.RSVP.Promise.resolve(record);
                } else {
                    return scope.store.findRecord(recordType, recordId);
                }
            });
    },

    query: function (model, sourceFullDomainName) {
        if (Ember.isBlank(sourceFullDomainName)) {
            sourceFullDomainName = Ember.get(model, 'sourceFullDomainName');
        }

        if (Ember.isBlank(sourceFullDomainName)) {
            return Ember.RSVP.Promise.resolve();
        }

        var scope = this;
        var destinationFullDomainName = Ember.get(model, 'destinationFullDomainName');

        Ember.set(model, 'fetchingSourceFullDomainNameRecord', true);
        Ember.set(model, 'chooseDifferentSourceFullDomainNameMode', false);

        return this.peekAndFind('whois', sourceFullDomainName)
            .then(function (whoisRecord) {
                return scope.peekAndFind('availability', destinationFullDomainName)
                    .then(function (availabilityRecord) {
                        Ember.set(model, 'sourceFullDomainName', sourceFullDomainName);
                        Ember.set(model, 'sourceFullDomainNameRecord', whoisRecord);
                        Ember.set(model, 'fetchingSourceFullDomainNameRecord', false);
                        Ember.set(model, 'sourceFullDomainNameRecord.email', Ember.get(model, 'email'));
                        Ember.set(model, 'destinationAvailabilityRecord', availabilityRecord);
                    });
            })
            .catch(function (err) {
                //if (console) {
                //  console.log(err);
                //}

                alert('There was an unknown server error. Please try again.');

                Ember.set(model, 'sourceFullDomainNameRecord', new Ember.Object());
                Ember.set(model, 'sourceFullDomainNameRecord.failedToResolve', true);
                Ember.set(model, 'fetchingSourceFullDomainNameRecord', false);
            });
    },

    actions: {
        changeSourceFullDomainName(model, sourceFullDomainName) {
            if (Ember.isBlank(sourceFullDomainName)) {
                alert('Please enter a valid domain name');
                return;
            }

            this.query(model, sourceFullDomainName);
        }
    }
});
