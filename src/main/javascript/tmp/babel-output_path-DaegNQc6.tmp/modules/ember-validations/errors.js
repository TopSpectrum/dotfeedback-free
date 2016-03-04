import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Object.extend({
  unknownProperty: function unknownProperty(property) {
    set(this, property, Ember.A());
    return get(this, property);
  }
});