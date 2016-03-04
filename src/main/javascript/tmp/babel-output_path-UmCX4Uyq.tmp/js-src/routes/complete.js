define('js-src/routes/complete', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    //beforeModel() {
    //  var model = this.modelFor('application');
    //  var completed = Ember.get(model, 'completed');
    //
    //  if (!completed) {
    //    Ember.Logger.warn('Are not \'completed\', so returning to the index route.');
    //    this.transitionTo('index');
    //  }
    //},

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