"use strict";

import Ember from "ember";
import EmberValidations, {validator} from "ember-validations";
import domainParser from "javascript/utils/utility-domain-parser";

var EMAIL_PATTERN = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.([a-z]{2,10}))$/;

export default Ember.Controller.extend(EmberValidations, {

    validations: {
        'model.email': {
            presence: true,
            inline: validator(function () {
                let value = this.model.get(this.property);
                if (!value) {
                    return;
                }

                if (!EMAIL_PATTERN.test(value)) {
                    this.errors.pushObject('Please enter a valid email');
                    return;
                }

                // Trim past the @ and grab the domain.

                let index = value.indexOf('@') + 1;
                let suffix = value.substring(index);
                let parsedObject = domainParser(suffix);

                if (!parsedObject) {
                    //  Hmm, that's not right.
                    this.errors.pushObject('Please enter a valid email');
                }
            })
        }
    },

    actions: {
        next()
        {
            if (!this.get('isValid')) {
                Ember.Logger.warn("NotValid for transition");

                // TODO: We have to show the errors somehow.
                return false;
            }

            let email = this.get('model.email');
            let result = email.substring(email.indexOf('@') + 1);
            let parsedObject = domainParser(result);

            if (!parsedObject) {
                Ember.Logger.warn('The domain name was not parsable.');
                return;
            }

            // is this a public one?
            if (!parsedObject['public']) {
                this.set('model.sourceFullDomainName', parsedObject.fullDomainName);
                this.set('model.destinationCustomerDomainName', parsedObject.customerDomainName);
                this.set('model.newDestinationCustomerDomainName', parsedObject.customerDomainName);
                this.set('model.destinationFullDomainName', parsedObject.customerDomainName + '.feedback');
            }

            Ember.Logger.debug('transitioning to step-select-domains');
            this.transitionToRoute('step-select-domains');
        }
    }
});
