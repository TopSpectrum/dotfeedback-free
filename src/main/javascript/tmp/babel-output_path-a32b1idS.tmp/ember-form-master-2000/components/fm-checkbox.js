define('ember-form-master-2000/components/fm-checkbox', ['exports', 'ember', 'ember-form-master-2000/templates/components/ember-form-master-2000/fm-checkbox'], function (exports, _ember, _emberFormMaster2000TemplatesComponentsEmberFormMaster2000FmCheckbox) {
  'use strict';

  exports['default'] = _ember['default'].Component.extend({
    layout: _emberFormMaster2000TemplatesComponentsEmberFormMaster2000FmCheckbox['default'],
    classNameBindings: ['checkboxWrapperClass', 'errorClass'],
    fmConfig: _ember['default'].inject.service('fm-config'),
    checkboxWrapperClass: _ember['default'].computed.reads('fmConfig.checkboxWrapperClass'),
    errorClass: _ember['default'].computed('showErrors', 'fmConfig.errorClass', function () {
      if (this.get('showErrors')) {
        return this.get('fmConfig.errorClass');
      }
    }),

    shouldShowErrors: false,
    showErrors: _ember['default'].computed('shouldShowErrors', 'errors', function () {
      return this.get('shouldShowErrors') && !_ember['default'].isEmpty(this.get('errors'));
    }),

    change: function change() {
      this.send('userInteraction');
    },

    focusOut: function focusOut() {
      this.send('userInteraction');
    },

    actions: {
      userInteraction: function userInteraction() {
        this.set('shouldShowErrors', true);
      }
    }
  });
});