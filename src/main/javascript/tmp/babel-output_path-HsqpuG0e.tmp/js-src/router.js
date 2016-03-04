define('js-src/router', ['exports', 'ember', 'js-src/config/environment'], function (exports, _ember, _jsSrcConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _jsSrcConfigEnvironment['default'].locationType
  });

  Router.map(function () {
    this.route('step-enter-email', { path: '/email' });

    this.route('step-select-domains', { path: '/domains' }, function () {
      this.route('whois', {
        resetNamespace: true
      });
    });

    this.route('step-check-email');

    this.route('step-checkout', { path: '/checkout' });

    this.route('checkout');
    this.route('complete');
  });

  exports['default'] = Router;
});