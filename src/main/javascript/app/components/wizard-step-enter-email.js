"use strict";

import Ember from "ember";
import { validator } from "ember-validations";
import AbstractWizardStep from './abstract-wizard-step';
import DomainNameUtil from '../utils/domain-name-util';

export default AbstractWizardStep.extend({

    classNames: ['row'],

    validations: {
        'model.emailOrDomainNameOrUrl': {
            presence: true,
            inline: validator(function () {
                /**
                 * @type {String}
                 */
                let string = this.model.get(this.property);
                if (!string) {
                    return;
                }

                string = string.toLowerCase();

                string = DomainNameUtil.toValidFullDomainName(string);

                if (!string || !DomainNameUtil.isValidFullDomainName(string)) {
                    this.errors.pushObject('Please enter a valid email');
                }
            })
        }
    },

    actions: {
        next() {
            if (!this.get('isValid')) {
                Ember.Logger.warn("NotValid for transition");

                // TODO: We have to show the errors somehow.
                return false;
            }

            /**
             * @type {string}
             */
            let emailOrDomainNameOrUrl = (this.get('model.emailOrDomainNameOrUrl') || '').toLowerCase();
            let emailMode;

            if (DomainNameUtil.isEmail(emailOrDomainNameOrUrl)) {
                this.set('model.email', emailOrDomainNameOrUrl);
                emailMode = true;
            } else {
                this.set('model.email', null);
                emailMode = false;
            }

            let fullDomainName = DomainNameUtil.toValidFullDomainName(emailOrDomainNameOrUrl);
            let parsedObject = DomainNameUtil.parse(fullDomainName);

            if (!parsedObject) {
                Ember.Logger.warn('The domain name was not parsable.');
                return false;
            }

            // is this a public one?
            if (!parsedObject.public || !emailMode) {
                this.set('model.sourceFullDomainName', parsedObject.fullDomainName);
                this.set('model.destinationCustomerDomainName', parsedObject.customerDomainName);
                this.set('model.newDestinationCustomerDomainName', parsedObject.customerDomainName + '.feedback');
                this.set('model.newDestinationFullDomainName', parsedObject.customerDomainName + '.feedback');
                this.set('model.destinationFullDomainName', parsedObject.customerDomainName + '.feedback');
            }

            Ember.Logger.debug('transitioning to next step');

            // Send the default unnamed action.
            this.sendAction();
        }
    }
});
