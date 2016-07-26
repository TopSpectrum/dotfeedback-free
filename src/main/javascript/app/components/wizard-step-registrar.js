"use strict";

import Ember from "ember";
import InboundActions from "ember-component-inbound-actions/inbound-actions";
import AbstractWizardStep from './abstract-wizard-step';

export default AbstractWizardStep.extend(InboundActions, {

    store: Ember.inject.service(),

    contextService: Ember.inject.service('context'),

    disabled: Ember.computed('model.suggestedReservationMode', 'acceptedTerms', function() {
        let suggestedReservationMode = this.get('model.suggestedReservationMode');
        let acceptedTerms = this.get('acceptedTerms');

        if (suggestedReservationMode) {
            return false;
        }

        return !acceptedTerms;
    }),

    actions: {

        attemptNext() {
            let disabled = this.get('disabled');

            if (disabled) {
                return;
            }

            this.set('model.registrar', 'internetbs');

            let store = this.get('store');

            let reservation = store.createRecord('reservation', {
                sourceFullDomainName: this.get('model.sourceFullDomainName'),
                destinationFullDomainName: this.get('model.destinationFullDomainName'),

                'referralCode': this.get('model.referralCodeState.code'),
                'registrar': this.get('model.registrar'),
                'name': this.get('model.sourceFullDomainNameRecord.name'),
                'email': this.get('model.email'),
                //'sourceFullDomainName': DS.attr(),
                //'destinationFullDomainName': DS.attr(),
                'street': this.get('model.sourceFullDomainNameRecord.street'),
                'city': this.get('model.sourceFullDomainNameRecord.city'),
                'state': this.get('model.sourceFullDomainNameRecord.state'),
                'postal': this.get('model.sourceFullDomainNameRecord.postal'),
                'country': this.get('model.sourceFullDomainNameRecord.country'),
                'phone': this.get('model.sourceFullDomainNameRecord.phone'),
                'phoneExt': this.get('model.sourceFullDomainNameRecord.phoneExt'),
                'fax': this.get('model.sourceFullDomainNameRecord.fax'),
                'affiliateCode': this.get('model.affiliateCode'),
                'suggestionMode': this.get('model.suggestedReservationMode'),
                'faxExt': this.get('model.sourceFullDomainNameRecord.faxExt')
                //'fingerprint': DS.attr(),
                //'remoteHost': DS.attr(),
            });

            let scope = this;

            this.set('spinning', true);

            //Ember.RSVP.Promise.cast(
            //  Ember.$.ajax({
            //    url: '/api/v1/submit',
            //    method: 'POST',
            //    data: JSON.stringify(model)
            //  }))

            reservation.save()
                .then(function () {
                    // We are ready for confirmation
                    scope.set('model.waitingOnEmail', true);
                    scope.set('spinning', true);
                    scope.set('model.reservation', reservation);

                    scope.sendAction();
                })
                .catch(function (err) {
                    alert('There was a problem submitting your request. Please try again.');
                    scope.set('spinning', false);
                    Ember.Logger.debug('Error', err);
                });
        }
    }
});
