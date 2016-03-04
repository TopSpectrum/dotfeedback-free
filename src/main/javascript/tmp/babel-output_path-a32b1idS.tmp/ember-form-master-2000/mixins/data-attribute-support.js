define('ember-form-master-2000/mixins/data-attribute-support', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports['default'] = _ember['default'].Mixin.create({

    setDataAttributes: _ember['default'].observer('parentView.dataAttributes.[]', function () {
      var _this = this;

      var dataAttributes = this.get('parentView.dataAttributes');
      if (_ember['default'].isArray(dataAttributes)) {
        dataAttributes.forEach(function (attr) {
          _this.get('attributeBindings').push(attr);
          _this.set(attr, _this.get('parentView.' + attr));
        });
      }
    })

  });
});