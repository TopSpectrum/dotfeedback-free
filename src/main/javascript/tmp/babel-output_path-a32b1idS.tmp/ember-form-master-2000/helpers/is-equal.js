define('ember-form-master-2000/helpers/is-equal', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  function isEqualHelper(params) {
    return params[0] === params[1];
  }

  var forExport = null;
  if (typeof _ember['default'].HTMLBars.makeBoundHelper === 'function') {
    forExport = _ember['default'].Helper.helper(isEqualHelper);
  } else {
    forExport = _ember['default'].Handlebars.makeBoundHelper(isEqualHelper);
  }
  exports['default'] = forExport;
});