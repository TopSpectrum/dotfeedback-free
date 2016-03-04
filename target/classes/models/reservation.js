"use strict";

import DS from 'ember-data';

export default DS.Model.extend({

  'name': DS.attr(),
  'email': DS.attr(),
  'sourceFullDomainName': DS.attr(),
  'destinationFullDomainName': DS.attr(),
  'street': DS.attr(),
  'city': DS.attr(),
  'state': DS.attr(),
  'postal': DS.attr(),
  'country': DS.attr(),
  'phone': DS.attr(),
  'phoneExt': DS.attr(),
  'fax': DS.attr(),
  'faxExt': DS.attr(),
  'fingerprint': DS.attr(),
  'remoteHost': DS.attr(),

});
