define('ember-form-master-2000/components/fm-helptext', ['exports', 'ember', 'ember-form-master-2000/templates/components/ember-form-master-2000/fm-helptext'], function (exports, _ember, _emberFormMaster2000TemplatesComponentsEmberFormMaster2000FmHelptext) {
  'use strict';

  exports['default'] = _ember['default'].Component.extend({
    layout: _emberFormMaster2000TemplatesComponentsEmberFormMaster2000FmHelptext['default'],
    tagName: 'span',
    classNameBindings: ['helptextClass'],
    fmConfig: _ember['default'].inject.service('fm-config'),
    helptextClass: _ember['default'].computed.reads('fmConfig.helptextClass')
  });
});