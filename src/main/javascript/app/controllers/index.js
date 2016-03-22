"use strict";

import Ember from 'ember';
import EmberValidations /*, { validator }*/ from 'ember-validations';

export default Ember.Controller.extend(EmberValidations, {

  validations: {
    hasValidReferralCode: {
      acceptance: true
    }
  },

  spinning: false,

  hasValidReferralCode: Ember.computed('model', 'model.referralCode', function() {
    let referralCodes = this.store.peekAll('referral-code');
    let goal = this.get('model.referralCode');

    var record = referralCodes.find(function(record) {
      let code = Ember.get(record, 'code');

      if (code === null) {
        return true;
      }

      return code === goal;
    }, this);


    return !Ember.isNone(record);
  }),

  actions: {
    innerNext() {
      var valid = this.get('isValid');
      var code = this.get('model.referralCode');

      if (!valid) {
        return false;
      }

      this.send('next', code);
    }
  }

});
