define('ember-form-master-2000/components/fm-radio-group', ['exports', 'ember', 'ember-form-master-2000/templates/components/ember-form-master-2000/fm-radio-group'], function (exports, _ember, _emberFormMaster2000TemplatesComponentsEmberFormMaster2000FmRadioGroup) {
  'use strict';

  exports['default'] = _ember['default'].Component.extend({
    layout: _emberFormMaster2000TemplatesComponentsEmberFormMaster2000FmRadioGroup['default'],
    classNameBindings: ['radioGroupWrapperClass', 'errorClass'],
    fmConfig: _ember['default'].inject.service('fm-config'),
    errorClass: _ember['default'].computed('showErrors', 'fmConfig.errorClass', function () {
      if (this.get('showErrors')) {
        return this.get('fmConfig.errorClass');
      }
    }),
    radioGroupWrapperClass: _ember['default'].computed.reads('fmConfig.radioGroupWrapperClass'),
    labelClass: _ember['default'].computed.reads('fmConfig.labelClass'),

    shouldShowErrors: false,
    showErrors: _ember['default'].computed('errors', 'shouldShowErrors', function () {
      return this.get('shouldShowErrors') && !_ember['default'].isEmpty(this.get('errors'));
    }),

    actions: {
      userInteraction: function userInteraction() {
        this.set('shouldShowErrors', true);
      }
    }
  });
});