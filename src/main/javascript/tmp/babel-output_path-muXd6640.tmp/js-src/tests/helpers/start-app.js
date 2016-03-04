define('js-src/tests/helpers/start-app', ['exports', 'ember', 'js-src/app', 'js-src/config/environment'], function (exports, _ember, _jsSrcApp, _jsSrcConfigEnvironment) {
  exports['default'] = startApp;

  function startApp(attrs) {
    var application = undefined;

    var attributes = _ember['default'].merge({}, _jsSrcConfigEnvironment['default'].APP);
    attributes = _ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    _ember['default'].run(function () {
      application = _jsSrcApp['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }
});