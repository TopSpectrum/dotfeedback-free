import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.Route.extend(EmberValidations, {

  model() {
    return Ember.RSVP.hash({
      terms: Ember.RSVP.Promise.cast(Ember.$.ajax({
        url: '/api/v1/checkout_terms'
      })),
      record: this.store
        .findAll('Reservation')
        .then((reservations) => reservations.objectAt(0))
    })
  }
});
