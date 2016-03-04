define('ember-form-master-2000/components/fm-submit', ['exports', 'ember', 'ember-form-master-2000/templates/components/ember-form-master-2000/fm-submit'], function (exports, _ember, _emberFormMaster2000TemplatesComponentsEmberFormMaster2000FmSubmit) {
  'use strict';

  exports['default'] = _ember['default'].Component.extend({
    layout: _emberFormMaster2000TemplatesComponentsEmberFormMaster2000FmSubmit['default'],
    classNameBindings: ['wrapperClass'],
    fmConfig: _ember['default'].inject.service('fm-config'),
    init: function init() {
      this._super(this);
    },
    submitButtonClass: _ember['default'].computed.reads('fmConfig.submitButtonClass'),
    wrapperClass: _ember['default'].computed.reads('fmConfig.wrapperClass'),
    tagName: 'div'
  });
});