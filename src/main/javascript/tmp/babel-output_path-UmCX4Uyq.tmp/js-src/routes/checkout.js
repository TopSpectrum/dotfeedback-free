define('js-src/routes/checkout', ['exports', 'ember', 'ember-validations'], function (exports, _ember, _emberValidations) {
  exports['default'] = _ember['default'].Route.extend(_emberValidations['default'], {

    model: function model() {
      return _ember['default'].RSVP.hash({
        terms: _ember['default'].RSVP.Promise.cast(_ember['default'].$.ajax({
          url: '/api/v1/checkout_terms'
        })),
        record: this.store.findAll('Reservation').then(function (reservations) {
          return reservations.objectAt(0);
        })
      });
    }
  });
});