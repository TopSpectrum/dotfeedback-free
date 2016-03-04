define('ember-form-master-2000/components/fm-form', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports['default'] = _ember['default'].Component.extend({
    init: function init() {
      this._super();
    },
    classNameBindings: ['formClass'],
    formClass: _ember['default'].computed.reads('fmConfig.formClass'),
    fmConfig: _ember['default'].inject.service('fm-config'),
    tagName: 'form',
    'for': null,
    submit: function submit(e) {
      e.preventDefault();
      this.get('childViews').forEach(function (chieldView) {
        if (chieldView.get('shouldShowErrors') === false) {
          chieldView.set('shouldShowErrors', true);
        }
      });
      this.sendAction('action', this.get('for'));
    }
  });
});