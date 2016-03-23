"use strict";

import Ember from "ember";

export default Ember.Service.extend({

    // referralCodeState: null,
    store: Ember.inject.service('store'),

    init() {
        this._super(...arguments);

        this.set('model.skipReferralCode', true);
        this.set('model.allowAnyReferralCode', true);
        this.set('model.referralCodeState', this._fetchReferralCodeState());
    },

    model: new Ember.Object({}),

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
        this.set('model', new Ember.Object({}));
    },

    _fetchReferralCodeState()
    {
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