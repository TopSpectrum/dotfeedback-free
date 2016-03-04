define('js-src/utils/utility-domain-parser', ['exports', 'ember', 'js-src/utils/utility-domain-json'], function (exports, _ember, _jsSrcUtilsUtilityDomainJson) {
  exports['default'] = utilityDomainParser;

  function utilityDomainParser(domainName) {
    if ('string' !== _ember['default'].typeOf(domainName) || _ember['default'].isBlank(domainName)) {
      return null;
    }

    var parts = domainName.split('.');
    if (!parts || !parts.length > 2) {
      return null;
    }

    var suffix = parts[parts.length - 1];
    if (_ember['default'].isBlank(suffix)) {
      return null;
    }

    var tld = _jsSrcUtilsUtilityDomainJson['default'][suffix];

    if (!tld || !_ember['default'].isArray(tld)) {
      return null;
    }

    for (var index = 0; index < tld.length; index++) {
      var possible_tld = tld[index];
      var pattern = possible_tld.pattern;
      var arrayOrNull = domainName.match(pattern);

      if (!arrayOrNull || !_ember['default'].isArray(arrayOrNull)) {
        continue;
      }

      if (arrayOrNull.length < 2) {
        continue;
      }

      var topLevelDomain = tld.suffix;
      var customerDomainName = arrayOrNull[2];
      var fullDomainName = customerDomainName + '.' + suffix;
      var exact = fullDomainName === domainName;

      return {
        customerDomainName: customerDomainName,
        topLevelDomain: topLevelDomain,
        fullDomainName: fullDomainName,
        originalDomainName: domainName,
        exact: exact
      };
    }
  }
});