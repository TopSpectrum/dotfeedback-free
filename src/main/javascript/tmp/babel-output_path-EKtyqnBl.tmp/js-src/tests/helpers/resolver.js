define('js-src/tests/helpers/resolver', ['exports', 'js-src/resolver', 'js-src/config/environment'], function (exports, _jsSrcResolver, _jsSrcConfigEnvironment) {

  var resolver = _jsSrcResolver['default'].create();

  resolver.namespace = {
    modulePrefix: _jsSrcConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _jsSrcConfigEnvironment['default'].podModulePrefix
  };

  exports['default'] = resolver;
});