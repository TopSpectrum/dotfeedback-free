"use strict";

import Ember from "ember";
import TLDs from "javascript/utils/utility-domain-json";

export default function utilityDomainParser(domainName) {
    if ('string' !== Ember.typeOf(domainName) || Ember.isBlank(domainName)) {
        return null;
    }

    var parts = domainName.split('.');
    if (!parts || !parts.length > 2) {
        return null;
    }

    var suffix = parts[parts.length - 1];
    if (Ember.isBlank(suffix)) {
        return null;
    }

    var tld = TLDs[suffix];

    if (!tld || !Ember.isArray(tld)) {
        return null;
    }

    for (let index = 0; index < tld.length; index++) {
        let possible_tld = tld[index];
        let pattern = possible_tld.pattern;
        let arrayOrNull = domainName.match(pattern);

        if (!arrayOrNull || !Ember.isArray(arrayOrNull)) {
            continue;
        }

        if (arrayOrNull.length < 2) {
            continue;
        }

        let topLevelDomain = possible_tld.suffix;
        let customerDomainName = arrayOrNull[2];
        let fullDomainName = (customerDomainName + '.' + suffix);
        let exact = (fullDomainName === domainName);

        let is_public = !!(TLDs[customerDomainName]);

        return {
            customerDomainName: customerDomainName,
            topLevelDomain: topLevelDomain,
            fullDomainName: fullDomainName,
            originalDomainName: domainName,
            exact: exact,
            'public': is_public
        };
    }
}
