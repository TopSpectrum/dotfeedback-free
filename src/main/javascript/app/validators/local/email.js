"use strict";

import Base from 'ember-validations/validators/base';

export default Base.extend({

  call: function () {
    var email = this.model.get(this.property);

    if (!email) {
      this.errors.pushObject("Must include an email");
    } else if (!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)) {
      this.errors.pushObject("Must be a valid email address");
    }
  }
});
