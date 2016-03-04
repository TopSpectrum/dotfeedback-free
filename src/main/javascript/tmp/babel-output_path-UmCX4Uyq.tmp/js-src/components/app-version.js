define('js-src/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'js-src/config/environment'], function (exports, _emberCliAppVersionComponentsAppVersion, _jsSrcConfigEnvironment) {

  var name = _jsSrcConfigEnvironment['default'].APP.name;
  var version = _jsSrcConfigEnvironment['default'].APP.version;

  exports['default'] = _emberCliAppVersionComponentsAppVersion['default'].extend({
    version: version,
    name: name
  });
});