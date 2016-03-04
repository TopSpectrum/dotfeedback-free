define('ember-form-master-2000/components/fm-errortext', ['exports', 'ember', 'ember-form-master-2000/templates/components/ember-form-master-2000/fm-errortext'], function (exports, _ember, _emberFormMaster2000TemplatesComponentsEmberFormMaster2000FmErrortext) {
  'use strict';

  exports['default'] = _ember['default'].Component.extend({
    layout: _emberFormMaster2000TemplatesComponentsEmberFormMaster2000FmErrortext['default'],
    tagName: 'span',
    classNameBindings: 'errortextClass',
    error: _ember['default'].computed('errors', function () {
      var errors = this.get('errors');
      var error = null;
      if (_ember['default'].isArray(errors) && errors.length > 0) {
        error = errors[0];
      }
      if (errors && typeof errors === 'object' && errors.message) {
        error = errors.message;
      }
      if (typeof errors === 'string') {
        error = errors;
      }
      return error;
    }),
    errortextClass: 'help-block'
  });
});