"use strict";

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
    'suggested': DS.attr(),
    'pendingPolicyApproval': DS.attr('boolean'),

    'externalAccountVendor': DS.attr('string'),
    'externalAccountVendorUsername': DS.attr('string'),
    'externalAccountVendorPassword': DS.attr('string'),

    //region Protected Registration Mode
    // this is used to verify that the caller has authority to execute the request.
    // this is used during 'protected registration' mode
    'protectedFor': DS.attr('string'),
    'approvedBy': DS.attr('string')
    //endregion
});
