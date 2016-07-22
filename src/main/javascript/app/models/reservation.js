"use strict";

import Ember from "ember";
import DS from "ember-data";

export default DS.Model.extend({

    'name': DS.attr('string'),
    'email': DS.attr('string'),
    'sourceFullDomainName': DS.attr('string'),
    'destinationFullDomainName': DS.attr('string'),
    'street': DS.attr('string'),
    'city': DS.attr('string'),
    'state': DS.attr('string'),
    'postal': DS.attr('string'),
    'country': DS.attr('string'),
    'phone': DS.attr('string'),
    'phoneExt': DS.attr('string'),
    'fax': DS.attr('string'),
    'faxExt': DS.attr('string'),
    'fingerprint': DS.attr(),
    'referralCode': DS.attr('string'),
    'registrar': DS.attr('string'),
    'affiliateCode': DS.attr('string'),
    'checkoutDate': DS.attr('date'),
    'approvalDate': DS.attr('date'),
    'purchaseDate': DS.attr('date'),
    'suggestionMode': DS.attr('string'),
    'pendingPolicyApproval': DS.attr('boolean'),

    'externalAccountVendor': DS.attr('string'),
    'externalAccountVendorUsername': DS.attr('string'),
    'externalAccountVendorPassword': DS.attr('string'),

    //region Protected Registration Mode
    // this is used to verify that the caller has authority to execute the request.
    // this is used during 'protected registration' mode
    'protectedFor': DS.attr('string'),
    'approvedBy': DS.attr('string'),
    //endregion

    /**
     * @return {boolean}
     */
    isSuggested: Ember.computed('suggestionMode', function() {
        let suggestionMode = this.get('suggestionMode');

        return !!suggestionMode;
    }),

    /**
     * @return {boolean}
     */
    isSuggestedAggressively: Ember.computed('suggestionMode', function() {
        let suggestionMode = this.get('suggestionMode');

        return 'aggressive' === suggestionMode;
    }),

    /**
     * @return {boolean}
     */
    isSuggestedPassively: Ember.computed('suggestionMode', function() {
        let suggestionMode = this.get('suggestionMode');

        return 'passive' === suggestionMode;
    })
});
