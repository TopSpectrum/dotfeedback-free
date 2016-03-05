import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.Controller.extend(EmberValidations, {

  store: Ember.inject.service(),

  validations: {
    'model.acceptsTos': {
      acceptance: true,
      presence: true
    }
  },

  actions: {
    next() {
      this.set('model.spinning', true);

      let scope = this;

      //var reservations = this.store.peekAll('reservation');
      //var reservation = reservations.objectAt(0);
      //var json = reservation.toJSON({
      //  includeId: true
      //});

      Ember.RSVP.Promise.cast(
        Ember.$.ajax({
          url: '/api/v1/checkout',
          method: 'POST',
          //data: {
          //  reservation: json
          //}
        }))
        .then(function () {
          scope.set('model.spinning', false);
          scope.set('model.completed', true);
          scope.transitionToRoute('complete');
        })
        .catch(function () {
          alert('Failed. Please try again o contact support.');
          scope.set('model.spinning', false);
        });

      return false;
    }
  }
});
