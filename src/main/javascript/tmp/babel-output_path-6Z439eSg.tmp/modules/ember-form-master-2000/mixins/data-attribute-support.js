import Ember from 'ember';

export default Ember.Mixin.create({

  setDataAttributes: Ember.observer('parentView.dataAttributes.[]', function () {
    var _this = this;

    var dataAttributes = this.get('parentView.dataAttributes');
    if (Ember.isArray(dataAttributes)) {
      dataAttributes.forEach(function (attr) {
        _this.get('attributeBindings').push(attr);
        _this.set(attr, _this.get('parentView.' + attr));
      });
    }
  })

});