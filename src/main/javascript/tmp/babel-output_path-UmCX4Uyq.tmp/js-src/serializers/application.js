define('js-src/serializers/application', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].RESTSerializer.extend({
    modelNameFromPayloadKey: function modelNameFromPayloadKey(payloadKey) {
      return payloadKey;
    }
  });
});