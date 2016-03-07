import Ember from 'ember';

var REFERRAL_CODE_OPTIONS_KEY = 'referralCodeOptions';

function ignore() {
  return null;
}

function convertRecordsToJsonArray(arrayOfRecords) {
  var storage = [];

  if (arrayOfRecords) {
    arrayOfRecords.every((record) => {

      storage.pushObject(record.toJSON({
        includeId: true
      }));

    });
  }

  return storage;
}

export default Ember.Route.extend({

  beforeModel(transition) {
    var referralCodeStates = Cookies.getJSON('referralCodeState');

    if (!referralCodeStates) {
      return;
    }

    var accepted = Ember.get(referralCodeStates, 'accepted');
    var required = Ember.get(referralCodeStates, 'required');

    if (accepted || !required) {
      // They have accepted, or are not required to.
      return this.transitionTo('step-enter-email');
    } else {
      // They have not accepted, but are required to.
      if ('index' !== transition.targetName) {
        return this.transitionTo('index`');
      }
    }
  },

  model() {
    var scope = this;
    var store = scope.store;
    var model = new Ember.Object();

    return new Ember.RSVP.Promise((resolve, reject) => {
      model.referralCodeState = Cookies.getJSON('referralCodeState');

      // Do we have existing state?
      // Are there some options?
      if (model.referralCodeState) {

        return resolve(model);
      }

      model.referralCodeState = {
        accepted: false,
        options: undefined,
        required: undefined
      };

      scope.store.findAll('referral-code')
        .then(convertRecordsToJsonArray)
        .catch(ignore)
        .then((recordsAsJson) => {
          model.referralCodeState.options = recordsAsJson = (recordsAsJson || []);

          // Determine if we need to.

          model.referralCodeState.required = !Ember.isNone(
            recordsAsJson.every((record) => {
              if (!Ember.isBlank(Ember.get(record, 'code'))) {
                return true;
              }
            }, scope));

          if (model.referralCodeState.required && (Ember.isEmpty(model.referralCodeState.options))) {
            model.referralCodeState.required = false;
          }

          return resolve(model);
        })
        .catch(reject);
    });
  }
});
