"use strict";

import Ember from 'ember';

export default Ember.Route.extend({

    contextService: Ember.inject.service('context'),

    model() {
        return this.get('contextService.model');
    },

    actions: {

        clearCookies() {
            // http://stackoverflow.com/questions/179355/clearing-all-cookies-with-javascript
            var cookieString = document.cookie;

            if (!Ember.isBlank(cookieString)) {
                var cookies = cookieString.split(";");

                for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i];
                    var eqPos = cookie.indexOf("=");
                    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;

                    console.log(name);
                    if (name === 'affiliateCode') {
                        continue;
                    }

                    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                }
            }

            document.location.href = '/api/v1/logout';
        }
    }
});
