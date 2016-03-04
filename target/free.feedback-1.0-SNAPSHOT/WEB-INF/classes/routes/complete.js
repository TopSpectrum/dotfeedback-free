import Ember from 'ember';

export default Ember.Route.extend({

  //beforeModel() {
  //  var model = this.modelFor('application');
  //  var completed = Ember.get(model, 'completed');
  //
  //  if (!completed) {
  //    Ember.Logger.warn('Are not \'completed\', so returning to the index route.');
  //    this.transitionTo('index');
  //  }
  //},

  model() {
    return this.modelFor('application');
  },

  actions: {
    willTransition(transition) {
      transition.abort();
    }
  }

});
