define('js-src/app', ['exports', 'ember', 'js-src/resolver', 'ember-load-initializers', 'js-src/config/environment'], function (exports, _ember, _jsSrcResolver, _emberLoadInitializers, _jsSrcConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _jsSrcConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _jsSrcConfigEnvironment['default'].podModulePrefix,
    Resolver: _jsSrcResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _jsSrcConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});