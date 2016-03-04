define('ember-form-master-2000/helpers/is-not', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  function isNotHelper(params) {
    return !params[0];
  }

  var forExport = null;
  if (typeof _ember['default'].HTMLBars.makeBoundHelper === 'function') {
    forExport = _ember['default'].Helper.helper(isNotHelper);
  } else {
    forExport = _ember['default'].Handlebars.makeBoundHelper(isNotHelper);
  }
  exports['default'] = forExport;
});