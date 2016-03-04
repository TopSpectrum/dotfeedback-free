define('js-src/initializers/resize', ['exports', 'ember-resize/services/resize', 'js-src/config/environment'], function (exports, _emberResizeServicesResize, _jsSrcConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];

    var resizeServiceDefaults = _jsSrcConfigEnvironment['default'].resizeServiceDefaults;
    var injectionFactories = resizeServiceDefaults.injectionFactories;

    application.register('config:resize-service', resizeServiceDefaults, { instantiate: false });
    application.register('service:resize', _emberResizeServicesResize['default']);
    application.inject('service:resize', 'resizeServiceDefaults', 'config:resize-service');

    injectionFactories.forEach(function (factory) {
      application.inject(factory, 'resizeService', 'service:resize');
    });
  }

  exports['default'] = {
    name: 'resize',
    initialize: initialize
  };
});