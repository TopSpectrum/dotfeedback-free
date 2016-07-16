"use strict";

import Ember from "ember";
import DS from "ember-data";

/**
 * @class ContextModel
 * @extends Ember.Object
 */
let ContextModel = window.ContextModel = Ember.Object.extend({

    suggestedReservationMode: Ember.computed('affiliateCode', function () {
        return -1 != (this.get('affiliateCode') || '').indexOf(':');
    })

});

export default Ember.Service.extend({

    // referralCodeState: null,
    store: Ember.inject.service('store'),

    model: null,

    init() {
        this._super(...arguments);

        this.set('intro', DS.PromiseObject.create({
            promise: Ember.RSVP.Promise.resolve(Ember.$.ajax({
                url: '/api/v1/intro'
            }))
        }));

        this.set('termsAndConditions', DS.PromiseObject.create({
            promise: Ember.RSVP.Promise.resolve(Ember.$.ajax({
                url: '/api/v1/terms'
            }))
                .then((string) => {
                    return {
                        value: string
                    }
                })
        }));

        this.reset();

        this.set('termsAndConditionsUrl', '/api/v1/terms');
    },

    /**
     *
     * @param {String} [sourceFullDomainName]
     * @returns {Promise<Whois>}
     */
    queryForWhois: function (sourceFullDomainName) {
        /**
         * @type {ContextModel}
         */
        let model = this.get('model');

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

        let promise = Ember.RSVP.Promise.resolve();

        if (!Ember.isBlank(destinationFullDomainName)) {
            promise = promise.then(() => {
                scope.peekAndFindRecord('availability', destinationFullDomainName)
                    .then(function (availabilityRecord) {

                        Ember.set(model, 'destinationAvailabilityRecord', availabilityRecord);
                        Ember.set(model, 'sourceFullDomainName', sourceFullDomainName);

                        return null;
                    });
            });
        } else {
            promise = promise.then(() => {
                Ember.set(model, 'sourceFullDomainName', sourceFullDomainName);
            });
        }

        promise = promise.then(() => {
            scope.peekAndFindRecord('whois', sourceFullDomainName)
                .then(function (whoisRecord) {
                    Ember.set(model, 'sourceFullDomainNameRecord', whoisRecord);
                    Ember.set(model, 'sourceFullDomainNameRecord.email', Ember.get(model, 'email'));
                    Ember.set(model, 'fetchingSourceFullDomainNameRecord', false);
                });
        });

        return promise.catch(function (err) {
            //if (console) {
            //  console.log(err);
            //}
            debugger;
            // alert('There was an unknown server error. Please try again.');
            Ember.Logger.error(err);
            console.error(err);

            Ember.set(model, 'sourceFullDomainNameRecord', new Ember.Object());
            Ember.set(model, 'sourceFullDomainNameRecord.failedToResolve', true);
            Ember.set(model, 'fetchingSourceFullDomainNameRecord', false);
        });
    },

    /**
     *
     * @param {String} recordType
     * @param {*} recordId
     * @returns {*|Promise|Promise.<TResult>}
     */
    peekAndFindRecord(recordType, recordId) {
        let scope = this;
        let store = this.get('store');

        if (!recordId) {
            debugger;
            throw new Error('The recordId must be defined');
        }

        return Ember.RSVP.Promise
            .resolve(store.peekRecord(recordType, recordId))
            .then(function (record) {
                if (record) {
                    return Ember.RSVP.Promise.resolve(record);
                } else {
                    return store.findRecord(recordType, recordId);
                }
            });
    },

    hasActiveOrder: Ember.computed('model.emailOrDomainNameOrUrl', function () {
        return !Ember.isBlank(this.get('model.emailOrDomainNameOrUrl'));
    }).readOnly(),

    hasValidReferralCode: Ember.computed('model.referralCodeState.accepted', function () {
        let accepted = this.get('model.referralCodeState.accepted');

        // TODO: We will add more sophisticated detection here.

        return !!accepted;
    }).readOnly(),

    isReferralCodeStateBlockingAppUsage: Ember.computed('model.skipReferralCode', 'hasValidReferralCode', function () {
        let skip = this.get('model.skipReferralCode');
        let hasValid = this.get('hasValidReferralCode');

        if (skip) {
            return false;
        }

        return !hasValid;

    }).readOnly(),


    reset() {
        this.set('model', new ContextModel());

        this.set('model.intro', this.get('intro'));
        this.set('model.skipReferralCode', true);
        this.set('model.allowAnyReferralCode', true);
        this.set('model.referralCodeState', this._fetchReferralCodeState());
        this.set('model.affiliateCode', Cookies.get('affiliateCode'));
    },

    _fetchReferralCodeState() {
        let scope = this;
        let store = this.get('store');

        var referralCodeStates = Cookies.getJSON('referralCodeState');

        if (referralCodeStates) {
            return Ember.RSVP.Promise.resolve(referralCodeStates);
        }

        return new Ember.RSVP.Promise((resolve, reject) => {
            let referralCodeState = Cookies.getJSON('referralCodeState');

            // Do we have existing state?
            // Are there some options?
            if (referralCodeState) {
                return resolve(referralCodeState);
            }

            referralCodeState = {
                accepted: false,
                options: undefined,
                required: undefined
            };

            store.findAll('referral-code')
                .then(
                    /**
                     *
                     * @param arrayOfRecords
                     * @returns {Array}
                     */
                    function (arrayOfRecords) {
                        var storage = [];

                        if (arrayOfRecords) {
                            arrayOfRecords.every((record) => {

                                storage.pushObject(record.toJSON({
                                    includeId: true
                                }));

                            });
                        }

                        return storage;
                    })
                .catch(() => {
                    return null;
                })
                .then((recordsAsJson) => {
                    referralCodeState.options = recordsAsJson = (recordsAsJson || []);

                    // Determine if we need to.

                    referralCodeState.required = !Ember.isNone(
                        recordsAsJson.every((record) => {
                            if (!Ember.isBlank(Ember.get(record, 'code'))) {
                                return true;
                            }
                        }, scope));

                    if (referralCodeState.required && (Ember.isEmpty(referralCodeState.options))) {
                        referralCodeState.required = false;
                    }

                    return resolve(referralCodeState);
                })
                .catch(reject);
        });
    }

})
;
