"use strict";

import Ember from 'ember';
import WizardStepRoute from './wizard-step';

/**
 * @class StepSelectRegistrarWizardStepRoute
 * @extends WizardStepRoute
 */
export default WizardStepRoute.extend({

    actions: {

        next() {
            this.transitionTo('step-finished');
        }
    }
});
