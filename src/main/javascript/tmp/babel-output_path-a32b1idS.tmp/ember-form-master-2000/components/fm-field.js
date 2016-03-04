define('ember-form-master-2000/components/fm-field', ['exports', 'ember', 'ember-form-master-2000/templates/components/ember-form-master-2000/fm-field'], function (exports, _ember, _emberFormMaster2000TemplatesComponentsEmberFormMaster2000FmField) {
  'use strict';

  exports['default'] = _ember['default'].Component.extend({
    layout: _emberFormMaster2000TemplatesComponentsEmberFormMaster2000FmField['default'],
    value: null,

    fmConfig: _ember['default'].inject.service('fm-config'),

    inputClass: _ember['default'].computed.reads('fmConfig.inputClass'),
    labelClass: _ember['default'].computed.reads('fmConfig.labelClass'),
    textareaClass: _ember['default'].computed.reads('fmConfig.textareaClass'),
    wrapperClass: _ember['default'].computed.reads('fmConfig.wrapperClass'),

    init: function init() {
      if (!this.get('optionValuePath')) {
        this.set('optionValuePath', 'content.value');
      }
      if (!this.get('optionLabelPath')) {
        this.set('optionLabelPath', 'content.label');
      }
      var dataAttributes = Object.keys(this.get('attrs')).filter(function (attr) {
        return (/data-/.test(attr)
        );
      });
      this.set('dataAttributes', dataAttributes);

      this._super(arguments);
    },
    placeholder: null,
    label: null,
    classNameBindings: ['wrapperClass', 'errorClass'],
    errorClass: _ember['default'].computed('showErrors', 'fmConfig.errorClass', function () {
      if (this.get('showErrors')) {
        return this.get('fmConfig.errorClass');
      }
    }),
    isSelect: _ember['default'].computed('type', function () {
      return this.get('type') === 'select';
    }),
    isTextarea: _ember['default'].computed('type', function () {
      return this.get('type') === 'textarea';
    }),
    isBasicInput: _ember['default'].computed('type', function () {
      return !this.get('isSelect') && !this.get('isTextarea');
    }),
    forAttribute: _ember['default'].computed('label', 'inputId', function () {
      if (this.get('inputId')) {
        return this.generateSafeId(this.get('inputId'));
      }
      if (this.get('label')) {
        return this.generateSafeId(this.get('label'));
      }
    }),
    generateSafeId: function generateSafeId(id) {
      var tmp = document.createElement("DIV");
      tmp.innerHTML = id;
      id = tmp.textContent || tmp.innerText || "";
      id = id.replace(/[\.,\/#!$%\^&\*;:{}=\`'"~()]/g, "");
      id = id.replace(/\s/g, "-");
      return id;
    },

    actions: {
      selectAction: function selectAction(value) {
        if (this.attrs.action && typeof this.attrs.action === 'function') {
          this.attrs.action(value);
        } else {
          this.set('value', value);
        }
      },

      userInteraction: function userInteraction() {
        this.set('shouldShowErrors', true);
      }
    },
    shouldShowErrors: _ember['default'].computed('fmConfig.showErrorsByDefault', function () {
      return this.get('fmConfig.showErrorsByDefault');
    }),
    showErrors: _ember['default'].computed('shouldShowErrors', 'errors', function () {
      return this.get('shouldShowErrors') && !_ember['default'].isEmpty(this.get('errors'));
    })
  });
});