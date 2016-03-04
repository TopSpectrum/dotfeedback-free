define('js-src/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'js-src/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _jsSrcConfigEnvironment) {
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(_jsSrcConfigEnvironment['default'].APP.name, _jsSrcConfigEnvironment['default'].APP.version)
  };
});