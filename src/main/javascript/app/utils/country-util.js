import countries from 'ember-i18n-iso-countries';

export default class CountryUtil {


    /**
     *
     * @param {String} string
     * @return {Boolean}
     */
    static isValidCountryString(string) {
        if (!string) {
            return false;
        }

        string = string.trim();

        let r1 = countries.alpha2ToAlpha3(string);
        let r2 = countries.alpha3ToAlpha2(string);
        let r3 = countries.numericToAlpha3(string);
        let r4 = countries.getAlpha2Code(string, 'en');

        let result = !!(r1 || r2 || r3 || r4);

        console.log(string, r1, r2, r3, r4, '===>', result);

        return result;
    }
}
