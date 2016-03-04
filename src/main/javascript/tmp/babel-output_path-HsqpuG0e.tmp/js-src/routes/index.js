define('js-src/routes/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    beforeModel: function beforeModel() {
      this.transitionTo('step-enter-email');
    }

  });
});