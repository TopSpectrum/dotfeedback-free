define('js-src/controllers/checkout', ['exports', 'ember', 'ember-validations'], function (exports, _ember, _emberValidations) {
  exports['default'] = _ember['default'].Controller.extend(_emberValidations['default'], {

    validations: {
      'model.acceptsTos': {
        acceptance: true,
        presence: true
      }
    },

    actions: {
      next: function next() {
        this.set('model.spinning', true);

        var scope = this;

        _ember['default'].RSVP.Promise.cast(_ember['default'].$.ajax({
          url: '/api/v1/checkout',
          method: 'POST'
        })).then(function () {
          scope.set('model.spinning', false);
          scope.set('model.completed', true);
          scope.transitionToRoute('complete');
        })['catch'](function () {
          alert('Failed. Please try again o contact support.');
          scope.set('model.spinning', false);
        });

        return false;
      }
    }
  });
});