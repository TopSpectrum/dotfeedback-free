"use strict";

import Ember from 'ember';

/**
 * Abstract base class for all wizard-step routes
 *
 * @class WizardStepRoute
 */
export default Ember.Route.extend({

    model() {
        return this.modelFor('application');
    }
});
