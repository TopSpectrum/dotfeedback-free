define('js-src/models/availability', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({

    'status': _emberData['default'].attr('string', { defaultValue: 'unknown' })

  });
});