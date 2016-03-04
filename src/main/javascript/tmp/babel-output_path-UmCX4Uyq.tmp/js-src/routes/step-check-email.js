define('js-src/routes/step-check-email', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    beforeModel: function beforeModel() {
      var model = this.modelFor('application');
      var waitingOnEmail = _ember['default'].get(model, 'waitingOnEmail');

      if (!waitingOnEmail) {
        _ember['default'].Logger.warn('Are not \'waitingOnEmail\', so returning to the index route.');
        this.transitionTo('index');
      }
    },

    model: function model() {
      return this.modelFor('application');
    },

    actions: {
      willTransition: function willTransition(transition) {
        transition.abort();
      }
    }

  });
});