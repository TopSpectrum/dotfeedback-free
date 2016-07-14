'use strict';

import domainParser from "./utility-domain-parser";
import isEmail from "./email-validator";
import isValidCustomerDomainName from './customer-domain-name-validator';

export default {

    parse: domainParser,

    isEmail: isEmail,

    /**
     * @param {String} string
     * @returns {boolean}
     */
    isValidCustomerDomainName: isValidCustomerDomainName,

    /**
     * @param {String} string
     * @returns {boolean}
     */
    isValidFullDomainName(string) {
        if (!string) {
            return false;
        }

        let obj = domainParser(string);

        return (obj) ? (obj.exact) : false;
    },

    /**
     * @param {String} string
     */
    toValidFullDomainName(string) {
        if (!string) {
            return null;
        }

        if (isEmail(string)) {
            // Email mode
            let index = string.indexOf('@') + 1;
            let suffix = string.substring(index);
            let parsedObject = domainParser(suffix);

            return parsedObject.fullDomainName;
        }

        if (~string.indexOf('//')) {
            let parser = document.createElement('a');

            parser.href = string;

            string = parser.hostname;
        }

        if (!string) {
            return null;
        }

        let result = domainParser(string);

        if (!result) {
            return null;
        }

        return result.fullDomainName;
    }
}
