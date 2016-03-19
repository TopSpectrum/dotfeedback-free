import Ember from 'ember';

export default Ember.Route.extend({

    // beforeModel() {
    //     var model = this.modelFor('application');
    //     var sourceFullDomainName = Ember.get(model, 'sourceFullDomainName');
    //
    //     if (!sourceFullDomainName) {
    //         Ember.Logger.warn('Could not determine the \'sourceFullDomainName\', so returning to the index route.');
    //         this.transitionTo('index');
    //     }
    // },

    model() {
        return this.modelFor('application');
    }

});
