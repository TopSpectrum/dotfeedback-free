'use strict';

import Ember from "ember";
import EmberValidations, {validator} from "ember-validations";
import DomainNameUtil from '../../utils/domain-name-util';
import CountryUtil from '../../utils/country-util';

import libphonenumber from 'npm:google-libphonenumber';

let PhoneNumberFormat = libphonenumber.PhoneNumberFormat;
let PhoneNumberUtil = libphonenumber.PhoneNumberUtil.getInstance();

export default Ember.Controller.extend(EmberValidations, {

    contextService: Ember.inject.service('context'),

    queryParams: ['protectedFor', 'approvedBy', 'website'],

    //region Validations
    validations: {
        'name': {presence: true},
        'email': {
            presence: true,
            inline: validator(function() {
                let email = this.get('email');

                if (!email) {
                    return;
                }

                if (!DomainNameUtil.isEmail(email)) {
                    return 'Must have a valid email';
                }
            })},
        'street': {presence: true},
        'city': {presence: true},
        // 'state': {presence: true},
        'postal': {presence: true},
        'country': {
            presence: true,

            inline: validator(function() {
                let value = this.get('country');

                if (!value) {
                    return;
                }

                if (!CountryUtil.isValidCountryString(value)) {
                    return 'Please enter a valid country code';
                }
            })
        },
        'phone': {
            presence: true,

            inline: validator(function() {
                let value = this.get('phone');

                if (!value) {
                    return;
                }

                // Parse number with country code.
                var phoneNumber = PhoneNumberUtil.parse(value, 'US');

                // Print number in the international format.
                if (!PhoneNumberUtil.isValidNumber(phoneNumber)) {
                    return 'Please enter a valid phone number.'
                }
            })


        }
    },

    focused: false,
    name: Ember.computed.alias('model.reservation.name'),
    email: Ember.computed.alias('model.email'),
    street: Ember.computed.alias('model.reservation.street'),
    city: Ember.computed.alias('model.reservation.city'),
    state: Ember.computed.alias('model.reservation.state'),
    postal: Ember.computed.alias('model.reservation.postal'),
    country: Ember.computed.alias('model.reservation.country'),
    phone: Ember.computed.alias('model.reservation.phone'),
    //endregion

    //region Properties
    /**
     * @type {Boolean}
     */
    disabled: Ember.computed('acceptedTerms', 'isValid', function () {
        let acceptedTerms = this.get('acceptedTerms');
        let isValid = this.get('isValid');

        return !acceptedTerms || !isValid;
    }),

    /**
     * @type {Boolean}
     */
    preventEdits: Ember.computed('spinning', function() {
        return this.get('spinning');
    }),

    /**
     * @type {String}
     */
    validatedEmail: Ember.computed('model.email', function() {
        let email = this.get('model.email');

        if (DomainNameUtil.isEmail(email)) {
            return email;
        }

        return null;
    }),
    //endregion

    //region Actions
    actions: {
        attemptNext() {
            let self = this;

            // this.transitionToRoute('protected-registrations.finished');

            self.set('spinning', true);

            Ember.RSVP.Promise.resolve()
                .then(() => {
                    let record = self.get('model.reservation');

                    return record.save();
                })
                .then(() => {
                    self.transitionToRoute('protected-registrations.finished');
                })
                .catch((err) => {
                    self.set('error', err);
                })
                .finally(() => {
                    self.set('spinning', false);
                });


            Ember.RSVP.Promise.resolve(Ember.$.ajax({
                method: 'POST',
                url: '/api/v1/protected-registrations',
                data: {

                }
            }));
        }
    }
    //endregion
});
