"use strict";

import Ember from "ember";
import EmberValidations, {validator} from "ember-validations";

export default Ember.Component.extend(EmberValidations, {

    validations: {
        hasValidReferralCode: {
            acceptance: true
        }
    },

    store: Ember.inject.service(),

    spinning: false,

    referralCode: '',

    hasValidReferralCode: Ember.computed('model', 'referralCode', 'model.allowAnyReferralCode', function () {
        let referralCodes = this.get('store').peekAll('referral-code');
        let goal = this.get('referralCode');
        let allowAnyReferralCode = this.get('model.allowAnyReferralCode');

        if (allowAnyReferralCode) {
            return true;
        }

        let record = referralCodes.find(function (record) {
            let code = Ember.get(record, 'code');

            if (code === null) {
                return true;
            }

            return code === goal;
        }, this);

        return !Ember.isNone(record);
    }),

    actions: {
        next() {
            var valid = this.get('isValid');
            var code = this.get('referralCode');

            if (!valid) {
                return false;
            }

            this.set('model.referralCodeState.accepted', true);
            this.set('model.referralCodeState.code', code);

            var referralCodeState = this.get('model.referralCodeState');

            Cookies.set('referralCodeState', referralCodeState);

            // Because we updated the state, our component should auto-destroy.
            // So we return false, because we don't need to use an action to trigger the next step.
            return false;
        }
    }
});
