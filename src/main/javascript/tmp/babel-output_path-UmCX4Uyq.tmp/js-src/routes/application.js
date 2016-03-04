define('js-src/routes/application', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    model: function model() {
      // A mutable object that everyone will use.
      return {};
    }

  });
});