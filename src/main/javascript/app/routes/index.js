import Ember from 'ember';

export default Ember.Route.extend({

  beforeModel() {
    var applicationModel = this.modelFor('application');

    let accepted = Ember.get(applicationModel, 'referralCodeState.accepted');
    let required = Ember.get(applicationModel, 'referralCodeState.required');

    if (true === accepted || false === required) {

      this.transitionTo('step-enter-email');
    }

    console.log(Ember.get(applicationModel, 'referralCodeState'), accepted, required);

    Ember.Logger.debug('applicationModel', applicationModel);
  },

  model() {
    return this.modelFor('application');
  },

  actions: {
    next(code) {
      var applicationModel = this.modelFor('application');

      Ember.set(applicationModel, 'referralCodeState.accepted', true);
      Ember.set(applicationModel, 'referralCodeState.code', code);

      var state = Ember.get(applicationModel, 'referralCodeState');

      Cookies.set('referralCodeState', state);
    }
  }
});
