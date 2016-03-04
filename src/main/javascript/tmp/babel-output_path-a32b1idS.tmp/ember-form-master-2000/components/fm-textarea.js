define('ember-form-master-2000/components/fm-textarea', ['exports', 'ember', 'ember-form-master-2000/mixins/data-attribute-support'], function (exports, _ember, _emberFormMaster2000MixinsDataAttributeSupport) {
  'use strict';

  exports['default'] = _ember['default'].TextArea.extend(_emberFormMaster2000MixinsDataAttributeSupport['default'], {
    focusOut: function focusOut() {
      this.sendAction('onUserInteraction');
    },

    init: function init() {
      if (this.get('parentView.forAttribute')) {
        this.set('elementId', this.get('parentView.forAttribute'));
      }
      this._super(arguments);
      this.setDataAttributes();
    }

  });
});