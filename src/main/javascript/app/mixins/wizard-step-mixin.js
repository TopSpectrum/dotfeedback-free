import Ember from 'ember';

export default Ember.Mixin.create({

    session: Ember.inject.service('session'),

    context: Ember.inject.service('context'),

    /**
     * @param {Transition} transition The transition that lead to this route
     * @returns {*}
     */
    beforeModel(transition) {
        if (this.get('session.isAuthenticated')) {
            return this._super(...arguments);
        }

        transition.abort();

        this.transitionTo('');
    }
});
