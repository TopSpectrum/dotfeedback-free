define('ember-form-master-2000/components/fm-radio', ['exports', 'ember', 'ember-form-master-2000/templates/components/ember-form-master-2000/fm-radio'], function (exports, _ember, _emberFormMaster2000TemplatesComponentsEmberFormMaster2000FmRadio) {
  'use strict';

  exports['default'] = _ember['default'].Component.extend({
    layout: _emberFormMaster2000TemplatesComponentsEmberFormMaster2000FmRadio['default'],
    classNameBindings: ['radioClass'],
    fmConfig: _ember['default'].inject.service('fm-config'),
    radioClass: _ember['default'].computed.reads('fmConfig.radioClass'),
    checked: _ember['default'].computed('parentView.value', function () {
      if (_ember['default'].isEmpty(this.get('content')) || _ember['default'].isEmpty(this.get('optionValuePath'))) {
        return false;
      }

      return this.get('parentView.value') === _ember['default'].get(this.get('content'), this.get('optionValuePath'));
    }),
    change: function change() {
      this.set('parentView.value', _ember['default'].get(this.get('content'), this.get('optionValuePath')));
      this.sendAction('onUserInteraction');
    },
    focusOut: function focusOut() {
      this.sendAction('onUserInteraction');
    },
    optionLabelPath: 'label',
    optionValuePath: 'value'
  });
});