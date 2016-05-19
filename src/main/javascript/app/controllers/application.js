'use strict';

import Ember from 'ember';

export default Ember.Controller.extend({

    contextService: Ember.inject.service('context'),

    editingAffiliateCode: false,

    affiliateCodeHeaderText: Ember.computed('model.affiliateCode', function() {
        var affiliateCode = this.get('model.affiliateCode');

        return affiliateCode || 'Name';
    }),

    actions: {

        'edit-affiliate'() {
            this.set('newAffiliateCode', this.get('model.affiliateCode'));
            this.set('editingAffiliateCode', true);
        },

        'editingAffiliateCodeModalSaved'() {
            var affiliateCode = this.get('newAffiliateCode');

            this.set('model.affiliateCode', affiliateCode);
            this.set('editingAffiliateCode', false);
            
            Cookies.set('affiliateCode', affiliateCode);
        },

        'editingAffiliateCodeModalHidden'() {
            this.set('editingAffiliateCode', false);
        }
    }
});
