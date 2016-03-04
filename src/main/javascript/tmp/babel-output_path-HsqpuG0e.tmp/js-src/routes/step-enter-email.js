define('js-src/routes/step-enter-email', ['exports', 'ember'], function (exports, _ember) {
  "use strict";

  exports['default'] = _ember['default'].Route.extend({

    model: function model() {
      return this.modelFor('application');
    }

  });
});