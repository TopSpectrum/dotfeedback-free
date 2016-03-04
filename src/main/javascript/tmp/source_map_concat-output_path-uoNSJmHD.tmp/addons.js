define('ember-ajax/errors', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports.AjaxError = AjaxError;
  exports.InvalidError = InvalidError;
  exports.UnauthorizedError = UnauthorizedError;
  exports.ForbiddenError = ForbiddenError;

  var EmberError = _ember['default'].Error;

  /**
    @class AjaxError
    @namespace DS
  */

  function AjaxError(errors) {
    var message = arguments.length <= 1 || arguments[1] === undefined ? 'Ajax operation failed' : arguments[1];

    EmberError.call(this, message);

    this.errors = errors || [{
      title: 'Ajax Error',
      detail: message
    }];
  }

  AjaxError.prototype = Object.create(EmberError.prototype);

  function InvalidError(errors) {
    AjaxError.call(this, errors, 'Request was rejected because it was invalid');
  }

  InvalidError.prototype = Object.create(AjaxError.prototype);

  function UnauthorizedError(errors) {
    AjaxError.call(this, errors, 'Ajax authorization failed');
  }

  UnauthorizedError.prototype = Object.create(AjaxError.prototype);

  function ForbiddenError(errors) {
    AjaxError.call(this, errors, 'Request was rejected because user is not permitted to perform this operation.');
  }

  ForbiddenError.prototype = Object.create(AjaxError.prototype);
});
define('ember-ajax/index', ['exports', 'ember-ajax/request'], function (exports, _emberAjaxRequest) {
  'use strict';

  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxRequest['default'];
    }
  });
});
define('ember-ajax/make-promise', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports['default'] = makePromise;

  var run = _ember['default'].run;
  var RSVP = _ember['default'].RSVP;

  function makePromise(settings) {
    var type = settings.type || 'GET';
    return new RSVP.Promise(function (resolve, reject) {
      settings.success = makeSuccess(resolve);
      settings.error = makeError(reject);
      _ember['default'].$.ajax(settings);
    }, 'ember-ajax: ' + type + ' to ' + settings.url);
  }

  function makeSuccess(resolve) {
    return function success(response, textStatus, jqXHR) {
      run(null, resolve, {
        response: response,
        textStatus: textStatus,
        jqXHR: jqXHR
      });
    };
  }

  function makeError(reject) {
    return function error(jqXHR, textStatus, errorThrown) {
      run(null, reject, {
        jqXHR: jqXHR,
        textStatus: textStatus,
        errorThrown: errorThrown
      });
    };
  }
});
define('ember-ajax/raw', ['exports', 'ember-ajax/make-promise', 'ember-ajax/utils/parse-args', 'ember'], function (exports, _emberAjaxMakePromise, _emberAjaxUtilsParseArgs, _ember) {
  'use strict';

  var _slicedToArray = (function () {
    function sliceIterator(arr, i) {
      var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;_e = err;
      } finally {
        try {
          if (!_n && _i['return']) _i['return']();
        } finally {
          if (_d) throw _e;
        }
      }return _arr;
    }return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError('Invalid attempt to destructure non-iterable instance');
      }
    };
  })();

  exports['default'] = raw;

  var deprecate = _ember['default'].deprecate;

  /*
   * Same as `request` except it resolves an object with `{response, textStatus,
   * jqXHR}`, useful if you need access to the jqXHR object for headers, etc.
   */
  function raw() {
    deprecate('ember-ajax/raw is deprecated and will be removed in ember-ajax@2.0.0', false, { id: 'ember-ajax.raw' });

    var _parseArgs$apply = _emberAjaxUtilsParseArgs['default'].apply(null, arguments);

    var _parseArgs$apply2 = _slicedToArray(_parseArgs$apply, 3);

    var url = _parseArgs$apply2[0];
    var type = _parseArgs$apply2[1];
    var settings = _parseArgs$apply2[2];

    if (!settings) {
      settings = {};
    }
    settings.url = url;
    settings.type = type;
    return (0, _emberAjaxMakePromise['default'])(settings);
  }
});
define('ember-ajax/request', ['exports', 'ember-ajax/raw', 'ember'], function (exports, _emberAjaxRaw, _ember) {
  'use strict';

  exports['default'] = request;

  var deprecate = _ember['default'].deprecate;

  /*
   * jQuery.ajax wrapper, supports the same signature except providing
   * `success` and `error` handlers will throw an error (use promises instead)
   * and it resolves only the response (no access to jqXHR or textStatus).
   */
  function request() {
    deprecate('ember-ajax/request is deprecated and will be removed in ember-ajax@2.0.0', false, { id: 'ember-ajax.raw' });
    return _emberAjaxRaw['default'].apply(undefined, arguments).then(function (result) {
      return result.response;
    }, null, 'ember-ajax: unwrap raw ajax response');
  }
});
define('ember-ajax/services/ajax', ['exports', 'ember', 'ember-ajax/errors', 'ember-ajax/utils/parse-response-headers'], function (exports, _ember, _emberAjaxErrors, _emberAjaxUtilsParseResponseHeaders) {
  'use strict';

  var deprecate = _ember['default'].deprecate;
  var get = _ember['default'].get;
  var isBlank = _ember['default'].isBlank;

  /**
    ### Headers customization
  
    Some APIs require HTTP headers, e.g. to provide an API key. Arbitrary
    headers can be set as key/value pairs on the `RESTAdapter`'s `headers`
    object and Ember Data will send them along with each ajax request.
  
    ```app/services/ajax
    import AjaxService from 'ember-ajax/services/ajax';
  
    export default AjaxService.extend({
      headers: {
        "API_KEY": "secret key",
        "ANOTHER_HEADER": "Some header value"
      }
    });
    ```
  
    `headers` can also be used as a computed property to support dynamic
    headers.
  
    ```app/services/ajax.js
    import Ember from 'ember';
    import AjaxService from 'ember-ajax/services/ajax';
  
    export default AjaxService.extend({
      session: Ember.inject.service(),
      headers: Ember.computed("session.authToken", function() {
        return {
          "API_KEY": this.get("session.authToken"),
          "ANOTHER_HEADER": "Some header value"
        };
      })
    });
    ```
  
    In some cases, your dynamic headers may require data from some
    object outside of Ember's observer system (for example
    `document.cookie`). You can use the
    [volatile](/api/classes/Ember.ComputedProperty.html#method_volatile)
    function to set the property into a non-cached mode causing the headers to
    be recomputed with every request.
  
    ```app/services/ajax.js
    import Ember from 'ember';
    import AjaxService from 'ember-ajax/services/ajax';
  
    export default AjaxService.extend({
      session: Ember.inject.service(),
      headers: Ember.computed("session.authToken", function() {
        return {
          "API_KEY": Ember.get(document.cookie.match(/apiKey\=([^;]*)/), "1"),
          "ANOTHER_HEADER": "Some header value"
        };
      }).volatile()
    });
    ```
  
  **/
  exports['default'] = _ember['default'].Service.extend({

    request: function request(url, options) {
      var _this = this;

      var opts;

      if (arguments.length > 2 || typeof options === 'string') {
        deprecate('ember-ajax/ajax#request calling request with `type` is deprecated and will be removed in ember-ajax@1.0.0. If you want to specify a type pass an object like {type: \'DELETE\'}', false, { id: 'ember-ajax.service.request' });

        if (arguments.length > 2) {
          opts = arguments[2];
          opts.type = options;
        } else {
          opts = { type: options };
        }
      } else {
        opts = options;
      }

      var hash = this.options(url, opts);

      return new _ember['default'].RSVP.Promise(function (resolve, reject) {

        hash.success = function (payload, textStatus, jqXHR) {
          var response = _this.handleResponse(jqXHR.status, (0, _emberAjaxUtilsParseResponseHeaders['default'])(jqXHR.getAllResponseHeaders()), payload);

          if (response instanceof _emberAjaxErrors.AjaxError) {
            reject(response);
          } else {
            resolve(response);
          }
        };

        hash.error = function (jqXHR, textStatus, errorThrown) {
          var error = undefined;

          if (!(error instanceof Error)) {
            if (errorThrown instanceof Error) {
              error = errorThrown;
            } else {
              error = _this.handleResponse(jqXHR.status, (0, _emberAjaxUtilsParseResponseHeaders['default'])(jqXHR.getAllResponseHeaders()), _this.parseErrorResponse(jqXHR.responseText) || errorThrown);
            }
          }
          reject(error);
        };

        _ember['default'].$.ajax(hash);
      }, 'ember-ajax: ' + hash.type + ' to ' + url);
    },

    // calls `request()` but forces `options.type` to `POST`
    post: function post(url, options) {
      return this.request(url, this._addTypeToOptionsFor(options, 'POST'));
    },

    // calls `request()` but forces `options.type` to `PUT`
    put: function put(url, options) {
      return this.request(url, this._addTypeToOptionsFor(options, 'PUT'));
    },

    // calls `request()` but forces `options.type` to `PATCH`
    patch: function patch(url, options) {
      return this.request(url, this._addTypeToOptionsFor(options, 'PATCH'));
    },

    // calls `request()` but forces `options.type` to `DELETE`
    del: function del(url, options) {
      return this.request(url, this._addTypeToOptionsFor(options, 'DELETE'));
    },

    // forcibly manipulates the options hash to include the HTTP method on the type key
    _addTypeToOptionsFor: function _addTypeToOptionsFor(options, method) {
      options = options || {};
      options.type = method;
      return options;
    },

    /**
      @method options
      @private
      @param {String} url
      @param {Object} options
      @return {Object}
    */
    options: function options(url, _options) {
      var hash = _options || {};
      hash.url = this._buildURL(url);
      hash.type = hash.type || 'GET';
      hash.dataType = hash.dataType || 'json';
      hash.context = this;

      var headers = get(this, 'headers');
      if (headers !== undefined) {
        hash.beforeSend = function (xhr) {
          Object.keys(headers).forEach(function (key) {
            return xhr.setRequestHeader(key, headers[key]);
          });
        };
      }

      return hash;
    },

    _buildURL: function _buildURL(url) {
      var host = get(this, 'host');
      if (isBlank(host)) {
        return url;
      }
      var startsWith = String.prototype.startsWith || function (searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
      };
      if (startsWith.call(url, '/')) {
        return '' + host + url;
      } else {
        return host + '/' + url;
      }
    },

    /**
     Takes an ajax response, and returns the json payload or an error.
      By default this hook just returns the json payload passed to it.
     You might want to override it in two cases:
      1. Your API might return useful results in the response headers.
     Response headers are passed in as the second argument.
      2. Your API might return errors as successful responses with status code
     200 and an Errors text or object.
     @method handleResponse
     @param  {Number} status
     @param  {Object} headers
     @param  {Object} payload
     @return {Object | DS.AdapterError} response
    */
    handleResponse: function handleResponse(status, headers, payload) {
      if (this.isSuccess(status, headers, payload)) {
        return payload;
      } else if (this.isUnauthorized(status, headers, payload)) {
        return new _emberAjaxErrors.UnauthorizedError(payload.errors);
      } else if (this.isForbidden(status, headers, payload)) {
        return new _emberAjaxErrors.ForbiddenError(payload.errors);
      } else if (this.isInvalid(status, headers, payload)) {
        return new _emberAjaxErrors.InvalidError(payload.errors);
      }

      var errors = this.normalizeErrorResponse(status, headers, payload);

      return new _emberAjaxErrors.AjaxError(errors);
    },

    /**
     Default `handleResponse` implementation uses this hook to decide if the
     response is a an authorized error.
     @method isUnauthorized
     @param  {Number} status
     @param  {Object} headers
     @param  {Object} payload
     @return {Boolean}
    */
    isUnauthorized: function isUnauthorized(status /*, headers, payload */) {
      return status === 401;
    },

    /**
       Default `handleResponse` implementation uses this hook to decide if the
       response is a forbidden error.
       @method isForbidden
       @param  {Number} status
       @param  {Object} headers
       @param  {Object} payload
       @return {Boolean}
     */
    isForbidden: function isForbidden(status /*, headers, payload */) {
      return status === 403;
    },

    /**
      Default `handleResponse` implementation uses this hook to decide if the
      response is a an invalid error.
      @method isInvalid
      @param  {Number} status
      @param  {Object} headers
      @param  {Object} payload
      @return {Boolean}
    */
    isInvalid: function isInvalid(status /*, headers, payload */) {
      return status === 422;
    },

    /**
     Default `handleResponse` implementation uses this hook to decide if the
     response is a success.
     @method isSuccess
     @param  {Number} status
     @param  {Object} headers
     @param  {Object} payload
     @return {Boolean}
    */
    isSuccess: function isSuccess(status /*, headers, payload */) {
      return status >= 200 && status < 300 || status === 304;
    },

    /**
      @method parseErrorResponse
      @private
      @param {String} responseText
      @return {Object}
    */
    parseErrorResponse: function parseErrorResponse(responseText) {
      var json = responseText;

      try {
        json = _ember['default'].$.parseJSON(responseText);
      } catch (e) {}

      return json;
    },

    /**
      @method normalizeErrorResponse
      @private
      @param  {Number} status
      @param  {Object} headers
      @param  {Object} payload
      @return {Object} errors payload
    */
    normalizeErrorResponse: function normalizeErrorResponse(status, headers, payload) {
      if (payload && typeof payload === 'object' && payload.errors) {
        return payload.errors;
      } else {
        return [{
          status: '' + status,
          title: "The backend responded with an error",
          detail: '' + payload
        }];
      }
    }
  });
});
define("ember-ajax/utils/parse-args", ["exports"], function (exports) {
  "use strict";

  var _slicedToArray = (function () {
    function sliceIterator(arr, i) {
      var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;_e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }return _arr;
    }return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  })();

  exports["default"] = parseArgs;

  function parseArgs() {
    var args = [].slice.apply(arguments);
    if (args.length === 1) {
      if (typeof args[0] === "string") {
        var _args = _slicedToArray(args, 1);

        var url = _args[0];

        return [url];
      } else {
        var _args2 = _slicedToArray(args, 1);

        var options = _args2[0];
        var url = options.url;

        delete options.url;
        var type = options.type || options.method;
        delete options.type;
        delete options.method;
        return [url, type, options];
      }
    }
    if (args.length === 2) {
      var _args3 = _slicedToArray(args, 1);

      var url = _args3[0];

      if (typeof args[1] === 'object') {
        var options = args[1];
        var type = options.type || options.method;
        delete options.type;
        delete options.method;
        return [url, type, options];
      } else {
        var type = args[1];
        return [url, type];
      }
    }
    return args;
  }
});
define('ember-ajax/utils/parse-response-headers', ['exports'], function (exports) {
  'use strict';

  exports['default'] = parseResponseHeaders;

  function parseResponseHeaders(headerStr) {
    var headers = Object.create(null);
    if (!headerStr) {
      return headers;
    }

    var headerPairs = headerStr.split('\r\n');
    for (var i = 0; i < headerPairs.length; i++) {
      var headerPair = headerPairs[i];
      // Can't use split() here because it does the wrong thing
      // if the header value has the string ": " in it.
      var index = headerPair.indexOf(': ');
      if (index > 0) {
        var key = headerPair.substring(0, index);
        var val = headerPair.substring(index + 2);
        headers[key] = val;
      }
    }

    return headers;
  }
});
define('ember-cli-app-version/components/app-version', ['exports', 'ember', 'ember-cli-app-version/templates/app-version'], function (exports, _ember, _emberCliAppVersionTemplatesAppVersion) {
  'use strict';

  exports['default'] = _ember['default'].Component.extend({
    tagName: 'span',
    layout: _emberCliAppVersionTemplatesAppVersion['default']
  });
});
define('ember-cli-app-version/initializer-factory', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports['default'] = initializerFactory;

  var classify = _ember['default'].String.classify;

  function initializerFactory(name, version) {
    var registered = false;

    return function () {
      if (!registered && name && version) {
        var appName = classify(name);
        _ember['default'].libraries.register(appName, version);
        registered = true;
      }
    };
  }
});
define("ember-cli-app-version/templates/app-version", ["exports"], function (exports) {
  "use strict";

  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type"]
        },
        "revision": "Ember@2.4.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "modules/ember-cli-app-version/templates/app-version.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["content", "version", ["loc", [null, [1, 0], [1, 11]]]]],
      locals: [],
      templates: []
    };
  })());
});
define('ember-component-inbound-actions/action-proxy', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports['default'] = _ember['default'].Object.extend(_ember['default'].ActionHandler);
});
define('ember-component-inbound-actions/inbound-actions', ['exports', 'ember', 'ember-component-inbound-actions/action-proxy'], function (exports, _ember, _emberComponentInboundActionsActionProxy) {
  'use strict';

  var scheduleInAfterRender = /^1\.13|^[2-9]/.test(_ember['default'].VERSION);

  exports['default'] = _ember['default'].Mixin.create({
    _inbound_actions_setup: _ember['default'].on('init', function () {
      var _this = this;

      this._inbound_actions_maybeScheduleInAfterRender(function () {
        var proxy = _emberComponentInboundActionsActionProxy['default'].create({ target: _this });
        _this.set('actionReceiver', proxy);
      });
    }),
    _inbound_actions_maybeScheduleInAfterRender: function _inbound_actions_maybeScheduleInAfterRender(fn) {
      if (scheduleInAfterRender) {
        _ember['default'].run.schedule('afterRender', this, fn);
      } else {
        fn();
      }
    }
  });
});
define('ember-data/-private/adapters/build-url-mixin', ['exports'], function (exports) {
  'use strict';

  var get = Ember.get;

  /**
  
    WARNING: This interface is likely to change in order to accomodate https://github.com/emberjs/rfcs/pull/4
  
    ## Using BuildURLMixin
  
    To use url building, include the mixin when extending an adapter, and call `buildURL` where needed.
    The default behaviour is designed for RESTAdapter.
  
    ### Example
  
    ```javascript
    export default DS.Adapter.extend(BuildURLMixin, {
      findRecord: function(store, type, id, snapshot) {
        var url = this.buildURL(type.modelName, id, snapshot, 'findRecord');
        return this.ajax(url, 'GET');
      }
    });
    ```
  
    ### Attributes
  
    The `host` and `namespace` attributes will be used if defined, and are optional.
  
    @class BuildURLMixin
    @namespace DS
  */
  exports['default'] = Ember.Mixin.create({
    /**
      Builds a URL for a given type and optional ID.
       By default, it pluralizes the type's name (for example, 'post'
      becomes 'posts' and 'person' becomes 'people'). To override the
      pluralization see [pathForType](#method_pathForType).
       If an ID is specified, it adds the ID to the path generated
      for the type, separated by a `/`.
       When called by RESTAdapter.findMany() the `id` and `snapshot` parameters
      will be arrays of ids and snapshots.
       @method buildURL
      @param {String} modelName
      @param {(String|Array|Object)} id single id or array of ids or query
      @param {(DS.Snapshot|Array)} snapshot single snapshot or array of snapshots
      @param {String} requestType
      @param {Object} query object of query parameters to send for query requests.
      @return {String} url
    */
    buildURL: function buildURL(modelName, id, snapshot, requestType, query) {
      switch (requestType) {
        case 'findRecord':
          return this.urlForFindRecord(id, modelName, snapshot);
        case 'findAll':
          return this.urlForFindAll(modelName);
        case 'query':
          return this.urlForQuery(query, modelName);
        case 'queryRecord':
          return this.urlForQueryRecord(query, modelName);
        case 'findMany':
          return this.urlForFindMany(id, modelName, snapshot);
        case 'findHasMany':
          return this.urlForFindHasMany(id, modelName);
        case 'findBelongsTo':
          return this.urlForFindBelongsTo(id, modelName);
        case 'createRecord':
          return this.urlForCreateRecord(modelName, snapshot);
        case 'updateRecord':
          return this.urlForUpdateRecord(id, modelName, snapshot);
        case 'deleteRecord':
          return this.urlForDeleteRecord(id, modelName, snapshot);
        default:
          return this._buildURL(modelName, id);
      }
    },

    /**
      @method _buildURL
      @private
      @param {String} modelName
      @param {String} id
      @return {String} url
    */
    _buildURL: function _buildURL(modelName, id) {
      var url = [];
      var host = get(this, 'host');
      var prefix = this.urlPrefix();
      var path;

      if (modelName) {
        path = this.pathForType(modelName);
        if (path) {
          url.push(path);
        }
      }

      if (id) {
        url.push(encodeURIComponent(id));
      }
      if (prefix) {
        url.unshift(prefix);
      }

      url = url.join('/');
      if (!host && url && url.charAt(0) !== '/') {
        url = '/' + url;
      }

      return url;
    },

    /**
     * @method urlForFindRecord
     * @param {String} id
     * @param {String} modelName
     * @param {DS.Snapshot} snapshot
     * @return {String} url
     */
    urlForFindRecord: function urlForFindRecord(id, modelName, snapshot) {
      return this._buildURL(modelName, id);
    },

    /**
     * @method urlForFindAll
     * @param {String} modelName
     * @return {String} url
     */
    urlForFindAll: function urlForFindAll(modelName) {
      return this._buildURL(modelName);
    },

    /**
     * @method urlForQuery
     * @param {Object} query
     * @param {String} modelName
     * @return {String} url
     */
    urlForQuery: function urlForQuery(query, modelName) {
      return this._buildURL(modelName);
    },

    /**
     * @method urlForQueryRecord
     * @param {Object} query
     * @param {String} modelName
     * @return {String} url
     */
    urlForQueryRecord: function urlForQueryRecord(query, modelName) {
      return this._buildURL(modelName);
    },

    /**
     * @method urlForFindMany
     * @param {Array} ids
     * @param {String} modelName
     * @param {Array} snapshots
     * @return {String} url
     */
    urlForFindMany: function urlForFindMany(ids, modelName, snapshots) {
      return this._buildURL(modelName);
    },

    /**
     * @method urlForFindHasMany
     * @param {String} id
     * @param {String} modelName
     * @return {String} url
     */
    urlForFindHasMany: function urlForFindHasMany(id, modelName) {
      return this._buildURL(modelName, id);
    },

    /**
     * @method urlForFindBelongTo
     * @param {String} id
     * @param {String} modelName
     * @return {String} url
     */
    urlForFindBelongsTo: function urlForFindBelongsTo(id, modelName) {
      return this._buildURL(modelName, id);
    },

    /**
     * @method urlForCreateRecord
     * @param {String} modelName
     * @param {DS.Snapshot} snapshot
     * @return {String} url
     */
    urlForCreateRecord: function urlForCreateRecord(modelName, snapshot) {
      return this._buildURL(modelName);
    },

    /**
     * @method urlForUpdateRecord
     * @param {String} id
     * @param {String} modelName
     * @param {DS.Snapshot} snapshot
     * @return {String} url
     */
    urlForUpdateRecord: function urlForUpdateRecord(id, modelName, snapshot) {
      return this._buildURL(modelName, id);
    },

    /**
     * @method urlForDeleteRecord
     * @param {String} id
     * @param {String} modelName
     * @param {DS.Snapshot} snapshot
     * @return {String} url
     */
    urlForDeleteRecord: function urlForDeleteRecord(id, modelName, snapshot) {
      return this._buildURL(modelName, id);
    },

    /**
      @method urlPrefix
      @private
      @param {String} path
      @param {String} parentURL
      @return {String} urlPrefix
    */
    urlPrefix: function urlPrefix(path, parentURL) {
      var host = get(this, 'host');
      var namespace = get(this, 'namespace');
      var url = [];

      if (path) {
        // Protocol relative url
        //jscs:disable disallowEmptyBlocks
        if (/^\/\//.test(path)) {
          // Do nothing, the full host is already included. This branch
          // avoids the absolute path logic and the relative path logic.

          // Absolute path
        } else if (path.charAt(0) === '/') {
            //jscs:enable disallowEmptyBlocks
            if (host) {
              path = path.slice(1);
              url.push(host);
            }
            // Relative path
          } else if (!/^http(s)?:\/\//.test(path)) {
              url.push(parentURL);
            }
      } else {
        if (host) {
          url.push(host);
        }
        if (namespace) {
          url.push(namespace);
        }
      }

      if (path) {
        url.push(path);
      }

      return url.join('/');
    },

    /**
      Determines the pathname for a given type.
       By default, it pluralizes the type's name (for example,
      'post' becomes 'posts' and 'person' becomes 'people').
       ### Pathname customization
       For example if you have an object LineItem with an
      endpoint of "/line_items/".
       ```app/adapters/application.js
      import DS from 'ember-data';
       export default DS.RESTAdapter.extend({
        pathForType: function(modelName) {
          var decamelized = Ember.String.decamelize(modelName);
          return Ember.String.pluralize(decamelized);
        }
      });
      ```
       @method pathForType
      @param {String} modelName
      @return {String} path
    **/
    pathForType: function pathForType(modelName) {
      var camelized = Ember.String.camelize(modelName);
      return Ember.String.pluralize(camelized);
    }
  });
});
define('ember-data/-private/adapters/errors', ['exports', 'ember', 'ember-data/-private/debug'], function (exports, _ember, _emberDataPrivateDebug) {
  'use strict';

  exports.AdapterError = AdapterError;
  exports.InvalidError = InvalidError;
  exports.TimeoutError = TimeoutError;
  exports.AbortError = AbortError;
  exports.errorsHashToArray = errorsHashToArray;
  exports.errorsArrayToHash = errorsArrayToHash;

  var EmberError = _ember['default'].Error;

  var SOURCE_POINTER_REGEXP = /^\/?data\/(attributes|relationships)\/(.*)/;
  var SOURCE_POINTER_PRIMARY_REGEXP = /^\/?data/;
  var PRIMARY_ATTRIBUTE_KEY = 'base';

  /**
    @class AdapterError
    @namespace DS
  */

  function AdapterError(errors) {
    var message = arguments.length <= 1 || arguments[1] === undefined ? 'Adapter operation failed' : arguments[1];

    EmberError.call(this, message);

    this.errors = errors || [{
      title: 'Adapter Error',
      detail: message
    }];
  }

  AdapterError.prototype = Object.create(EmberError.prototype);

  /**
    A `DS.InvalidError` is used by an adapter to signal the external API
    was unable to process a request because the content was not
    semantically correct or meaningful per the API. Usually this means a
    record failed some form of server side validation. When a promise
    from an adapter is rejected with a `DS.InvalidError` the record will
    transition to the `invalid` state and the errors will be set to the
    `errors` property on the record.
  
    For Ember Data to correctly map errors to their corresponding
    properties on the model, Ember Data expects each error to be
    a valid json-api error object with a `source/pointer` that matches
    the property name. For example if you had a Post model that
    looked like this.
  
    ```app/models/post.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      title: DS.attr('string'),
      content: DS.attr('string')
    });
    ```
  
    To show an error from the server related to the `title` and
    `content` properties your adapter could return a promise that
    rejects with a `DS.InvalidError` object that looks like this:
  
    ```app/adapters/post.js
    import Ember from 'ember';
    import DS from 'ember-data';
  
    export default DS.RESTAdapter.extend({
      updateRecord: function() {
        // Fictional adapter that always rejects
        return Ember.RSVP.reject(new DS.InvalidError([
          {
            detail: 'Must be unique',
            source: { pointer: '/data/attributes/title' }
          },
          {
            detail: 'Must not be blank',
            source: { pointer: '/data/attributes/content'}
          }
        ]));
      }
    });
    ```
  
    Your backend may use different property names for your records the
    store will attempt extract and normalize the errors using the
    serializer's `extractErrors` method before the errors get added to
    the the model. As a result, it is safe for the `InvalidError` to
    wrap the error payload unaltered.
  
    @class InvalidError
    @namespace DS
  */

  function InvalidError(errors) {
    (0, _emberDataPrivateDebug.assert)('`InvalidError` expects json-api formatted errors array.', _ember['default'].isArray(errors || []));
    AdapterError.call(this, errors, 'The adapter rejected the commit because it was invalid');
  }

  InvalidError.prototype = Object.create(AdapterError.prototype);

  /**
    @class TimeoutError
    @namespace DS
  */

  function TimeoutError() {
    AdapterError.call(this, null, 'The adapter operation timed out');
  }

  TimeoutError.prototype = Object.create(AdapterError.prototype);

  /**
    @class AbortError
    @namespace DS
  */

  function AbortError() {
    AdapterError.call(this, null, 'The adapter operation was aborted');
  }

  AbortError.prototype = Object.create(AdapterError.prototype);

  /**
    @method errorsHashToArray
    @private
  */

  function errorsHashToArray(errors) {
    var out = [];

    if (_ember['default'].isPresent(errors)) {
      Object.keys(errors).forEach(function (key) {
        var messages = _ember['default'].makeArray(errors[key]);
        for (var i = 0; i < messages.length; i++) {
          var title = 'Invalid Attribute';
          var pointer = '/data/attributes/' + key;
          if (key === PRIMARY_ATTRIBUTE_KEY) {
            title = 'Invalid Document';
            pointer = '/data';
          }
          out.push({
            title: title,
            detail: messages[i],
            source: {
              pointer: pointer
            }
          });
        }
      });
    }

    return out;
  }

  /**
    @method errorsArrayToHash
    @private
  */

  function errorsArrayToHash(errors) {
    var out = {};

    if (_ember['default'].isPresent(errors)) {
      errors.forEach(function (error) {
        if (error.source && error.source.pointer) {
          var key = error.source.pointer.match(SOURCE_POINTER_REGEXP);

          if (key) {
            key = key[2];
          } else if (error.source.pointer.search(SOURCE_POINTER_PRIMARY_REGEXP) !== -1) {
            key = PRIMARY_ATTRIBUTE_KEY;
          }

          if (key) {
            out[key] = out[key] || [];
            out[key].push(error.detail || error.title);
          }
        }
      });
    }

    return out;
  }
});
define("ember-data/-private/adapters", ["exports", "ember-data/adapters/json-api", "ember-data/adapters/rest"], function (exports, _emberDataAdaptersJsonApi, _emberDataAdaptersRest) {
  /**
    @module ember-data
  */

  "use strict";

  exports.JSONAPIAdapter = _emberDataAdaptersJsonApi["default"];
  exports.RESTAdapter = _emberDataAdaptersRest["default"];
});
define('ember-data/-private/core', ['exports', 'ember', 'ember-data/version'], function (exports, _ember, _emberDataVersion) {
  'use strict';

  /**
    @module ember-data
  */

  /**
    All Ember Data methods and functions are defined inside of this namespace.
  
    @class DS
    @static
  */

  /**
    @property VERSION
    @type String
    @static
  */
  /*jshint -W079 */
  var DS = _ember['default'].Namespace.create({
    VERSION: _emberDataVersion['default']
  });

  if (_ember['default'].libraries) {
    _ember['default'].libraries.registerCoreLibrary('Ember Data', DS.VERSION);
  }

  // var EMBER_DATA_FEATURES = EMBER_DATA_FEATURES_PLACEHOLDER; //jshint ignore: line

  // Ember.merge(Ember.FEATURES, EMBER_DATA_FEATURES);

  exports['default'] = DS;
});
define('ember-data/-private/debug', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports.assert = assert;
  exports.debug = debug;
  exports.deprecate = deprecate;
  exports.info = info;
  exports.runInDebug = runInDebug;
  exports.warn = warn;
  exports.debugSeal = debugSeal;

  function assert() {
    return _ember['default'].assert.apply(_ember['default'], arguments);
  }

  function debug() {
    return _ember['default'].debug.apply(_ember['default'], arguments);
  }

  function deprecate() {
    return _ember['default'].deprecate.apply(_ember['default'], arguments);
  }

  function info() {
    return _ember['default'].info.apply(_ember['default'], arguments);
  }

  function runInDebug() {
    return _ember['default'].runInDebug.apply(_ember['default'], arguments);
  }

  function warn() {
    return _ember['default'].warn.apply(_ember['default'], arguments);
  }

  function debugSeal() {
    return _ember['default'].debugSeal.apply(_ember['default'], arguments);
  }
});
define('ember-data/-private/ext/date', ['exports'], function (exports) {
  /**
    @module ember-data
  */

  /**
    Date.parse with progressive enhancement for ISO 8601 <https://github.com/csnover/js-iso8601>
  
    © 2011 Colin Snover <http://zetafleet.com>
  
    Released under MIT license.
  
    @class Date
    @namespace Ember
    @static
  */
  'use strict';

  Ember.Date = Ember.Date || {};

  var origParse = Date.parse;
  var numericKeys = [1, 4, 5, 6, 7, 10, 11];

  /**
    @method parse
    @param {Date} date
    @return {Number} timestamp
  */
  Ember.Date.parse = function (date) {
    var timestamp, struct;
    var minutesOffset = 0;

    // ES5 §15.9.4.2 states that the string should attempt to be parsed as a Date Time String Format string
    // before falling back to any implementation-specific date parsing, so that’s what we do, even if native
    // implementations could be faster
    //              1 YYYY                2 MM       3 DD           4 HH    5 mm       6 ss        7 msec        8 Z 9 ±    10 tzHH    11 tzmm
    if (struct = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/.exec(date)) {
      // avoid NaN timestamps caused by “undefined” values being passed to Date.UTC
      for (var i = 0, k; k = numericKeys[i]; ++i) {
        struct[k] = +struct[k] || 0;
      }

      // allow undefined days and months
      struct[2] = (+struct[2] || 1) - 1;
      struct[3] = +struct[3] || 1;

      if (struct[8] !== 'Z' && struct[9] !== undefined) {
        minutesOffset = struct[10] * 60 + struct[11];

        if (struct[9] === '+') {
          minutesOffset = 0 - minutesOffset;
        }
      }

      timestamp = Date.UTC(struct[1], struct[2], struct[3], struct[4], struct[5] + minutesOffset, struct[6], struct[7]);
    } else {
      timestamp = origParse ? origParse(date) : NaN;
    }

    return timestamp;
  };

  if (Ember.EXTEND_PROTOTYPES === true || Ember.EXTEND_PROTOTYPES.Date) {
    Date.parse = Ember.Date.parse;
  }
});
define('ember-data/-private/features', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports['default'] = isEnabled;

  function isEnabled() {
    var _Ember$FEATURES;

    return (_Ember$FEATURES = _ember['default'].FEATURES).isEnabled.apply(_Ember$FEATURES, arguments);
  }
});
define("ember-data/-private/initializers/data-adapter", ["exports", "ember-data/-private/system/debug/debug-adapter"], function (exports, _emberDataPrivateSystemDebugDebugAdapter) {
  "use strict";

  exports["default"] = initializeDebugAdapter;

  /**
    Configures a registry with injections on Ember applications
    for the Ember-Data store. Accepts an optional namespace argument.
  
    @method initializeStoreInjections
    @param {Ember.Registry} registry
  */
  function initializeDebugAdapter(registry) {
    registry.register('data-adapter:main', _emberDataPrivateSystemDebugDebugAdapter["default"]);
  }
});
define('ember-data/-private/initializers/store-injections', ['exports'], function (exports) {
  'use strict';

  exports['default'] = initializeStoreInjections;

  /**
    Configures a registry with injections on Ember applications
    for the Ember-Data store. Accepts an optional namespace argument.
  
    @method initializeStoreInjections
    @param {Ember.Registry} registry
  */
  function initializeStoreInjections(registry) {
    // registry.injection for Ember < 2.1.0
    // application.inject for Ember 2.1.0+
    var inject = registry.inject || registry.injection;
    inject.call(registry, 'controller', 'store', 'service:store');
    inject.call(registry, 'route', 'store', 'service:store');
    inject.call(registry, 'data-adapter', 'store', 'service:store');
  }
});
define("ember-data/-private/initializers/store", ["exports", "ember-data/-private/system/store", "ember-data/-private/serializers", "ember-data/-private/adapters"], function (exports, _emberDataPrivateSystemStore, _emberDataPrivateSerializers, _emberDataPrivateAdapters) {
  "use strict";

  exports["default"] = initializeStore;

  function has(applicationOrRegistry, fullName) {
    if (applicationOrRegistry.has) {
      // < 2.1.0
      return applicationOrRegistry.has(fullName);
    } else {
      // 2.1.0+
      return applicationOrRegistry.hasRegistration(fullName);
    }
  }

  /**
    Configures a registry for use with an Ember-Data
    store. Accepts an optional namespace argument.
  
    @method initializeStore
    @param {Ember.Registry} registry
  */
  function initializeStore(registry) {
    // registry.optionsForType for Ember < 2.1.0
    // application.registerOptionsForType for Ember 2.1.0+
    var registerOptionsForType = registry.registerOptionsForType || registry.optionsForType;
    registerOptionsForType.call(registry, 'serializer', { singleton: false });
    registerOptionsForType.call(registry, 'adapter', { singleton: false });

    registry.register('serializer:-default', _emberDataPrivateSerializers.JSONSerializer);
    registry.register('serializer:-rest', _emberDataPrivateSerializers.RESTSerializer);
    registry.register('adapter:-rest', _emberDataPrivateAdapters.RESTAdapter);

    registry.register('adapter:-json-api', _emberDataPrivateAdapters.JSONAPIAdapter);
    registry.register('serializer:-json-api', _emberDataPrivateSerializers.JSONAPISerializer);

    if (!has(registry, 'service:store')) {
      registry.register('service:store', _emberDataPrivateSystemStore["default"]);
    }
  }
});
define('ember-data/-private/initializers/transforms', ['exports', 'ember-data/-private/transforms'], function (exports, _emberDataPrivateTransforms) {
  'use strict';

  exports['default'] = initializeTransforms;

  /**
    Configures a registry for use with Ember-Data
    transforms.
  
    @method initializeTransforms
    @param {Ember.Registry} registry
  */
  function initializeTransforms(registry) {
    registry.register('transform:boolean', _emberDataPrivateTransforms.BooleanTransform);
    registry.register('transform:date', _emberDataPrivateTransforms.DateTransform);
    registry.register('transform:number', _emberDataPrivateTransforms.NumberTransform);
    registry.register('transform:string', _emberDataPrivateTransforms.StringTransform);
  }
});
define('ember-data/-private/instance-initializers/initialize-store-service', ['exports'], function (exports) {
  'use strict';

  exports['default'] = initializeStoreService;

  /**
   Configures a registry for use with an Ember-Data
   store.
  
   @method initializeStore
   @param {Ember.ApplicationInstance} applicationOrRegistry
   */
  function initializeStoreService(application) {
    var container = application.lookup ? application : application.container;
    // Eagerly generate the store so defaultStore is populated.
    container.lookup('service:store');
  }
});
define('ember-data/-private/serializers/embedded-records-mixin', ['exports', 'ember', 'ember-data/-private/debug'], function (exports, _ember, _emberDataPrivateDebug) {
  'use strict';

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var get = _ember['default'].get;
  var set = _ember['default'].set;
  var camelize = _ember['default'].String.camelize;

  /**
    ## Using Embedded Records
  
    `DS.EmbeddedRecordsMixin` supports serializing embedded records.
  
    To set up embedded records, include the mixin when extending a serializer,
    then define and configure embedded (model) relationships.
  
    Below is an example of a per-type serializer (`post` type).
  
    ```app/serializers/post.js
    import DS from 'ember-data';
  
    export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
      attrs: {
        author: { embedded: 'always' },
        comments: { serialize: 'ids' }
      }
    });
    ```
    Note that this use of `{ embedded: 'always' }` is unrelated to
    the `{ embedded: 'always' }` that is defined as an option on `DS.attr` as part of
    defining a model while working with the `ActiveModelSerializer`.  Nevertheless,
    using `{ embedded: 'always' }` as an option to `DS.attr` is not a valid way to setup
    embedded records.
  
    The `attrs` option for a resource `{ embedded: 'always' }` is shorthand for:
  
    ```js
    {
      serialize: 'records',
      deserialize: 'records'
    }
    ```
  
    ### Configuring Attrs
  
    A resource's `attrs` option may be set to use `ids`, `records` or false for the
    `serialize`  and `deserialize` settings.
  
    The `attrs` property can be set on the `ApplicationSerializer` or a per-type
    serializer.
  
    In the case where embedded JSON is expected while extracting a payload (reading)
    the setting is `deserialize: 'records'`, there is no need to use `ids` when
    extracting as that is the default behavior without this mixin if you are using
    the vanilla `EmbeddedRecordsMixin`. Likewise, to embed JSON in the payload while
    serializing `serialize: 'records'` is the setting to use. There is an option of
    not embedding JSON in the serialized payload by using `serialize: 'ids'`. If you
    do not want the relationship sent at all, you can use `serialize: false`.
  
  
    ### EmbeddedRecordsMixin defaults
    If you do not overwrite `attrs` for a specific relationship, the `EmbeddedRecordsMixin`
    will behave in the following way:
  
    BelongsTo: `{ serialize: 'id', deserialize: 'id' }`
    HasMany:   `{ serialize: false, deserialize: 'ids' }`
  
    ### Model Relationships
  
    Embedded records must have a model defined to be extracted and serialized. Note that
    when defining any relationships on your model such as `belongsTo` and `hasMany`, you
    should not both specify `async: true` and also indicate through the serializer's
    `attrs` attribute that the related model should be embedded for deserialization.
    If a model is declared embedded for deserialization (`embedded: 'always'` or `deserialize: 'records'`),
    then do not use `async: true`.
  
    To successfully extract and serialize embedded records the model relationships
    must be setup correcty. See the
    [defining relationships](/guides/models/defining-models/#toc_defining-relationships)
    section of the **Defining Models** guide page.
  
    Records without an `id` property are not considered embedded records, model
    instances must have an `id` property to be used with Ember Data.
  
    ### Example JSON payloads, Models and Serializers
  
    **When customizing a serializer it is important to grok what the customizations
    are. Please read the docs for the methods this mixin provides, in case you need
    to modify it to fit your specific needs.**
  
    For example review the docs for each method of this mixin:
    * [normalize](/api/data/classes/DS.EmbeddedRecordsMixin.html#method_normalize)
    * [serializeBelongsTo](/api/data/classes/DS.EmbeddedRecordsMixin.html#method_serializeBelongsTo)
    * [serializeHasMany](/api/data/classes/DS.EmbeddedRecordsMixin.html#method_serializeHasMany)
  
    @class EmbeddedRecordsMixin
    @namespace DS
  */
  exports['default'] = _ember['default'].Mixin.create({

    /**
      Normalize the record and recursively normalize/extract all the embedded records
      while pushing them into the store as they are encountered
       A payload with an attr configured for embedded records needs to be extracted:
       ```js
      {
        "post": {
          "id": "1"
          "title": "Rails is omakase",
          "comments": [{
            "id": "1",
            "body": "Rails is unagi"
          }, {
            "id": "2",
            "body": "Omakase O_o"
          }]
        }
      }
      ```
     @method normalize
     @param {DS.Model} typeClass
     @param {Object} hash to be normalized
     @param {String} prop the hash has been referenced by
     @return {Object} the normalized hash
    **/
    normalize: function normalize(typeClass, hash, prop) {
      var normalizedHash = this._super(typeClass, hash, prop);
      return this._extractEmbeddedRecords(this, this.store, typeClass, normalizedHash);
    },

    keyForRelationship: function keyForRelationship(key, typeClass, method) {
      if (method === 'serialize' && this.hasSerializeRecordsOption(key) || method === 'deserialize' && this.hasDeserializeRecordsOption(key)) {
        return this.keyForAttribute(key, method);
      } else {
        return this._super(key, typeClass, method) || key;
      }
    },

    /**
      Serialize `belongsTo` relationship when it is configured as an embedded object.
       This example of an author model belongs to a post model:
       ```js
      Post = DS.Model.extend({
        title:    DS.attr('string'),
        body:     DS.attr('string'),
        author:   DS.belongsTo('author')
      });
       Author = DS.Model.extend({
        name:     DS.attr('string'),
        post:     DS.belongsTo('post')
      });
      ```
       Use a custom (type) serializer for the post model to configure embedded author
       ```app/serializers/post.js
      import DS from 'ember-data;
       export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
        attrs: {
          author: { embedded: 'always' }
        }
      })
      ```
       A payload with an attribute configured for embedded records can serialize
      the records together under the root attribute's payload:
       ```js
      {
        "post": {
          "id": "1"
          "title": "Rails is omakase",
          "author": {
            "id": "2"
            "name": "dhh"
          }
        }
      }
      ```
       @method serializeBelongsTo
      @param {DS.Snapshot} snapshot
      @param {Object} json
      @param {Object} relationship
    */
    serializeBelongsTo: function serializeBelongsTo(snapshot, json, relationship) {
      var attr = relationship.key;
      if (this.noSerializeOptionSpecified(attr)) {
        this._super(snapshot, json, relationship);
        return;
      }
      var includeIds = this.hasSerializeIdsOption(attr);
      var includeRecords = this.hasSerializeRecordsOption(attr);
      var embeddedSnapshot = snapshot.belongsTo(attr);
      var key;
      if (includeIds) {
        key = this.keyForRelationship(attr, relationship.kind, 'serialize');
        if (!embeddedSnapshot) {
          json[key] = null;
        } else {
          json[key] = embeddedSnapshot.id;

          if (relationship.options.polymorphic) {
            this.serializePolymorphicType(snapshot, json, relationship);
          }
        }
      } else if (includeRecords) {
        this._serializeEmbeddedBelongsTo(snapshot, json, relationship);
      }
    },

    _serializeEmbeddedBelongsTo: function _serializeEmbeddedBelongsTo(snapshot, json, relationship) {
      var embeddedSnapshot = snapshot.belongsTo(relationship.key);
      var serializedKey = this.keyForRelationship(relationship.key, 'serialize');
      if (!embeddedSnapshot) {
        json[serializedKey] = null;
      } else {
        json[serializedKey] = embeddedSnapshot.record.serialize({ includeId: true });
        this.removeEmbeddedForeignKey(snapshot, embeddedSnapshot, relationship, json[serializedKey]);

        if (relationship.options.polymorphic) {
          this.serializePolymorphicType(snapshot, json, relationship);
        }
      }
    },

    /**
      Serialize `hasMany` relationship when it is configured as embedded objects.
       This example of a post model has many comments:
       ```js
      Post = DS.Model.extend({
        title:    DS.attr('string'),
        body:     DS.attr('string'),
        comments: DS.hasMany('comment')
      });
       Comment = DS.Model.extend({
        body:     DS.attr('string'),
        post:     DS.belongsTo('post')
      });
      ```
       Use a custom (type) serializer for the post model to configure embedded comments
       ```app/serializers/post.js
      import DS from 'ember-data;
       export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
        attrs: {
          comments: { embedded: 'always' }
        }
      })
      ```
       A payload with an attribute configured for embedded records can serialize
      the records together under the root attribute's payload:
       ```js
      {
        "post": {
          "id": "1"
          "title": "Rails is omakase",
          "body": "I want this for my ORM, I want that for my template language..."
          "comments": [{
            "id": "1",
            "body": "Rails is unagi"
          }, {
            "id": "2",
            "body": "Omakase O_o"
          }]
        }
      }
      ```
       The attrs options object can use more specific instruction for extracting and
      serializing. When serializing, an option to embed `ids` or `records` can be set.
      When extracting the only option is `records`.
       So `{ embedded: 'always' }` is shorthand for:
      `{ serialize: 'records', deserialize: 'records' }`
       To embed the `ids` for a related object (using a hasMany relationship):
       ```app/serializers/post.js
      import DS from 'ember-data;
       export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
        attrs: {
          comments: { serialize: 'ids', deserialize: 'records' }
        }
      })
      ```
       ```js
      {
        "post": {
          "id": "1"
          "title": "Rails is omakase",
          "body": "I want this for my ORM, I want that for my template language..."
          "comments": ["1", "2"]
        }
      }
      ```
       @method serializeHasMany
      @param {DS.Snapshot} snapshot
      @param {Object} json
      @param {Object} relationship
    */
    serializeHasMany: function serializeHasMany(snapshot, json, relationship) {
      var attr = relationship.key;
      if (this.noSerializeOptionSpecified(attr)) {
        this._super(snapshot, json, relationship);
        return;
      }
      var includeIds = this.hasSerializeIdsOption(attr);
      var includeRecords = this.hasSerializeRecordsOption(attr);
      if (includeIds) {
        var serializedKey = this.keyForRelationship(attr, relationship.kind, 'serialize');
        json[serializedKey] = snapshot.hasMany(attr, { ids: true });
      } else if (includeRecords) {
        this._serializeEmbeddedHasMany(snapshot, json, relationship);
      }
    },

    _serializeEmbeddedHasMany: function _serializeEmbeddedHasMany(snapshot, json, relationship) {
      var serializedKey = this.keyForRelationship(relationship.key, 'serialize');

      (0, _emberDataPrivateDebug.warn)('The embedded relationship \'' + serializedKey + '\' is undefined for \'' + snapshot.modelName + '\' with id \'' + snapshot.id + '\'. Please include it in your original payload.', _ember['default'].typeOf(snapshot.hasMany(relationship.key)) !== 'undefined', { id: 'ds.serializer.embedded-relationship-undefined' });

      json[serializedKey] = this._generateSerializedHasMany(snapshot, relationship);
    },

    /*
      Returns an array of embedded records serialized to JSON
    */
    _generateSerializedHasMany: function _generateSerializedHasMany(snapshot, relationship) {
      var _this = this;

      var hasMany = snapshot.hasMany(relationship.key);
      return _ember['default'].A(hasMany).map(function (embeddedSnapshot) {
        var embeddedJson = embeddedSnapshot.record.serialize({ includeId: true });
        _this.removeEmbeddedForeignKey(snapshot, embeddedSnapshot, relationship, embeddedJson);
        return embeddedJson;
      });
    },

    /**
      When serializing an embedded record, modify the property (in the json payload)
      that refers to the parent record (foreign key for relationship).
       Serializing a `belongsTo` relationship removes the property that refers to the
      parent record
       Serializing a `hasMany` relationship does not remove the property that refers to
      the parent record.
       @method removeEmbeddedForeignKey
      @param {DS.Snapshot} snapshot
      @param {DS.Snapshot} embeddedSnapshot
      @param {Object} relationship
      @param {Object} json
    */
    removeEmbeddedForeignKey: function removeEmbeddedForeignKey(snapshot, embeddedSnapshot, relationship, json) {
      if (relationship.kind === 'hasMany') {
        return;
      } else if (relationship.kind === 'belongsTo') {
        var parentRecord = snapshot.type.inverseFor(relationship.key, this.store);
        if (parentRecord) {
          var name = parentRecord.name;
          var embeddedSerializer = this.store.serializerFor(embeddedSnapshot.modelName);
          var parentKey = embeddedSerializer.keyForRelationship(name, parentRecord.kind, 'deserialize');
          if (parentKey) {
            delete json[parentKey];
          }
        }
      }
    },

    // checks config for attrs option to embedded (always) - serialize and deserialize
    hasEmbeddedAlwaysOption: function hasEmbeddedAlwaysOption(attr) {
      var option = this.attrsOption(attr);
      return option && option.embedded === 'always';
    },

    // checks config for attrs option to serialize ids
    hasSerializeRecordsOption: function hasSerializeRecordsOption(attr) {
      var alwaysEmbed = this.hasEmbeddedAlwaysOption(attr);
      var option = this.attrsOption(attr);
      return alwaysEmbed || option && option.serialize === 'records';
    },

    // checks config for attrs option to serialize records
    hasSerializeIdsOption: function hasSerializeIdsOption(attr) {
      var option = this.attrsOption(attr);
      return option && (option.serialize === 'ids' || option.serialize === 'id');
    },

    // checks config for attrs option to serialize records
    noSerializeOptionSpecified: function noSerializeOptionSpecified(attr) {
      var option = this.attrsOption(attr);
      return !(option && (option.serialize || option.embedded));
    },

    // checks config for attrs option to deserialize records
    // a defined option object for a resource is treated the same as
    // `deserialize: 'records'`
    hasDeserializeRecordsOption: function hasDeserializeRecordsOption(attr) {
      var alwaysEmbed = this.hasEmbeddedAlwaysOption(attr);
      var option = this.attrsOption(attr);
      return alwaysEmbed || option && option.deserialize === 'records';
    },

    attrsOption: function attrsOption(attr) {
      var attrs = this.get('attrs');
      return attrs && (attrs[camelize(attr)] || attrs[attr]);
    },

    /**
     @method _extractEmbeddedRecords
     @private
    */
    _extractEmbeddedRecords: function _extractEmbeddedRecords(serializer, store, typeClass, partial) {
      var _this2 = this;

      typeClass.eachRelationship(function (key, relationship) {
        if (serializer.hasDeserializeRecordsOption(key)) {
          if (relationship.kind === "hasMany") {
            _this2._extractEmbeddedHasMany(store, key, partial, relationship);
          }
          if (relationship.kind === "belongsTo") {
            _this2._extractEmbeddedBelongsTo(store, key, partial, relationship);
          }
        }
      });
      return partial;
    },

    /**
     @method _extractEmbeddedHasMany
     @private
    */
    _extractEmbeddedHasMany: function _extractEmbeddedHasMany(store, key, hash, relationshipMeta) {
      var _this3 = this;

      var relationshipHash = get(hash, 'data.relationships.' + key + '.data');
      if (!relationshipHash) {
        return;
      }

      var hasMany = relationshipHash.map(function (item) {
        var _normalizeEmbeddedRelationship2 = _this3._normalizeEmbeddedRelationship(store, relationshipMeta, item);

        var data = _normalizeEmbeddedRelationship2.data;
        var included = _normalizeEmbeddedRelationship2.included;

        hash.included = hash.included || [];
        hash.included.push(data);
        if (included) {
          var _hash$included;

          (_hash$included = hash.included).push.apply(_hash$included, _toConsumableArray(included));
        }

        return { id: data.id, type: data.type };
      });

      var relationship = { data: hasMany };
      set(hash, 'data.relationships.' + key, relationship);
    },

    /**
     @method _extractEmbeddedBelongsTo
     @private
    */
    _extractEmbeddedBelongsTo: function _extractEmbeddedBelongsTo(store, key, hash, relationshipMeta) {
      var relationshipHash = get(hash, 'data.relationships.' + key + '.data');
      if (!relationshipHash) {
        return;
      }

      var _normalizeEmbeddedRelationship3 = this._normalizeEmbeddedRelationship(store, relationshipMeta, relationshipHash);

      var data = _normalizeEmbeddedRelationship3.data;
      var included = _normalizeEmbeddedRelationship3.included;

      hash.included = hash.included || [];
      hash.included.push(data);
      if (included) {
        var _hash$included2;

        (_hash$included2 = hash.included).push.apply(_hash$included2, _toConsumableArray(included));
      }

      var belongsTo = { id: data.id, type: data.type };
      var relationship = { data: belongsTo };

      set(hash, 'data.relationships.' + key, relationship);
    },

    /**
     @method _normalizeEmbeddedRelationship
     @private
    */
    _normalizeEmbeddedRelationship: function _normalizeEmbeddedRelationship(store, relationshipMeta, relationshipHash) {
      var modelName = relationshipMeta.type;
      if (relationshipMeta.options.polymorphic) {
        modelName = relationshipHash.type;
      }
      var modelClass = store.modelFor(modelName);
      var serializer = store.serializerFor(modelName);

      return serializer.normalize(modelClass, relationshipHash, null);
    }
  });
});
define("ember-data/-private/serializers", ["exports", "ember-data/serializers/json-api", "ember-data/serializers/json", "ember-data/serializers/rest"], function (exports, _emberDataSerializersJsonApi, _emberDataSerializersJson, _emberDataSerializersRest) {
  /**
    @module ember-data
  */

  "use strict";

  exports.JSONAPISerializer = _emberDataSerializersJsonApi["default"];
  exports.JSONSerializer = _emberDataSerializersJson["default"];
  exports.RESTSerializer = _emberDataSerializersRest["default"];
});
define("ember-data/-private/system/clone-null", ["exports", "ember-data/-private/system/empty-object"], function (exports, _emberDataPrivateSystemEmptyObject) {
  "use strict";

  exports["default"] = cloneNull;

  function cloneNull(source) {
    var clone = new _emberDataPrivateSystemEmptyObject["default"]();
    for (var key in source) {
      clone[key] = source[key];
    }
    return clone;
  }
});
define('ember-data/-private/system/coerce-id', ['exports'], function (exports) {
  'use strict';

  exports['default'] = coerceId;

  // Used by the store to normalize IDs entering the store.  Despite the fact
  // that developers may provide IDs as numbers (e.g., `store.findRecord('person', 1)`),
  // it is important that internally we use strings, since IDs may be serialized
  // and lose type information.  For example, Ember's router may put a record's
  // ID into the URL, and if we later try to deserialize that URL and find the
  // corresponding record, we will not know if it is a string or a number.

  function coerceId(id) {
    return id == null || id === '' ? null : id + '';
  }
});
define('ember-data/-private/system/container-proxy', ['exports', 'ember-data/-private/debug'], function (exports, _emberDataPrivateDebug) {
  'use strict';

  exports['default'] = ContainerProxy;

  /*
    This is used internally to enable deprecation of container paths and provide
    a decent message to the user indicating how to fix the issue.
  
    @class ContainerProxy
    @namespace DS
    @private
  */
  function ContainerProxy(container) {
    this.container = container;
  }

  ContainerProxy.prototype.aliasedFactory = function (path, preLookup) {
    var _this = this;

    return {
      create: function create() {
        if (preLookup) {
          preLookup();
        }

        return _this.container.lookup(path);
      }
    };
  };

  ContainerProxy.prototype.registerAlias = function (source, dest, preLookup) {
    var factory = this.aliasedFactory(dest, preLookup);

    return this.container.register(source, factory);
  };

  ContainerProxy.prototype.registerDeprecation = function (deprecated, valid) {
    var preLookupCallback = function preLookupCallback() {
      (0, _emberDataPrivateDebug.deprecate)('You tried to look up \'' + deprecated + '\', but this has been deprecated in favor of \'' + valid + '\'.', false, {
        id: 'ds.store.deprecated-lookup',
        until: '2.0.0'
      });
    };

    return this.registerAlias(deprecated, valid, preLookupCallback);
  };

  ContainerProxy.prototype.registerDeprecations = function (proxyPairs) {
    var i, proxyPair, deprecated, valid;

    for (i = proxyPairs.length; i > 0; i--) {
      proxyPair = proxyPairs[i - 1];
      deprecated = proxyPair['deprecated'];
      valid = proxyPair['valid'];

      this.registerDeprecation(deprecated, valid);
    }
  };
});
define('ember-data/-private/system/debug/debug-adapter', ['exports', 'ember', 'ember-data/model'], function (exports, _ember, _emberDataModel) {
  /**
    @module ember-data
  */
  'use strict';

  var get = _ember['default'].get;
  var capitalize = _ember['default'].String.capitalize;
  var underscore = _ember['default'].String.underscore;
  var assert = _ember['default'].assert;

  /*
    Extend `Ember.DataAdapter` with ED specific code.
  
    @class DebugAdapter
    @namespace DS
    @extends Ember.DataAdapter
    @private
  */
  exports['default'] = _ember['default'].DataAdapter.extend({
    getFilters: function getFilters() {
      return [{ name: 'isNew', desc: 'New' }, { name: 'isModified', desc: 'Modified' }, { name: 'isClean', desc: 'Clean' }];
    },

    detect: function detect(typeClass) {
      return typeClass !== _emberDataModel['default'] && _emberDataModel['default'].detect(typeClass);
    },

    columnsForType: function columnsForType(typeClass) {
      var columns = [{
        name: 'id',
        desc: 'Id'
      }];
      var count = 0;
      var self = this;
      get(typeClass, 'attributes').forEach(function (meta, name) {
        if (count++ > self.attributeLimit) {
          return false;
        }
        var desc = capitalize(underscore(name).replace('_', ' '));
        columns.push({ name: name, desc: desc });
      });
      return columns;
    },

    getRecords: function getRecords(modelClass, modelName) {
      if (arguments.length < 2) {
        // Legacy Ember.js < 1.13 support
        var containerKey = modelClass._debugContainerKey;
        if (containerKey) {
          var match = containerKey.match(/model:(.*)/);
          if (match) {
            modelName = match[1];
          }
        }
      }
      assert("Cannot find model name. Please upgrade to Ember.js >= 1.13 for Ember Inspector support", !!modelName);
      return this.get('store').peekAll(modelName);
    },

    getRecordColumnValues: function getRecordColumnValues(record) {
      var _this = this;

      var count = 0;
      var columnValues = { id: get(record, 'id') };

      record.eachAttribute(function (key) {
        if (count++ > _this.attributeLimit) {
          return false;
        }
        var value = get(record, key);
        columnValues[key] = value;
      });
      return columnValues;
    },

    getRecordKeywords: function getRecordKeywords(record) {
      var keywords = [];
      var keys = _ember['default'].A(['id']);
      record.eachAttribute(function (key) {
        return keys.push(key);
      });
      keys.forEach(function (key) {
        return keywords.push(get(record, key));
      });
      return keywords;
    },

    getRecordFilterValues: function getRecordFilterValues(record) {
      return {
        isNew: record.get('isNew'),
        isModified: record.get('hasDirtyAttributes') && !record.get('isNew'),
        isClean: !record.get('hasDirtyAttributes')
      };
    },

    getRecordColor: function getRecordColor(record) {
      var color = 'black';
      if (record.get('isNew')) {
        color = 'green';
      } else if (record.get('hasDirtyAttributes')) {
        color = 'blue';
      }
      return color;
    },

    observeRecord: function observeRecord(record, recordUpdated) {
      var releaseMethods = _ember['default'].A();
      var keysToObserve = _ember['default'].A(['id', 'isNew', 'hasDirtyAttributes']);

      record.eachAttribute(function (key) {
        return keysToObserve.push(key);
      });
      var adapter = this;

      keysToObserve.forEach(function (key) {
        var handler = function handler() {
          recordUpdated(adapter.wrapRecord(record));
        };
        _ember['default'].addObserver(record, key, handler);
        releaseMethods.push(function () {
          _ember['default'].removeObserver(record, key, handler);
        });
      });

      var release = function release() {
        releaseMethods.forEach(function (fn) {
          return fn();
        });
      };

      return release;
    }
  });
});
define('ember-data/-private/system/debug/debug-info', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports['default'] = _ember['default'].Mixin.create({

    /**
      Provides info about the model for debugging purposes
      by grouping the properties into more semantic groups.
       Meant to be used by debugging tools such as the Chrome Ember Extension.
       - Groups all attributes in "Attributes" group.
      - Groups all belongsTo relationships in "Belongs To" group.
      - Groups all hasMany relationships in "Has Many" group.
      - Groups all flags in "Flags" group.
      - Flags relationship CPs as expensive properties.
       @method _debugInfo
      @for DS.Model
      @private
    */
    _debugInfo: function _debugInfo() {
      var attributes = ['id'];
      var relationships = { belongsTo: [], hasMany: [] };
      var expensiveProperties = [];

      this.eachAttribute(function (name, meta) {
        return attributes.push(name);
      });

      this.eachRelationship(function (name, relationship) {
        relationships[relationship.kind].push(name);
        expensiveProperties.push(name);
      });

      var groups = [{
        name: 'Attributes',
        properties: attributes,
        expand: true
      }, {
        name: 'Belongs To',
        properties: relationships.belongsTo,
        expand: true
      }, {
        name: 'Has Many',
        properties: relationships.hasMany,
        expand: true
      }, {
        name: 'Flags',
        properties: ['isLoaded', 'hasDirtyAttributes', 'isSaving', 'isDeleted', 'isError', 'isNew', 'isValid']
      }];

      return {
        propertyInfo: {
          // include all other mixins / properties (not just the grouped ones)
          includeOtherProperties: true,
          groups: groups,
          // don't pre-calculate unless cached
          expensiveProperties: expensiveProperties
        }
      };
    }
  });
});
define("ember-data/-private/system/debug", ["exports", "ember-data/-private/system/debug/debug-adapter"], function (exports, _emberDataPrivateSystemDebugDebugAdapter) {
  /**
    @module ember-data
  */

  "use strict";

  exports["default"] = _emberDataPrivateSystemDebugDebugAdapter["default"];
});
define("ember-data/-private/system/empty-object", ["exports"], function (exports) {
  "use strict";

  exports["default"] = EmptyObject;

  // This exists because `Object.create(null)` is absurdly slow compared
  // to `new EmptyObject()`. In either case, you want a null prototype
  // when you're treating the object instances as arbitrary dictionaries
  // and don't want your keys colliding with build-in methods on the
  // default object prototype.
  var proto = Object.create(null, {
    // without this, we will always still end up with (new
    // EmptyObject()).constructor === Object
    constructor: {
      value: undefined,
      enumerable: false,
      writable: true
    }
  });
  function EmptyObject() {}

  EmptyObject.prototype = proto;
});
define('ember-data/-private/system/is-array-like', ['exports'], function (exports) {
  'use strict';

  exports['default'] = isArrayLike;

  /*
    We're using this to detect arrays and "array-like" objects.
  
    This is a copy of the `isArray` method found in `ember-runtime/utils` as we're
    currently unable to import non-exposed modules.
  
    This method was previously exposed as `Ember.isArray` but since
    https://github.com/emberjs/ember.js/pull/11463 `Ember.isArray` is an alias of
    `Array.isArray` hence removing the "array-like" part.
   */
  function isArrayLike(obj) {
    if (!obj || obj.setInterval) {
      return false;
    }
    if (Array.isArray(obj)) {
      return true;
    }
    if (Ember.Array.detect(obj)) {
      return true;
    }

    var type = Ember.typeOf(obj);
    if ('array' === type) {
      return true;
    }
    if (obj.length !== undefined && 'object' === type) {
      return true;
    }
    return false;
  }
});
define("ember-data/-private/system/many-array", ["exports", "ember", "ember-data/-private/debug", "ember-data/-private/system/promise-proxies"], function (exports, _ember, _emberDataPrivateDebug, _emberDataPrivateSystemPromiseProxies) {
  /**
    @module ember-data
  */
  "use strict";

  var get = _ember["default"].get;
  var set = _ember["default"].set;

  /**
    A `ManyArray` is a `MutableArray` that represents the contents of a has-many
    relationship.
  
    The `ManyArray` is instantiated lazily the first time the relationship is
    requested.
  
    ### Inverses
  
    Often, the relationships in Ember Data applications will have
    an inverse. For example, imagine the following models are
    defined:
  
    ```app/models/post.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      comments: DS.hasMany('comment')
    });
    ```
  
    ```app/models/comment.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      post: DS.belongsTo('post')
    });
    ```
  
    If you created a new instance of `App.Post` and added
    a `App.Comment` record to its `comments` has-many
    relationship, you would expect the comment's `post`
    property to be set to the post that contained
    the has-many.
  
    We call the record to which a relationship belongs the
    relationship's _owner_.
  
    @class ManyArray
    @namespace DS
    @extends Ember.Object
    @uses Ember.MutableArray, Ember.Evented
  */
  exports["default"] = _ember["default"].Object.extend(_ember["default"].MutableArray, _ember["default"].Evented, {
    init: function init() {
      this._super.apply(this, arguments);
      this.currentState = _ember["default"].A([]);
    },

    record: null,

    canonicalState: null,
    currentState: null,

    length: 0,

    objectAt: function objectAt(index) {
      //Ember observers such as 'firstObject', 'lastObject' might do out of bounds accesses
      if (!this.currentState[index]) {
        return undefined;
      }
      return this.currentState[index].getRecord();
    },

    flushCanonical: function flushCanonical() {
      //TODO make this smarter, currently its plenty stupid
      var toSet = this.canonicalState.filter(function (internalModel) {
        return !internalModel.isDeleted();
      });

      //a hack for not removing new records
      //TODO remove once we have proper diffing
      var newRecords = this.currentState.filter(function (internalModel) {
        return internalModel.isNew();
      });
      toSet = toSet.concat(newRecords);
      var oldLength = this.length;
      this.arrayContentWillChange(0, this.length, toSet.length);
      this.set('length', toSet.length);
      this.currentState = toSet;
      this.arrayContentDidChange(0, oldLength, this.length);
      //TODO Figure out to notify only on additions and maybe only if unloaded
      this.relationship.notifyHasManyChanged();
      this.record.updateRecordArrays();
    },
    /**
      `true` if the relationship is polymorphic, `false` otherwise.
       @property {Boolean} isPolymorphic
      @private
    */
    isPolymorphic: false,

    /**
      The loading state of this array
       @property {Boolean} isLoaded
    */
    isLoaded: false,

    /**
      The relationship which manages this array.
       @property {ManyRelationship} relationship
      @private
    */
    relationship: null,

    /**
      Metadata associated with the request for async hasMany relationships.
       Example
       Given that the server returns the following JSON payload when fetching a
      hasMany relationship:
       ```js
      {
        "comments": [{
          "id": 1,
          "comment": "This is the first comment",
        }, {
          // ...
        }],
         "meta": {
          "page": 1,
          "total": 5
        }
      }
      ```
       You can then access the metadata via the `meta` property:
       ```js
      post.get('comments').then(function(comments) {
        var meta = comments.get('meta');
         // meta.page => 1
        // meta.total => 5
      });
      ```
       @property {Object} meta
      @public
    */
    meta: null,

    internalReplace: function internalReplace(idx, amt, objects) {
      if (!objects) {
        objects = [];
      }
      this.arrayContentWillChange(idx, amt, objects.length);
      this.currentState.splice.apply(this.currentState, [idx, amt].concat(objects));
      this.set('length', this.currentState.length);
      this.arrayContentDidChange(idx, amt, objects.length);
      if (objects) {
        //TODO(Igor) probably needed only for unloaded records
        this.relationship.notifyHasManyChanged();
      }
      this.record.updateRecordArrays();
    },

    //TODO(Igor) optimize
    internalRemoveRecords: function internalRemoveRecords(records) {
      var index;
      for (var i = 0; i < records.length; i++) {
        index = this.currentState.indexOf(records[i]);
        this.internalReplace(index, 1);
      }
    },

    //TODO(Igor) optimize
    internalAddRecords: function internalAddRecords(records, idx) {
      if (idx === undefined) {
        idx = this.currentState.length;
      }
      this.internalReplace(idx, 0, records);
    },

    replace: function replace(idx, amt, objects) {
      var records;
      if (amt > 0) {
        records = this.currentState.slice(idx, idx + amt);
        this.get('relationship').removeRecords(records);
      }
      if (objects) {
        this.get('relationship').addRecords(objects.map(function (obj) {
          return obj._internalModel;
        }), idx);
      }
    },
    /**
      Used for async `hasMany` arrays
      to keep track of when they will resolve.
       @property {Ember.RSVP.Promise} promise
      @private
    */
    promise: null,

    /**
      @method loadingRecordsCount
      @param {Number} count
      @private
    */
    loadingRecordsCount: function loadingRecordsCount(count) {
      this.loadingRecordsCount = count;
    },

    /**
      @method loadedRecord
      @private
    */
    loadedRecord: function loadedRecord() {
      this.loadingRecordsCount--;
      if (this.loadingRecordsCount === 0) {
        set(this, 'isLoaded', true);
        this.trigger('didLoad');
      }
    },

    /**
      @method reload
      @public
    */
    reload: function reload() {
      return this.relationship.reload();
    },

    /**
      Saves all of the records in the `ManyArray`.
       Example
       ```javascript
      store.findRecord('inbox', 1).then(function(inbox) {
        inbox.get('messages').then(function(messages) {
          messages.forEach(function(message) {
            message.set('isRead', true);
          });
          messages.save()
        });
      });
      ```
       @method save
      @return {DS.PromiseArray} promise
    */
    save: function save() {
      var manyArray = this;
      var promiseLabel = "DS: ManyArray#save " + get(this, 'type');
      var promise = _ember["default"].RSVP.all(this.invoke("save"), promiseLabel).then(function (array) {
        return manyArray;
      }, null, "DS: ManyArray#save return ManyArray");

      return _emberDataPrivateSystemPromiseProxies.PromiseArray.create({ promise: promise });
    },

    /**
      Create a child record within the owner
       @method createRecord
      @private
      @param {Object} hash
      @return {DS.Model} record
    */
    createRecord: function createRecord(hash) {
      var store = get(this, 'store');
      var type = get(this, 'type');
      var record;

      (0, _emberDataPrivateDebug.assert)("You cannot add '" + type.modelName + "' records to this polymorphic relationship.", !get(this, 'isPolymorphic'));
      record = store.createRecord(type.modelName, hash);
      this.pushObject(record);

      return record;
    }
  });
});
define('ember-data/-private/system/merge', ['exports'], function (exports) {
  'use strict';

  exports['default'] = merge;

  function merge(original, updates) {
    if (!updates || typeof updates !== 'object') {
      return original;
    }

    var props = Object.keys(updates);
    var prop;
    var length = props.length;

    for (var i = 0; i < length; i++) {
      prop = props[i];
      original[prop] = updates[prop];
    }

    return original;
  }
});
define("ember-data/-private/system/model/attr", ["exports", "ember", "ember-data/-private/debug"], function (exports, _ember, _emberDataPrivateDebug) {
  "use strict";

  var get = _ember["default"].get;
  var Map = _ember["default"].Map;

  /**
    @module ember-data
  */

  /**
    @class Model
    @namespace DS
  */

  var AttrClassMethodsMixin = _ember["default"].Mixin.create({
    /**
      A map whose keys are the attributes of the model (properties
      described by DS.attr) and whose values are the meta object for the
      property.
       Example
       ```app/models/person.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        firstName: attr('string'),
        lastName: attr('string'),
        birthday: attr('date')
      });
      ```
       ```javascript
      import Ember from 'ember';
      import Person from 'app/models/person';
       var attributes = Ember.get(Person, 'attributes')
       attributes.forEach(function(meta, name) {
        console.log(name, meta);
      });
       // prints:
      // firstName {type: "string", isAttribute: true, options: Object, parentType: function, name: "firstName"}
      // lastName {type: "string", isAttribute: true, options: Object, parentType: function, name: "lastName"}
      // birthday {type: "date", isAttribute: true, options: Object, parentType: function, name: "birthday"}
      ```
       @property attributes
      @static
      @type {Ember.Map}
      @readOnly
    */
    attributes: _ember["default"].computed(function () {
      var _this = this;

      var map = Map.create();

      this.eachComputedProperty(function (name, meta) {
        if (meta.isAttribute) {
          (0, _emberDataPrivateDebug.assert)("You may not set `id` as an attribute on your model. Please remove any lines that look like: `id: DS.attr('<type>')` from " + _this.toString(), name !== 'id');

          meta.name = name;
          map.set(name, meta);
        }
      });

      return map;
    }).readOnly(),

    /**
      A map whose keys are the attributes of the model (properties
      described by DS.attr) and whose values are type of transformation
      applied to each attribute. This map does not include any
      attributes that do not have an transformation type.
       Example
       ```app/models/person.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        firstName: attr(),
        lastName: attr('string'),
        birthday: attr('date')
      });
      ```
       ```javascript
      import Ember from 'ember';
      import Person from 'app/models/person';
       var transformedAttributes = Ember.get(Person, 'transformedAttributes')
       transformedAttributes.forEach(function(field, type) {
        console.log(field, type);
      });
       // prints:
      // lastName string
      // birthday date
      ```
       @property transformedAttributes
      @static
      @type {Ember.Map}
      @readOnly
    */
    transformedAttributes: _ember["default"].computed(function () {
      var map = Map.create();

      this.eachAttribute(function (key, meta) {
        if (meta.type) {
          map.set(key, meta.type);
        }
      });

      return map;
    }).readOnly(),

    /**
      Iterates through the attributes of the model, calling the passed function on each
      attribute.
       The callback method you provide should have the following signature (all
      parameters are optional):
       ```javascript
      function(name, meta);
      ```
       - `name` the name of the current property in the iteration
      - `meta` the meta object for the attribute property in the iteration
       Note that in addition to a callback, you can also pass an optional target
      object that will be set as `this` on the context.
       Example
       ```javascript
      import DS from 'ember-data';
       var Person = DS.Model.extend({
        firstName: attr('string'),
        lastName: attr('string'),
        birthday: attr('date')
      });
       Person.eachAttribute(function(name, meta) {
        console.log(name, meta);
      });
       // prints:
      // firstName {type: "string", isAttribute: true, options: Object, parentType: function, name: "firstName"}
      // lastName {type: "string", isAttribute: true, options: Object, parentType: function, name: "lastName"}
      // birthday {type: "date", isAttribute: true, options: Object, parentType: function, name: "birthday"}
     ```
       @method eachAttribute
      @param {Function} callback The callback to execute
      @param {Object} [binding] the value to which the callback's `this` should be bound
      @static
    */
    eachAttribute: function eachAttribute(callback, binding) {
      get(this, 'attributes').forEach(function (meta, name) {
        callback.call(binding, name, meta);
      });
    },

    /**
      Iterates through the transformedAttributes of the model, calling
      the passed function on each attribute. Note the callback will not be
      called for any attributes that do not have an transformation type.
       The callback method you provide should have the following signature (all
      parameters are optional):
       ```javascript
      function(name, type);
      ```
       - `name` the name of the current property in the iteration
      - `type` a string containing the name of the type of transformed
        applied to the attribute
       Note that in addition to a callback, you can also pass an optional target
      object that will be set as `this` on the context.
       Example
       ```javascript
      import DS from 'ember-data';
       var Person = DS.Model.extend({
        firstName: attr(),
        lastName: attr('string'),
        birthday: attr('date')
      });
       Person.eachTransformedAttribute(function(name, type) {
        console.log(name, type);
      });
       // prints:
      // lastName string
      // birthday date
     ```
       @method eachTransformedAttribute
      @param {Function} callback The callback to execute
      @param {Object} [binding] the value to which the callback's `this` should be bound
      @static
    */
    eachTransformedAttribute: function eachTransformedAttribute(callback, binding) {
      get(this, 'transformedAttributes').forEach(function (type, name) {
        callback.call(binding, name, type);
      });
    }
  });

  exports.AttrClassMethodsMixin = AttrClassMethodsMixin;

  var AttrInstanceMethodsMixin = _ember["default"].Mixin.create({
    eachAttribute: function eachAttribute(callback, binding) {
      this.constructor.eachAttribute(callback, binding);
    }
  });
  exports.AttrInstanceMethodsMixin = AttrInstanceMethodsMixin;
});
define("ember-data/-private/system/model/errors/invalid", ["exports"], function (exports) {
  "use strict";

  exports["default"] = InvalidError;

  var EmberError = Ember.Error;

  /**
    A `DS.InvalidError` is used by an adapter to signal the external API
    was unable to process a request because the content was not
    semantically correct or meaningful per the API. Usually this means a
    record failed some form of server side validation. When a promise
    from an adapter is rejected with a `DS.InvalidError` the record will
    transition to the `invalid` state and the errors will be set to the
    `errors` property on the record.
  
    For Ember Data to correctly map errors to their corresponding
    properties on the model, Ember Data expects each error to be
    namespaced under a key that matches the property name. For example
    if you had a Post model that looked like this.
  
    ```app/models/post.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      title: DS.attr('string'),
      content: DS.attr('string')
    });
    ```
  
    To show an error from the server related to the `title` and
    `content` properties your adapter could return a promise that
    rejects with a `DS.InvalidError` object that looks like this:
  
    ```app/adapters/post.js
    import Ember from 'ember';
    import DS from 'ember-data';
  
    export default DS.RESTAdapter.extend({
      updateRecord: function() {
        // Fictional adapter that always rejects
        return Ember.RSVP.reject(new DS.InvalidError({
          title: ['Must be unique'],
          content: ['Must not be blank'],
        }));
      }
    });
    ```
  
    Your backend may use different property names for your records the
    store will attempt extract and normalize the errors using the
    serializer's `extractErrors` method before the errors get added to
    the the model. As a result, it is safe for the `InvalidError` to
    wrap the error payload unaltered.
  
    Example
  
    ```app/adapters/application.js
    import Ember from 'ember';
    import DS from 'ember-data';
  
    export default DS.RESTAdapter.extend({
      ajaxError: function(jqXHR) {
        var error = this._super(jqXHR);
  
        // 422 is used by this fictional server to signal a validation error
        if (jqXHR && jqXHR.status === 422) {
          var jsonErrors = Ember.$.parseJSON(jqXHR.responseText);
          return new DS.InvalidError(jsonErrors);
        } else {
          // The ajax request failed however it is not a result of this
          // record being in an invalid state so we do not return a
          // `InvalidError` object.
          return error;
        }
      }
    });
    ```
  
    @class InvalidError
    @namespace DS
  */
  function InvalidError(errors) {
    EmberError.call(this, "The backend rejected the commit because it was invalid: " + Ember.inspect(errors));
    this.errors = errors;
  }

  InvalidError.prototype = Object.create(EmberError.prototype);
});
define('ember-data/-private/system/model/errors', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  var get = _ember['default'].get;
  var set = _ember['default'].set;
  var isEmpty = _ember['default'].isEmpty;
  var makeArray = _ember['default'].makeArray;

  var MapWithDefault = _ember['default'].MapWithDefault;

  /**
  @module ember-data
  */

  /**
    Holds validation errors for a given record organized by attribute names.
  
    Every DS.Model has an `errors` property that is an instance of
    `DS.Errors`. This can be used to display validation error
    messages returned from the server when a `record.save()` rejects.
  
    For Example, if you had an `User` model that looked like this:
  
    ```app/models/user.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      username: attr('string'),
      email: attr('string')
    });
    ```
    And you attempted to save a record that did not validate on the backend.
  
    ```javascript
    var user = store.createRecord('user', {
      username: 'tomster',
      email: 'invalidEmail'
    });
    user.save();
    ```
  
    Your backend data store might return a response that looks like
    this. This response will be used to populate the error object.
  
    ```javascript
    {
      "errors": [
        {
          "detail": "This username is already taken!",
          "source": {
            "pointer": "data/attributes/username"
          }
        }, {
          "detail": "Doesn't look like a valid email.",
          "source": {
            "pointer": "data/attributes/email"
          }
        }
      ]
    }
    ```
  
    For additional information on the error object, see the [JSON API spec](http://jsonapi.org/format/#error-objects).
  
    Errors can be displayed to the user by accessing their property name
    to get an array of all the error objects for that property. Each
    error object is a JavaScript object with two keys:
  
    - `message` A string containing the error message from the backend
    - `attribute` The name of the property associated with this error message
  
    ```handlebars
    <label>Username: {{input value=username}} </label>
    {{#each model.errors.username as |error|}}
      <div class="error">
        {{error.message}}
      </div>
    {{/each}}
  
    <label>Email: {{input value=email}} </label>
    {{#each model.errors.email as |error|}}
      <div class="error">
        {{error.message}}
      </div>
    {{/each}}
    ```
  
    You can also access the special `messages` property on the error
    object to get an array of all the error strings.
  
    ```handlebars
    {{#each model.errors.messages as |message|}}
      <div class="error">
        {{message}}
      </div>
    {{/each}}
    ```
  
    @class Errors
    @namespace DS
    @extends Ember.Object
    @uses Ember.Enumerable
    @uses Ember.Evented
   */
  exports['default'] = _ember['default'].ArrayProxy.extend(_ember['default'].Evented, {
    /**
      Register with target handler
       @method registerHandlers
      @param {Object} target
      @param {Function} becameInvalid
      @param {Function} becameValid
    */
    registerHandlers: function registerHandlers(target, becameInvalid, becameValid) {
      this.on('becameInvalid', target, becameInvalid);
      this.on('becameValid', target, becameValid);
    },

    /**
      @property errorsByAttributeName
      @type {Ember.MapWithDefault}
      @private
    */
    errorsByAttributeName: _ember['default'].computed(function () {
      return MapWithDefault.create({
        defaultValue: function defaultValue() {
          return _ember['default'].A();
        }
      });
    }),

    /**
      Returns errors for a given attribute
       ```javascript
      var user = store.createRecord('user', {
        username: 'tomster',
        email: 'invalidEmail'
      });
      user.save().catch(function(){
        user.get('errors').errorsFor('email'); // returns:
        // [{attribute: "email", message: "Doesn't look like a valid email."}]
      });
      ```
       @method errorsFor
      @param {String} attribute
      @return {Array}
    */
    errorsFor: function errorsFor(attribute) {
      return get(this, 'errorsByAttributeName').get(attribute);
    },

    /**
      An array containing all of the error messages for this
      record. This is useful for displaying all errors to the user.
       ```handlebars
      {{#each model.errors.messages as |message|}}
        <div class="error">
          {{message}}
        </div>
      {{/each}}
      ```
       @property messages
      @type {Array}
    */
    messages: _ember['default'].computed.mapBy('content', 'message'),

    /**
      @property content
      @type {Array}
      @private
    */
    content: _ember['default'].computed(function () {
      return _ember['default'].A();
    }),

    /**
      @method unknownProperty
      @private
    */
    unknownProperty: function unknownProperty(attribute) {
      var errors = this.errorsFor(attribute);
      if (isEmpty(errors)) {
        return null;
      }
      return errors;
    },

    /**
      Total number of errors.
       @property length
      @type {Number}
      @readOnly
    */

    /**
      @property isEmpty
      @type {Boolean}
      @readOnly
    */
    isEmpty: _ember['default'].computed.not('length').readOnly(),

    /**
      Adds error messages to a given attribute and sends
      `becameInvalid` event to the record.
       Example:
       ```javascript
      if (!user.get('username') {
        user.get('errors').add('username', 'This field is required');
      }
      ```
       @method add
      @param {String} attribute
      @param {(Array|String)} messages
    */
    add: function add(attribute, messages) {
      var wasEmpty = get(this, 'isEmpty');

      messages = this._findOrCreateMessages(attribute, messages);
      this.addObjects(messages);
      get(this, 'errorsByAttributeName').get(attribute).addObjects(messages);

      this.notifyPropertyChange(attribute);

      if (wasEmpty && !get(this, 'isEmpty')) {
        this.trigger('becameInvalid');
      }
    },

    /**
      @method _findOrCreateMessages
      @private
    */
    _findOrCreateMessages: function _findOrCreateMessages(attribute, messages) {
      var errors = this.errorsFor(attribute);

      return makeArray(messages).map(function (message) {
        return errors.findBy('message', message) || {
          attribute: attribute,
          message: message
        };
      });
    },

    /**
      Removes all error messages from the given attribute and sends
      `becameValid` event to the record if there no more errors left.
       Example:
       ```app/models/user.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        email: DS.attr('string'),
        twoFactorAuth: DS.attr('boolean'),
        phone: DS.attr('string')
      });
      ```
       ```app/routes/user/edit.js
      import Ember from 'ember';
       export default Ember.Route.extend({
        actions: {
          save: function(user) {
             if (!user.get('twoFactorAuth')) {
               user.get('errors').remove('phone');
             }
             user.save();
           }
        }
      });
      ```
       @method remove
      @param {String} attribute
    */
    remove: function remove(attribute) {
      if (get(this, 'isEmpty')) {
        return;
      }

      var content = this.rejectBy('attribute', attribute);
      set(this, 'content', content);
      get(this, 'errorsByAttributeName')['delete'](attribute);

      this.notifyPropertyChange(attribute);

      if (get(this, 'isEmpty')) {
        this.trigger('becameValid');
      }
    },

    /**
      Removes all error messages and sends `becameValid` event
      to the record.
       Example:
       ```app/routes/user/edit.js
      import Ember from 'ember';
       export default Ember.Route.extend({
        actions: {
          retrySave: function(user) {
             user.get('errors').clear();
             user.save();
           }
        }
      });
      ```
       @method clear
    */
    clear: function clear() {
      if (get(this, 'isEmpty')) {
        return;
      }

      var errorsByAttributeName = get(this, 'errorsByAttributeName');
      var attributes = _ember['default'].A();

      errorsByAttributeName.forEach(function (_, attribute) {
        attributes.push(attribute);
      });

      errorsByAttributeName.clear();
      attributes.forEach(function (attribute) {
        this.notifyPropertyChange(attribute);
      }, this);

      this._super();

      this.trigger('becameValid');
    },

    /**
      Checks if there is error messages for the given attribute.
       ```app/routes/user/edit.js
      import Ember from 'ember';
       export default Ember.Route.extend({
        actions: {
          save: function(user) {
             if (user.get('errors').has('email')) {
               return alert('Please update your email before attempting to save.');
             }
             user.save();
           }
        }
      });
      ```
       @method has
      @param {String} attribute
      @return {Boolean} true if there some errors on given attribute
    */
    has: function has(attribute) {
      return !isEmpty(this.errorsFor(attribute));
    }
  });
});
define("ember-data/-private/system/model/internal-model", ["exports", "ember", "ember-data/-private/debug", "ember-data/-private/system/merge", "ember-data/-private/system/model/states", "ember-data/-private/system/relationships/state/create", "ember-data/-private/system/snapshot", "ember-data/-private/system/empty-object", "ember-data/-private/utils"], function (exports, _ember, _emberDataPrivateDebug, _emberDataPrivateSystemMerge, _emberDataPrivateSystemModelStates, _emberDataPrivateSystemRelationshipsStateCreate, _emberDataPrivateSystemSnapshot, _emberDataPrivateSystemEmptyObject, _emberDataPrivateUtils) {
  "use strict";

  var _slicedToArray = (function () {
    function sliceIterator(arr, i) {
      var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;_e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }return _arr;
    }return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  })();

  exports["default"] = InternalModel;

  var Promise = _ember["default"].RSVP.Promise;
  var get = _ember["default"].get;
  var set = _ember["default"].set;
  var copy = _ember["default"].copy;

  var _extractPivotNameCache = new _emberDataPrivateSystemEmptyObject["default"]();
  var _splitOnDotCache = new _emberDataPrivateSystemEmptyObject["default"]();

  function splitOnDot(name) {
    return _splitOnDotCache[name] || (_splitOnDotCache[name] = name.split('.'));
  }

  function extractPivotName(name) {
    return _extractPivotNameCache[name] || (_extractPivotNameCache[name] = splitOnDot(name)[0]);
  }

  function retrieveFromCurrentState(key) {
    return function () {
      return get(this.currentState, key);
    };
  }

  var guid = 0;
  /*
    `InternalModel` is the Model class that we use internally inside Ember Data to represent models.
    Internal ED methods should only deal with `InternalModel` objects. It is a fast, plain Javascript class.
  
    We expose `DS.Model` to application code, by materializing a `DS.Model` from `InternalModel` lazily, as
    a performance optimization.
  
    `InternalModel` should never be exposed to application code. At the boundaries of the system, in places
    like `find`, `push`, etc. we convert between Models and InternalModels.
  
    We need to make sure that the properties from `InternalModel` are correctly exposed/proxied on `Model`
    if they are needed.
  
    @private
    @class InternalModel
  */
  function InternalModel(type, id, store, _, data) {
    this.type = type;
    this.id = id;
    this.store = store;
    this._data = data || new _emberDataPrivateSystemEmptyObject["default"]();
    this.modelName = type.modelName;
    this.dataHasInitialized = false;
    //Look into making this lazy
    this._deferredTriggers = [];
    this._attributes = new _emberDataPrivateSystemEmptyObject["default"]();
    this._inFlightAttributes = new _emberDataPrivateSystemEmptyObject["default"]();
    this._relationships = new _emberDataPrivateSystemRelationshipsStateCreate["default"](this);
    this._recordArrays = undefined;
    this.currentState = _emberDataPrivateSystemModelStates["default"].empty;
    this.isReloading = false;
    this.isError = false;
    this.error = null;
    this.__ember_meta__ = null;
    this[_ember["default"].GUID_KEY] = guid++ + 'internal-model';
    /*
      implicit relationships are relationship which have not been declared but the inverse side exists on
      another record somewhere
      For example if there was
       ```app/models/comment.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        name: DS.attr()
      })
      ```
       but there is also
       ```app/models/post.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        name: DS.attr(),
        comments: DS.hasMany('comment')
      })
      ```
       would have a implicit post relationship in order to be do things like remove ourselves from the post
      when we are deleted
    */
    this._implicitRelationships = new _emberDataPrivateSystemEmptyObject["default"]();
  }

  InternalModel.prototype = {
    isEmpty: retrieveFromCurrentState('isEmpty'),
    isLoading: retrieveFromCurrentState('isLoading'),
    isLoaded: retrieveFromCurrentState('isLoaded'),
    hasDirtyAttributes: retrieveFromCurrentState('hasDirtyAttributes'),
    isSaving: retrieveFromCurrentState('isSaving'),
    isDeleted: retrieveFromCurrentState('isDeleted'),
    isNew: retrieveFromCurrentState('isNew'),
    isValid: retrieveFromCurrentState('isValid'),
    dirtyType: retrieveFromCurrentState('dirtyType'),

    constructor: InternalModel,
    materializeRecord: function materializeRecord() {
      (0, _emberDataPrivateDebug.assert)("Materialized " + this.modelName + " record with id:" + this.id + "more than once", this.record === null || this.record === undefined);

      // lookupFactory should really return an object that creates
      // instances with the injections applied
      var createOptions = {
        store: this.store,
        _internalModel: this,
        id: this.id,
        currentState: get(this, 'currentState'),
        isError: this.isError,
        adapterError: this.error
      };

      if (_ember["default"].setOwner) {
        // ensure that `Ember.getOwner(this)` works inside a model instance
        _ember["default"].setOwner(createOptions, (0, _emberDataPrivateUtils.getOwner)(this.store));
      } else {
        createOptions.container = this.store.container;
      }

      this.record = this.type._create(createOptions);

      this._triggerDeferredTriggers();
    },

    recordObjectWillDestroy: function recordObjectWillDestroy() {
      this.record = null;
    },

    deleteRecord: function deleteRecord() {
      this.send('deleteRecord');
    },

    save: function save(options) {
      var promiseLabel = "DS: Model#save " + this;
      var resolver = _ember["default"].RSVP.defer(promiseLabel);

      this.store.scheduleSave(this, resolver, options);
      return resolver.promise;
    },

    startedReloading: function startedReloading() {
      this.isReloading = true;
      if (this.record) {
        set(this.record, 'isReloading', true);
      }
    },

    finishedReloading: function finishedReloading() {
      this.isReloading = false;
      if (this.record) {
        set(this.record, 'isReloading', false);
      }
    },

    reload: function reload() {
      this.startedReloading();
      var record = this;
      var promiseLabel = "DS: Model#reload of " + this;
      return new Promise(function (resolve) {
        record.send('reloadRecord', resolve);
      }, promiseLabel).then(function () {
        record.didCleanError();
        return record;
      }, function (error) {
        record.didError(error);
        throw error;
      }, "DS: Model#reload complete, update flags")["finally"](function () {
        record.finishedReloading();
        record.updateRecordArrays();
      });
    },

    getRecord: function getRecord() {
      if (!this.record) {
        this.materializeRecord();
      }
      return this.record;
    },

    unloadRecord: function unloadRecord() {
      this.send('unloadRecord');
    },

    eachRelationship: function eachRelationship(callback, binding) {
      return this.type.eachRelationship(callback, binding);
    },

    eachAttribute: function eachAttribute(callback, binding) {
      return this.type.eachAttribute(callback, binding);
    },

    inverseFor: function inverseFor(key) {
      return this.type.inverseFor(key);
    },

    setupData: function setupData(data) {
      var changedKeys = this._changedKeys(data.attributes);
      (0, _emberDataPrivateSystemMerge["default"])(this._data, data.attributes);
      this.pushedData();
      if (this.record) {
        this.record._notifyProperties(changedKeys);
      }
      this.didInitalizeData();
    },

    becameReady: function becameReady() {
      _ember["default"].run.schedule('actions', this.store.recordArrayManager, this.store.recordArrayManager.recordWasLoaded, this);
    },

    didInitalizeData: function didInitalizeData() {
      if (!this.dataHasInitialized) {
        this.becameReady();
        this.dataHasInitialized = true;
      }
    },

    destroy: function destroy() {
      if (this.record) {
        return this.record.destroy();
      }
    },

    /*
      @method createSnapshot
      @private
    */
    createSnapshot: function createSnapshot(options) {
      var adapterOptions = options && options.adapterOptions;
      var snapshot = new _emberDataPrivateSystemSnapshot["default"](this);
      snapshot.adapterOptions = adapterOptions;
      return snapshot;
    },

    /*
      @method loadingData
      @private
      @param {Promise} promise
    */
    loadingData: function loadingData(promise) {
      this.send('loadingData', promise);
    },

    /*
      @method loadedData
      @private
    */
    loadedData: function loadedData() {
      this.send('loadedData');
      this.didInitalizeData();
    },

    /*
      @method notFound
      @private
    */
    notFound: function notFound() {
      this.send('notFound');
    },

    /*
      @method pushedData
      @private
    */
    pushedData: function pushedData() {
      this.send('pushedData');
    },

    flushChangedAttributes: function flushChangedAttributes() {
      this._inFlightAttributes = this._attributes;
      this._attributes = new _emberDataPrivateSystemEmptyObject["default"]();
    },

    hasChangedAttributes: function hasChangedAttributes() {
      return Object.keys(this._attributes).length > 0;
    },

    /*
      Checks if the attributes which are considered as changed are still
      different to the state which is acknowledged by the server.
       This method is needed when data for the internal model is pushed and the
      pushed data might acknowledge dirty attributes as confirmed.
       @private
     */
    updateChangedAttributes: function updateChangedAttributes() {
      var changedAttributes = this.changedAttributes();
      var changedAttributeNames = Object.keys(changedAttributes);

      for (var i = 0, _length = changedAttributeNames.length; i < _length; i++) {
        var attribute = changedAttributeNames[i];

        var _changedAttributes$attribute = _slicedToArray(changedAttributes[attribute], 2);

        var oldData = _changedAttributes$attribute[0];
        var newData = _changedAttributes$attribute[1];

        if (oldData === newData) {
          delete this._attributes[attribute];
        }
      }
    },

    /*
      Returns an object, whose keys are changed properties, and value is an
      [oldProp, newProp] array.
       @private
    */
    changedAttributes: function changedAttributes() {
      var oldData = this._data;
      var currentData = this._attributes;
      var inFlightData = this._inFlightAttributes;
      var newData = (0, _emberDataPrivateSystemMerge["default"])(copy(inFlightData), currentData);
      var diffData = new _emberDataPrivateSystemEmptyObject["default"]();

      var newDataKeys = Object.keys(newData);

      for (var i = 0, _length2 = newDataKeys.length; i < _length2; i++) {
        var key = newDataKeys[i];
        diffData[key] = [oldData[key], newData[key]];
      }

      return diffData;
    },

    /*
      @method adapterWillCommit
      @private
    */
    adapterWillCommit: function adapterWillCommit() {
      this.send('willCommit');
    },

    /*
      @method adapterDidDirty
      @private
    */
    adapterDidDirty: function adapterDidDirty() {
      this.send('becomeDirty');
      this.updateRecordArraysLater();
    },

    /*
      @method send
      @private
      @param {String} name
      @param {Object} context
    */
    send: function send(name, context) {
      var currentState = get(this, 'currentState');

      if (!currentState[name]) {
        this._unhandledEvent(currentState, name, context);
      }

      return currentState[name](this, context);
    },

    notifyHasManyAdded: function notifyHasManyAdded(key, record, idx) {
      if (this.record) {
        this.record.notifyHasManyAdded(key, record, idx);
      }
    },

    notifyHasManyRemoved: function notifyHasManyRemoved(key, record, idx) {
      if (this.record) {
        this.record.notifyHasManyRemoved(key, record, idx);
      }
    },

    notifyBelongsToChanged: function notifyBelongsToChanged(key, record) {
      if (this.record) {
        this.record.notifyBelongsToChanged(key, record);
      }
    },

    notifyPropertyChange: function notifyPropertyChange(key) {
      if (this.record) {
        this.record.notifyPropertyChange(key);
      }
    },

    rollbackAttributes: function rollbackAttributes() {
      var dirtyKeys = Object.keys(this._attributes);

      this._attributes = new _emberDataPrivateSystemEmptyObject["default"]();

      if (get(this, 'isError')) {
        this._inFlightAttributes = new _emberDataPrivateSystemEmptyObject["default"]();
        this.didCleanError();
      }

      //Eventually rollback will always work for relationships
      //For now we support it only out of deleted state, because we
      //have an explicit way of knowing when the server acked the relationship change
      if (this.isDeleted()) {
        //TODO: Should probably move this to the state machine somehow
        this.becameReady();
      }

      if (this.isNew()) {
        this.clearRelationships();
      }

      if (this.isValid()) {
        this._inFlightAttributes = new _emberDataPrivateSystemEmptyObject["default"]();
      }

      this.send('rolledBack');

      this.record._notifyProperties(dirtyKeys);
    },
    /*
      @method transitionTo
      @private
      @param {String} name
    */
    transitionTo: function transitionTo(name) {
      // POSSIBLE TODO: Remove this code and replace with
      // always having direct reference to state objects

      var pivotName = extractPivotName(name);
      var currentState = get(this, 'currentState');
      var state = currentState;

      do {
        if (state.exit) {
          state.exit(this);
        }
        state = state.parentState;
      } while (!state.hasOwnProperty(pivotName));

      var path = splitOnDot(name);
      var setups = [];
      var enters = [];
      var i, l;

      for (i = 0, l = path.length; i < l; i++) {
        state = state[path[i]];

        if (state.enter) {
          enters.push(state);
        }
        if (state.setup) {
          setups.push(state);
        }
      }

      for (i = 0, l = enters.length; i < l; i++) {
        enters[i].enter(this);
      }

      set(this, 'currentState', state);
      //TODO Consider whether this is the best approach for keeping these two in sync
      if (this.record) {
        set(this.record, 'currentState', state);
      }

      for (i = 0, l = setups.length; i < l; i++) {
        setups[i].setup(this);
      }

      this.updateRecordArraysLater();
    },

    _unhandledEvent: function _unhandledEvent(state, name, context) {
      var errorMessage = "Attempted to handle event `" + name + "` ";
      errorMessage += "on " + String(this) + " while in state ";
      errorMessage += state.stateName + ". ";

      if (context !== undefined) {
        errorMessage += "Called with " + _ember["default"].inspect(context) + ".";
      }

      throw new _ember["default"].Error(errorMessage);
    },

    triggerLater: function triggerLater() {
      var length = arguments.length;
      var args = new Array(length);

      for (var i = 0; i < length; i++) {
        args[i] = arguments[i];
      }

      if (this._deferredTriggers.push(args) !== 1) {
        return;
      }
      _ember["default"].run.scheduleOnce('actions', this, '_triggerDeferredTriggers');
    },

    _triggerDeferredTriggers: function _triggerDeferredTriggers() {
      //TODO: Before 1.0 we want to remove all the events that happen on the pre materialized record,
      //but for now, we queue up all the events triggered before the record was materialized, and flush
      //them once we have the record
      if (!this.record) {
        return;
      }
      for (var i = 0, l = this._deferredTriggers.length; i < l; i++) {
        this.record.trigger.apply(this.record, this._deferredTriggers[i]);
      }

      this._deferredTriggers.length = 0;
    },
    /*
      @method clearRelationships
      @private
    */
    clearRelationships: function clearRelationships() {
      var _this = this;

      this.eachRelationship(function (name, relationship) {
        if (_this._relationships.has(name)) {
          var rel = _this._relationships.get(name);
          rel.clear();
          rel.destroy();
        }
      });
      Object.keys(this._implicitRelationships).forEach(function (key) {
        _this._implicitRelationships[key].clear();
        _this._implicitRelationships[key].destroy();
      });
    },

    /*
      When a find request is triggered on the store, the user can optionally pass in
      attributes and relationships to be preloaded. These are meant to behave as if they
      came back from the server, except the user obtained them out of band and is informing
      the store of their existence. The most common use case is for supporting client side
      nested URLs, such as `/posts/1/comments/2` so the user can do
      `store.findRecord('comment', 2, { preload: { post: 1 } })` without having to fetch the post.
       Preloaded data can be attributes and relationships passed in either as IDs or as actual
      models.
       @method _preloadData
      @private
      @param {Object} preload
    */
    _preloadData: function _preloadData(preload) {
      var _this2 = this;

      //TODO(Igor) consider the polymorphic case
      Object.keys(preload).forEach(function (key) {
        var preloadValue = get(preload, key);
        var relationshipMeta = _this2.type.metaForProperty(key);
        if (relationshipMeta.isRelationship) {
          _this2._preloadRelationship(key, preloadValue);
        } else {
          _this2._data[key] = preloadValue;
        }
      });
    },

    _preloadRelationship: function _preloadRelationship(key, preloadValue) {
      var relationshipMeta = this.type.metaForProperty(key);
      var type = relationshipMeta.type;
      if (relationshipMeta.kind === 'hasMany') {
        this._preloadHasMany(key, preloadValue, type);
      } else {
        this._preloadBelongsTo(key, preloadValue, type);
      }
    },

    _preloadHasMany: function _preloadHasMany(key, preloadValue, type) {
      (0, _emberDataPrivateDebug.assert)("You need to pass in an array to set a hasMany property on a record", _ember["default"].isArray(preloadValue));
      var internalModel = this;

      var recordsToSet = preloadValue.map(function (recordToPush) {
        return internalModel._convertStringOrNumberIntoInternalModel(recordToPush, type);
      });
      //We use the pathway of setting the hasMany as if it came from the adapter
      //because the user told us that they know this relationships exists already
      this._relationships.get(key).updateRecordsFromAdapter(recordsToSet);
    },

    _preloadBelongsTo: function _preloadBelongsTo(key, preloadValue, type) {
      var recordToSet = this._convertStringOrNumberIntoInternalModel(preloadValue, type);

      //We use the pathway of setting the hasMany as if it came from the adapter
      //because the user told us that they know this relationships exists already
      this._relationships.get(key).setRecord(recordToSet);
    },

    _convertStringOrNumberIntoInternalModel: function _convertStringOrNumberIntoInternalModel(value, type) {
      if (typeof value === 'string' || typeof value === 'number') {
        return this.store._internalModelForId(type, value);
      }
      if (value._internalModel) {
        return value._internalModel;
      }
      return value;
    },

    /*
      @method updateRecordArrays
      @private
    */
    updateRecordArrays: function updateRecordArrays() {
      this._updatingRecordArraysLater = false;
      this.store.dataWasUpdated(this.type, this);
    },

    setId: function setId(id) {
      (0, _emberDataPrivateDebug.assert)('A record\'s id cannot be changed once it is in the loaded state', this.id === null || this.id === id || this.isNew());
      this.id = id;
      if (this.record.get('id') !== id) {
        this.record.set('id', id);
      }
    },

    didError: function didError(error) {
      this.error = error;
      this.isError = true;

      if (this.record) {
        this.record.setProperties({
          isError: true,
          adapterError: error
        });
      }
    },

    didCleanError: function didCleanError() {
      this.error = null;
      this.isError = false;

      if (this.record) {
        this.record.setProperties({
          isError: false,
          adapterError: null
        });
      }
    },
    /*
      If the adapter did not return a hash in response to a commit,
      merge the changed attributes and relationships into the existing
      saved data.
       @method adapterDidCommit
    */
    adapterDidCommit: function adapterDidCommit(data) {
      if (data) {
        data = data.attributes;
      }

      this.didCleanError();
      var changedKeys = this._changedKeys(data);

      (0, _emberDataPrivateSystemMerge["default"])(this._data, this._inFlightAttributes);
      if (data) {
        (0, _emberDataPrivateSystemMerge["default"])(this._data, data);
      }

      this._inFlightAttributes = new _emberDataPrivateSystemEmptyObject["default"]();

      this.send('didCommit');
      this.updateRecordArraysLater();

      if (!data) {
        return;
      }

      this.record._notifyProperties(changedKeys);
    },

    /*
      @method updateRecordArraysLater
      @private
    */
    updateRecordArraysLater: function updateRecordArraysLater() {
      // quick hack (something like this could be pushed into run.once
      if (this._updatingRecordArraysLater) {
        return;
      }
      this._updatingRecordArraysLater = true;
      _ember["default"].run.schedule('actions', this, this.updateRecordArrays);
    },

    addErrorMessageToAttribute: function addErrorMessageToAttribute(attribute, message) {
      var record = this.getRecord();
      get(record, 'errors').add(attribute, message);
    },

    removeErrorMessageFromAttribute: function removeErrorMessageFromAttribute(attribute) {
      var record = this.getRecord();
      get(record, 'errors').remove(attribute);
    },

    clearErrorMessages: function clearErrorMessages() {
      var record = this.getRecord();
      get(record, 'errors').clear();
    },

    // FOR USE DURING COMMIT PROCESS

    /*
      @method adapterDidInvalidate
      @private
    */
    adapterDidInvalidate: function adapterDidInvalidate(errors) {
      var attribute;

      for (attribute in errors) {
        if (errors.hasOwnProperty(attribute)) {
          this.addErrorMessageToAttribute(attribute, errors[attribute]);
        }
      }

      this.send('becameInvalid');

      this._saveWasRejected();
    },

    /*
      @method adapterDidError
      @private
    */
    adapterDidError: function adapterDidError(error) {
      this.send('becameError');
      this.didError(error);
      this._saveWasRejected();
    },

    _saveWasRejected: function _saveWasRejected() {
      var keys = Object.keys(this._inFlightAttributes);
      for (var i = 0; i < keys.length; i++) {
        if (this._attributes[keys[i]] === undefined) {
          this._attributes[keys[i]] = this._inFlightAttributes[keys[i]];
        }
      }
      this._inFlightAttributes = new _emberDataPrivateSystemEmptyObject["default"]();
    },

    /*
      Ember Data has 3 buckets for storing the value of an attribute on an internalModel.
       `_data` holds all of the attributes that have been acknowledged by
      a backend via the adapter. When rollbackAttributes is called on a model all
      attributes will revert to the record's state in `_data`.
       `_attributes` holds any change the user has made to an attribute
      that has not been acknowledged by the adapter. Any values in
      `_attributes` are have priority over values in `_data`.
       `_inFlightAttributes`. When a record is being synced with the
      backend the values in `_attributes` are copied to
      `_inFlightAttributes`. This way if the backend acknowledges the
      save but does not return the new state Ember Data can copy the
      values from `_inFlightAttributes` to `_data`. Without having to
      worry about changes made to `_attributes` while the save was
      happenign.
        Changed keys builds a list of all of the values that may have been
      changed by the backend after a successful save.
       It does this by iterating over each key, value pair in the payload
      returned from the server after a save. If the `key` is found in
      `_attributes` then the user has a local changed to the attribute
      that has not been synced with the server and the key is not
      included in the list of changed keys.
    
      If the value, for a key differs from the value in what Ember Data
      believes to be the truth about the backend state (A merger of the
      `_data` and `_inFlightAttributes` objects where
      `_inFlightAttributes` has priority) then that means the backend
      has updated the value and the key is added to the list of changed
      keys.
       @method _changedKeys
      @private
    */
    _changedKeys: function _changedKeys(updates) {
      var changedKeys = [];

      if (updates) {
        var original, i, value, key;
        var keys = Object.keys(updates);
        var length = keys.length;

        original = (0, _emberDataPrivateSystemMerge["default"])(new _emberDataPrivateSystemEmptyObject["default"](), this._data);
        original = (0, _emberDataPrivateSystemMerge["default"])(original, this._inFlightAttributes);

        for (i = 0; i < length; i++) {
          key = keys[i];
          value = updates[key];

          // A value in _attributes means the user has a local change to
          // this attributes. We never override this value when merging
          // updates from the backend so we should not sent a change
          // notification if the server value differs from the original.
          if (this._attributes[key] !== undefined) {
            continue;
          }

          if (!_ember["default"].isEqual(original[key], value)) {
            changedKeys.push(key);
          }
        }
      }

      return changedKeys;
    },

    toString: function toString() {
      if (this.record) {
        return this.record.toString();
      } else {
        return "<" + this.modelName + ":" + this.id + ">";
      }
    }
  };
});
define("ember-data/-private/system/model/model", ["exports", "ember", "ember-data/-private/debug", "ember-data/-private/system/promise-proxies", "ember-data/-private/system/model/errors", "ember-data/-private/system/debug/debug-info", "ember-data/-private/system/relationships/belongs-to", "ember-data/-private/system/relationships/has-many", "ember-data/-private/system/relationships/ext", "ember-data/-private/system/model/attr"], function (exports, _ember, _emberDataPrivateDebug, _emberDataPrivateSystemPromiseProxies, _emberDataPrivateSystemModelErrors, _emberDataPrivateSystemDebugDebugInfo, _emberDataPrivateSystemRelationshipsBelongsTo, _emberDataPrivateSystemRelationshipsHasMany, _emberDataPrivateSystemRelationshipsExt, _emberDataPrivateSystemModelAttr) {
  "use strict";

  /**
    @module ember-data
  */

  var get = _ember["default"].get;

  function intersection(array1, array2) {
    var result = [];
    array1.forEach(function (element) {
      if (array2.indexOf(element) >= 0) {
        result.push(element);
      }
    });

    return result;
  }

  var RESERVED_MODEL_PROPS = ['currentState', 'data', 'store'];

  var retrieveFromCurrentState = _ember["default"].computed('currentState', function (key) {
    return get(this._internalModel.currentState, key);
  }).readOnly();

  /**
  
    The model class that all Ember Data records descend from.
    This is the public API of Ember Data models. If you are using Ember Data
    in your application, this is the class you should use.
    If you are working on Ember Data internals, you most likely want to be dealing
    with `InternalModel`
  
    @class Model
    @namespace DS
    @extends Ember.Object
    @uses Ember.Evented
  */
  var Model = _ember["default"].Object.extend(_ember["default"].Evented, {
    _internalModel: null,
    store: null,

    /**
      If this property is `true` the record is in the `empty`
      state. Empty is the first state all records enter after they have
      been created. Most records created by the store will quickly
      transition to the `loading` state if data needs to be fetched from
      the server or the `created` state if the record is created on the
      client. A record can also enter the empty state if the adapter is
      unable to locate the record.
       @property isEmpty
      @type {Boolean}
      @readOnly
    */
    isEmpty: retrieveFromCurrentState,
    /**
      If this property is `true` the record is in the `loading` state. A
      record enters this state when the store asks the adapter for its
      data. It remains in this state until the adapter provides the
      requested data.
       @property isLoading
      @type {Boolean}
      @readOnly
    */
    isLoading: retrieveFromCurrentState,
    /**
      If this property is `true` the record is in the `loaded` state. A
      record enters this state when its data is populated. Most of a
      record's lifecycle is spent inside substates of the `loaded`
      state.
       Example
       ```javascript
      var record = store.createRecord('model');
      record.get('isLoaded'); // true
       store.findRecord('model', 1).then(function(model) {
        model.get('isLoaded'); // true
      });
      ```
       @property isLoaded
      @type {Boolean}
      @readOnly
    */
    isLoaded: retrieveFromCurrentState,
    /**
      If this property is `true` the record is in the `dirty` state. The
      record has local changes that have not yet been saved by the
      adapter. This includes records that have been created (but not yet
      saved) or deleted.
       Example
       ```javascript
      var record = store.createRecord('model');
      record.get('hasDirtyAttributes'); // true
       store.findRecord('model', 1).then(function(model) {
        model.get('hasDirtyAttributes'); // false
        model.set('foo', 'some value');
        model.get('hasDirtyAttributes'); // true
      });
      ```
       @property hasDirtyAttributes
      @type {Boolean}
      @readOnly
    */
    hasDirtyAttributes: _ember["default"].computed('currentState.isDirty', function () {
      return this.get('currentState.isDirty');
    }),
    /**
      If this property is `true` the record is in the `saving` state. A
      record enters the saving state when `save` is called, but the
      adapter has not yet acknowledged that the changes have been
      persisted to the backend.
       Example
       ```javascript
      var record = store.createRecord('model');
      record.get('isSaving'); // false
      var promise = record.save();
      record.get('isSaving'); // true
      promise.then(function() {
        record.get('isSaving'); // false
      });
      ```
       @property isSaving
      @type {Boolean}
      @readOnly
    */
    isSaving: retrieveFromCurrentState,
    /**
      If this property is `true` the record is in the `deleted` state
      and has been marked for deletion. When `isDeleted` is true and
      `hasDirtyAttributes` is true, the record is deleted locally but the deletion
      was not yet persisted. When `isSaving` is true, the change is
      in-flight. When both `hasDirtyAttributes` and `isSaving` are false, the
      change has persisted.
       Example
       ```javascript
      var record = store.createRecord('model');
      record.get('isDeleted');    // false
      record.deleteRecord();
       // Locally deleted
      record.get('isDeleted');           // true
      record.get('hasDirtyAttributes');  // true
      record.get('isSaving');            // false
       // Persisting the deletion
      var promise = record.save();
      record.get('isDeleted');    // true
      record.get('isSaving');     // true
       // Deletion Persisted
      promise.then(function() {
        record.get('isDeleted');          // true
        record.get('isSaving');           // false
        record.get('hasDirtyAttributes'); // false
      });
      ```
       @property isDeleted
      @type {Boolean}
      @readOnly
    */
    isDeleted: retrieveFromCurrentState,
    /**
      If this property is `true` the record is in the `new` state. A
      record will be in the `new` state when it has been created on the
      client and the adapter has not yet report that it was successfully
      saved.
       Example
       ```javascript
      var record = store.createRecord('model');
      record.get('isNew'); // true
       record.save().then(function(model) {
        model.get('isNew'); // false
      });
      ```
       @property isNew
      @type {Boolean}
      @readOnly
    */
    isNew: retrieveFromCurrentState,
    /**
      If this property is `true` the record is in the `valid` state.
       A record will be in the `valid` state when the adapter did not report any
      server-side validation failures.
       @property isValid
      @type {Boolean}
      @readOnly
    */
    isValid: retrieveFromCurrentState,
    /**
      If the record is in the dirty state this property will report what
      kind of change has caused it to move into the dirty
      state. Possible values are:
       - `created` The record has been created by the client and not yet saved to the adapter.
      - `updated` The record has been updated by the client and not yet saved to the adapter.
      - `deleted` The record has been deleted by the client and not yet saved to the adapter.
       Example
       ```javascript
      var record = store.createRecord('model');
      record.get('dirtyType'); // 'created'
      ```
       @property dirtyType
      @type {String}
      @readOnly
    */
    dirtyType: retrieveFromCurrentState,

    /**
      If `true` the adapter reported that it was unable to save local
      changes to the backend for any reason other than a server-side
      validation error.
       Example
       ```javascript
      record.get('isError'); // false
      record.set('foo', 'valid value');
      record.save().then(null, function() {
        record.get('isError'); // true
      });
      ```
       @property isError
      @type {Boolean}
      @readOnly
    */
    isError: false,

    /**
      If `true` the store is attempting to reload the record form the adapter.
       Example
       ```javascript
      record.get('isReloading'); // false
      record.reload();
      record.get('isReloading'); // true
      ```
       @property isReloading
      @type {Boolean}
      @readOnly
    */
    isReloading: false,

    /**
      All ember models have an id property. This is an identifier
      managed by an external source. These are always coerced to be
      strings before being used internally. Note when declaring the
      attributes for a model it is an error to declare an id
      attribute.
       ```javascript
      var record = store.createRecord('model');
      record.get('id'); // null
       store.findRecord('model', 1).then(function(model) {
        model.get('id'); // '1'
      });
      ```
       @property id
      @type {String}
    */
    id: null,

    /**
      @property currentState
      @private
      @type {Object}
    */

    /**
      When the record is in the `invalid` state this object will contain
      any errors returned by the adapter. When present the errors hash
      contains keys corresponding to the invalid property names
      and values which are arrays of Javascript objects with two keys:
       - `message` A string containing the error message from the backend
      - `attribute` The name of the property associated with this error message
       ```javascript
      record.get('errors.length'); // 0
      record.set('foo', 'invalid value');
      record.save().catch(function() {
        record.get('errors').get('foo');
        // [{message: 'foo should be a number.', attribute: 'foo'}]
      });
      ```
       The `errors` property us useful for displaying error messages to
      the user.
       ```handlebars
      <label>Username: {{input value=username}} </label>
      {{#each model.errors.username as |error|}}
        <div class="error">
          {{error.message}}
        </div>
      {{/each}}
      <label>Email: {{input value=email}} </label>
      {{#each model.errors.email as |error|}}
        <div class="error">
          {{error.message}}
        </div>
      {{/each}}
      ```
        You can also access the special `messages` property on the error
      object to get an array of all the error strings.
       ```handlebars
      {{#each model.errors.messages as |message|}}
        <div class="error">
          {{message}}
        </div>
      {{/each}}
      ```
       @property errors
      @type {DS.Errors}
    */
    errors: _ember["default"].computed(function () {
      var errors = _emberDataPrivateSystemModelErrors["default"].create();

      errors.registerHandlers(this._internalModel, function () {
        this.send('becameInvalid');
      }, function () {
        this.send('becameValid');
      });

      return errors;
    }).readOnly(),

    /**
      This property holds the `DS.AdapterError` object with which
      last adapter operation was rejected.
       @property adapterError
      @type {DS.AdapterError}
    */
    adapterError: null,

    /**
      Create a JSON representation of the record, using the serialization
      strategy of the store's adapter.
      `serialize` takes an optional hash as a parameter, currently
      supported options are:
      - `includeId`: `true` if the record's ID should be included in the
        JSON representation.
       @method serialize
      @param {Object} options
      @return {Object} an object whose values are primitive JSON values only
    */
    serialize: function serialize(options) {
      return this.store.serialize(this, options);
    },

    /**
      Use [DS.JSONSerializer](DS.JSONSerializer.html) to
      get the JSON representation of a record.
       `toJSON` takes an optional hash as a parameter, currently
      supported options are:
       - `includeId`: `true` if the record's ID should be included in the
        JSON representation.
       @method toJSON
      @param {Object} options
      @return {Object} A JSON representation of the object.
    */
    toJSON: function toJSON(options) {
      // container is for lazy transform lookups
      var serializer = this.store.serializerFor('-default');
      var snapshot = this._internalModel.createSnapshot();

      return serializer.serialize(snapshot, options);
    },

    /**
      Fired when the record is ready to be interacted with,
      that is either loaded from the server or created locally.
       @event ready
    */
    ready: _ember["default"].K,

    /**
      Fired when the record is loaded from the server.
       @event didLoad
    */
    didLoad: _ember["default"].K,

    /**
      Fired when the record is updated.
       @event didUpdate
    */
    didUpdate: _ember["default"].K,

    /**
      Fired when a new record is commited to the server.
       @event didCreate
    */
    didCreate: _ember["default"].K,

    /**
      Fired when the record is deleted.
       @event didDelete
    */
    didDelete: _ember["default"].K,

    /**
      Fired when the record becomes invalid.
       @event becameInvalid
    */
    becameInvalid: _ember["default"].K,

    /**
      Fired when the record enters the error state.
       @event becameError
    */
    becameError: _ember["default"].K,

    /**
      Fired when the record is rolled back.
       @event rolledBack
    */
    rolledBack: _ember["default"].K,

    /**
      @property data
      @private
      @type {Object}
    */
    data: _ember["default"].computed.readOnly('_internalModel._data'),

    //TODO Do we want to deprecate these?
    /**
      @method send
      @private
      @param {String} name
      @param {Object} context
    */
    send: function send(name, context) {
      return this._internalModel.send(name, context);
    },

    /**
      @method transitionTo
      @private
      @param {String} name
    */
    transitionTo: function transitionTo(name) {
      return this._internalModel.transitionTo(name);
    },

    /**
      Marks the record as deleted but does not save it. You must call
      `save` afterwards if you want to persist it. You might use this
      method if you want to allow the user to still `rollbackAttributes()`
      after a delete it was made.
       Example
       ```app/routes/model/delete.js
      import Ember from 'ember';
       export default Ember.Route.extend({
        actions: {
          softDelete: function() {
            this.controller.get('model').deleteRecord();
          },
          confirm: function() {
            this.controller.get('model').save();
          },
          undo: function() {
            this.controller.get('model').rollbackAttributes();
          }
        }
      });
      ```
       @method deleteRecord
    */
    deleteRecord: function deleteRecord() {
      this._internalModel.deleteRecord();
    },

    /**
      Same as `deleteRecord`, but saves the record immediately.
       Example
       ```app/routes/model/delete.js
      import Ember from 'ember';
       export default Ember.Route.extend({
        actions: {
          delete: function() {
            var controller = this.controller;
            controller.get('model').destroyRecord().then(function() {
              controller.transitionToRoute('model.index');
            });
          }
        }
      });
      ```
       @method destroyRecord
      @param {Object} options
      @return {Promise} a promise that will be resolved when the adapter returns
      successfully or rejected if the adapter returns with an error.
    */
    destroyRecord: function destroyRecord(options) {
      this.deleteRecord();
      return this.save(options);
    },

    /**
      @method unloadRecord
      @private
    */
    unloadRecord: function unloadRecord() {
      if (this.isDestroyed) {
        return;
      }
      this._internalModel.unloadRecord();
    },

    /**
      @method _notifyProperties
      @private
    */
    _notifyProperties: function _notifyProperties(keys) {
      _ember["default"].beginPropertyChanges();
      var key;
      for (var i = 0, length = keys.length; i < length; i++) {
        key = keys[i];
        this.notifyPropertyChange(key);
      }
      _ember["default"].endPropertyChanges();
    },

    /**
      Returns an object, whose keys are changed properties, and value is
      an [oldProp, newProp] array.
       Example
       ```app/models/mascot.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        name: attr('string')
      });
      ```
       ```javascript
      var mascot = store.createRecord('mascot');
      mascot.changedAttributes(); // {}
      mascot.set('name', 'Tomster');
      mascot.changedAttributes(); // {name: [undefined, 'Tomster']}
      ```
       @method changedAttributes
      @return {Object} an object, whose keys are changed properties,
        and value is an [oldProp, newProp] array.
    */
    changedAttributes: function changedAttributes() {
      return this._internalModel.changedAttributes();
    },

    //TODO discuss with tomhuda about events/hooks
    //Bring back as hooks?
    /**
      @method adapterWillCommit
      @private
    adapterWillCommit: function() {
      this.send('willCommit');
    },
     /**
      @method adapterDidDirty
      @private
    adapterDidDirty: function() {
      this.send('becomeDirty');
      this.updateRecordArraysLater();
    },
    */

    /**
      If the model `hasDirtyAttributes` this function will discard any unsaved
      changes. If the model `isNew` it will be removed from the store.
       Example
       ```javascript
      record.get('name'); // 'Untitled Document'
      record.set('name', 'Doc 1');
      record.get('name'); // 'Doc 1'
      record.rollbackAttributes();
      record.get('name'); // 'Untitled Document'
      ```
       @method rollbackAttributes
    */
    rollbackAttributes: function rollbackAttributes() {
      this._internalModel.rollbackAttributes();
    },

    /*
      @method _createSnapshot
      @private
    */
    _createSnapshot: function _createSnapshot() {
      return this._internalModel.createSnapshot();
    },

    toStringExtension: function toStringExtension() {
      return get(this, 'id');
    },

    /**
      Save the record and persist any changes to the record to an
      external source via the adapter.
       Example
       ```javascript
      record.set('name', 'Tomster');
      record.save().then(function() {
        // Success callback
      }, function() {
        // Error callback
      });
      ```
      @method save
      @param {Object} options
      @return {Promise} a promise that will be resolved when the adapter returns
      successfully or rejected if the adapter returns with an error.
    */
    save: function save(options) {
      var _this = this;

      return _emberDataPrivateSystemPromiseProxies.PromiseObject.create({
        promise: this._internalModel.save(options).then(function () {
          return _this;
        })
      });
    },

    /**
      Reload the record from the adapter.
       This will only work if the record has already finished loading.
       Example
       ```app/routes/model/view.js
      import Ember from 'ember';
       export default Ember.Route.extend({
        actions: {
          reload: function() {
            this.controller.get('model').reload().then(function(model) {
              // do something with the reloaded model
            });
          }
        }
      });
      ```
       @method reload
      @return {Promise} a promise that will be resolved with the record when the
      adapter returns successfully or rejected if the adapter returns
      with an error.
    */
    reload: function reload() {
      var _this2 = this;

      return _emberDataPrivateSystemPromiseProxies.PromiseObject.create({
        promise: this._internalModel.reload().then(function () {
          return _this2;
        })
      });
    },

    /**
      Override the default event firing from Ember.Evented to
      also call methods with the given name.
       @method trigger
      @private
      @param {String} name
    */
    trigger: function trigger(name) {
      var length = arguments.length;
      var args = new Array(length - 1);

      for (var i = 1; i < length; i++) {
        args[i - 1] = arguments[i];
      }

      _ember["default"].tryInvoke(this, name, args);
      this._super.apply(this, arguments);
    },

    willDestroy: function willDestroy() {
      //TODO Move!
      this._super.apply(this, arguments);
      this._internalModel.clearRelationships();
      this._internalModel.recordObjectWillDestroy();
      //TODO should we set internalModel to null here?
    },

    // This is a temporary solution until we refactor DS.Model to not
    // rely on the data property.
    willMergeMixin: function willMergeMixin(props) {
      var constructor = this.constructor;
      (0, _emberDataPrivateDebug.assert)('`' + intersection(Object.keys(props), RESERVED_MODEL_PROPS)[0] + '` is a reserved property name on DS.Model objects. Please choose a different property name for ' + constructor.toString(), !intersection(Object.keys(props), RESERVED_MODEL_PROPS)[0]);
      (0, _emberDataPrivateDebug.assert)("You may not set `id` as an attribute on your model. Please remove any lines that look like: `id: DS.attr('<type>')` from " + constructor.toString(), Object.keys(props).indexOf('id') === -1);
    },

    attr: function attr() {
      (0, _emberDataPrivateDebug.assert)("The `attr` method is not available on DS.Model, a DS.Snapshot was probably expected. Are you passing a DS.Model instead of a DS.Snapshot to your serializer?", false);
    },

    belongsTo: function belongsTo() {
      (0, _emberDataPrivateDebug.assert)("The `belongsTo` method is not available on DS.Model, a DS.Snapshot was probably expected. Are you passing a DS.Model instead of a DS.Snapshot to your serializer?", false);
    },

    hasMany: function hasMany() {
      (0, _emberDataPrivateDebug.assert)("The `hasMany` method is not available on DS.Model, a DS.Snapshot was probably expected. Are you passing a DS.Model instead of a DS.Snapshot to your serializer?", false);
    },

    setId: _ember["default"].observer('id', function () {
      this._internalModel.setId(this.get('id'));
    })
  });

  Model.reopenClass({
    /**
      Alias DS.Model's `create` method to `_create`. This allows us to create DS.Model
      instances from within the store, but if end users accidentally call `create()`
      (instead of `createRecord()`), we can raise an error.
       @method _create
      @private
      @static
    */
    _create: Model.create,

    /**
      Override the class' `create()` method to raise an error. This
      prevents end users from inadvertently calling `create()` instead
      of `createRecord()`. The store is still able to create instances
      by calling the `_create()` method. To create an instance of a
      `DS.Model` use [store.createRecord](DS.Store.html#method_createRecord).
       @method create
      @private
      @static
    */
    create: function create() {
      throw new _ember["default"].Error("You should not call `create` on a model. Instead, call `store.createRecord` with the attributes you would like to set.");
    },

    /**
     Represents the model's class name as a string. This can be used to look up the model through
     DS.Store's modelFor method.
      `modelName` is generated for you by Ember Data. It will be a lowercased, dasherized string.
     For example:
      ```javascript
     store.modelFor('post').modelName; // 'post'
     store.modelFor('blog-post').modelName; // 'blog-post'
     ```
      The most common place you'll want to access `modelName` is in your serializer's `payloadKeyFromModelName` method. For example, to change payload
     keys to underscore (instead of dasherized), you might use the following code:
      ```javascript
     export default var PostSerializer = DS.RESTSerializer.extend({
       payloadKeyFromModelName: function(modelName) {
         return Ember.String.underscore(modelName);
       }
     });
     ```
     @property modelName
     @type String
     @readonly
    */
    modelName: null
  });

  // if `Ember.setOwner` is defined, accessing `this.container` is
  // deprecated (but functional). In "standard" Ember usage, this
  // deprecation is actually created via an `.extend` of the factory
  // inside the container itself, but that only happens on models
  // with MODEL_FACTORY_INJECTIONS enabled :(
  if (_ember["default"].setOwner) {
    Object.defineProperty(Model.prototype, 'container', {
      configurable: true,
      enumerable: false,
      get: function get() {
        (0, _emberDataPrivateDebug.deprecate)('Using the injected `container` is deprecated. Please use the `getOwner` helper instead to access the owner of this object.', false, { id: 'ember-application.injected-container', until: '3.0.0' });

        return this.store.container;
      }
    });
  }

  Model.reopenClass(_emberDataPrivateSystemRelationshipsExt.RelationshipsClassMethodsMixin);
  Model.reopenClass(_emberDataPrivateSystemModelAttr.AttrClassMethodsMixin);

  exports["default"] = Model.extend(_emberDataPrivateSystemDebugDebugInfo["default"], _emberDataPrivateSystemRelationshipsBelongsTo.BelongsToMixin, _emberDataPrivateSystemRelationshipsExt.DidDefinePropertyMixin, _emberDataPrivateSystemRelationshipsExt.RelationshipsInstanceMethodsMixin, _emberDataPrivateSystemRelationshipsHasMany.HasManyMixin, _emberDataPrivateSystemModelAttr.AttrInstanceMethodsMixin);
});
define('ember-data/-private/system/model/states', ['exports', 'ember', 'ember-data/-private/debug'], function (exports, _ember, _emberDataPrivateDebug) {
  /**
    @module ember-data
  */
  'use strict';

  var get = _ember['default'].get;
  /*
    This file encapsulates the various states that a record can transition
    through during its lifecycle.
  */
  /**
    ### State
  
    Each record has a `currentState` property that explicitly tracks what
    state a record is in at any given time. For instance, if a record is
    newly created and has not yet been sent to the adapter to be saved,
    it would be in the `root.loaded.created.uncommitted` state.  If a
    record has had local modifications made to it that are in the
    process of being saved, the record would be in the
    `root.loaded.updated.inFlight` state. (This state paths will be
    explained in more detail below.)
  
    Events are sent by the record or its store to the record's
    `currentState` property. How the state reacts to these events is
    dependent on which state it is in. In some states, certain events
    will be invalid and will cause an exception to be raised.
  
    States are hierarchical and every state is a substate of the
    `RootState`. For example, a record can be in the
    `root.deleted.uncommitted` state, then transition into the
    `root.deleted.inFlight` state. If a child state does not implement
    an event handler, the state manager will attempt to invoke the event
    on all parent states until the root state is reached. The state
    hierarchy of a record is described in terms of a path string. You
    can determine a record's current state by getting the state's
    `stateName` property:
  
    ```javascript
    record.get('currentState.stateName');
    //=> "root.created.uncommitted"
     ```
  
    The hierarchy of valid states that ship with ember data looks like
    this:
  
    ```text
    * root
      * deleted
        * saved
        * uncommitted
        * inFlight
      * empty
      * loaded
        * created
          * uncommitted
          * inFlight
        * saved
        * updated
          * uncommitted
          * inFlight
      * loading
    ```
  
    The `DS.Model` states are themselves stateless. What that means is
    that, the hierarchical states that each of *those* points to is a
    shared data structure. For performance reasons, instead of each
    record getting its own copy of the hierarchy of states, each record
    points to this global, immutable shared instance. How does a state
    know which record it should be acting on? We pass the record
    instance into the state's event handlers as the first argument.
  
    The record passed as the first parameter is where you should stash
    state about the record if needed; you should never store data on the state
    object itself.
  
    ### Events and Flags
  
    A state may implement zero or more events and flags.
  
    #### Events
  
    Events are named functions that are invoked when sent to a record. The
    record will first look for a method with the given name on the
    current state. If no method is found, it will search the current
    state's parent, and then its grandparent, and so on until reaching
    the top of the hierarchy. If the root is reached without an event
    handler being found, an exception will be raised. This can be very
    helpful when debugging new features.
  
    Here's an example implementation of a state with a `myEvent` event handler:
  
    ```javascript
    aState: DS.State.create({
      myEvent: function(manager, param) {
        console.log("Received myEvent with", param);
      }
    })
    ```
  
    To trigger this event:
  
    ```javascript
    record.send('myEvent', 'foo');
    //=> "Received myEvent with foo"
    ```
  
    Note that an optional parameter can be sent to a record's `send()` method,
    which will be passed as the second parameter to the event handler.
  
    Events should transition to a different state if appropriate. This can be
    done by calling the record's `transitionTo()` method with a path to the
    desired state. The state manager will attempt to resolve the state path
    relative to the current state. If no state is found at that path, it will
    attempt to resolve it relative to the current state's parent, and then its
    parent, and so on until the root is reached. For example, imagine a hierarchy
    like this:
  
        * created
          * uncommitted <-- currentState
          * inFlight
        * updated
          * inFlight
  
    If we are currently in the `uncommitted` state, calling
    `transitionTo('inFlight')` would transition to the `created.inFlight` state,
    while calling `transitionTo('updated.inFlight')` would transition to
    the `updated.inFlight` state.
  
    Remember that *only events* should ever cause a state transition. You should
    never call `transitionTo()` from outside a state's event handler. If you are
    tempted to do so, create a new event and send that to the state manager.
  
    #### Flags
  
    Flags are Boolean values that can be used to introspect a record's current
    state in a more user-friendly way than examining its state path. For example,
    instead of doing this:
  
    ```javascript
    var statePath = record.get('stateManager.currentPath');
    if (statePath === 'created.inFlight') {
      doSomething();
    }
    ```
  
    You can say:
  
    ```javascript
    if (record.get('isNew') && record.get('isSaving')) {
      doSomething();
    }
    ```
  
    If your state does not set a value for a given flag, the value will
    be inherited from its parent (or the first place in the state hierarchy
    where it is defined).
  
    The current set of flags are defined below. If you want to add a new flag,
    in addition to the area below, you will also need to declare it in the
    `DS.Model` class.
  
  
     * [isEmpty](DS.Model.html#property_isEmpty)
     * [isLoading](DS.Model.html#property_isLoading)
     * [isLoaded](DS.Model.html#property_isLoaded)
     * [isDirty](DS.Model.html#property_isDirty)
     * [isSaving](DS.Model.html#property_isSaving)
     * [isDeleted](DS.Model.html#property_isDeleted)
     * [isNew](DS.Model.html#property_isNew)
     * [isValid](DS.Model.html#property_isValid)
  
    @namespace DS
    @class RootState
  */

  function _didSetProperty(internalModel, context) {
    if (context.value === context.originalValue) {
      delete internalModel._attributes[context.name];
      internalModel.send('propertyWasReset', context.name);
    } else if (context.value !== context.oldValue) {
      internalModel.send('becomeDirty');
    }

    internalModel.updateRecordArraysLater();
  }

  // Implementation notes:
  //
  // Each state has a boolean value for all of the following flags:
  //
  // * isLoaded: The record has a populated `data` property. When a
  //   record is loaded via `store.find`, `isLoaded` is false
  //   until the adapter sets it. When a record is created locally,
  //   its `isLoaded` property is always true.
  // * isDirty: The record has local changes that have not yet been
  //   saved by the adapter. This includes records that have been
  //   created (but not yet saved) or deleted.
  // * isSaving: The record has been committed, but
  //   the adapter has not yet acknowledged that the changes have
  //   been persisted to the backend.
  // * isDeleted: The record was marked for deletion. When `isDeleted`
  //   is true and `isDirty` is true, the record is deleted locally
  //   but the deletion was not yet persisted. When `isSaving` is
  //   true, the change is in-flight. When both `isDirty` and
  //   `isSaving` are false, the change has persisted.
  // * isNew: The record was created on the client and the adapter
  //   did not yet report that it was successfully saved.
  // * isValid: The adapter did not report any server-side validation
  //   failures.

  // The dirty state is a abstract state whose functionality is
  // shared between the `created` and `updated` states.
  //
  // The deleted state shares the `isDirty` flag with the
  // subclasses of `DirtyState`, but with a very different
  // implementation.
  //
  // Dirty states have three child states:
  //
  // `uncommitted`: the store has not yet handed off the record
  //   to be saved.
  // `inFlight`: the store has handed off the record to be saved,
  //   but the adapter has not yet acknowledged success.
  // `invalid`: the record has invalid information and cannot be
  //   send to the adapter yet.
  var DirtyState = {
    initialState: 'uncommitted',

    // FLAGS
    isDirty: true,

    // SUBSTATES

    // When a record first becomes dirty, it is `uncommitted`.
    // This means that there are local pending changes, but they
    // have not yet begun to be saved, and are not invalid.
    uncommitted: {
      // EVENTS
      didSetProperty: _didSetProperty,

      //TODO(Igor) reloading now triggers a
      //loadingData event, though it seems fine?
      loadingData: _ember['default'].K,

      propertyWasReset: function propertyWasReset(internalModel, name) {
        if (!internalModel.hasChangedAttributes()) {
          internalModel.send('rolledBack');
        }
      },

      pushedData: function pushedData(internalModel) {
        internalModel.updateChangedAttributes();

        if (!internalModel.hasChangedAttributes()) {
          internalModel.transitionTo('loaded.saved');
        }
      },

      becomeDirty: _ember['default'].K,

      willCommit: function willCommit(internalModel) {
        internalModel.transitionTo('inFlight');
      },

      reloadRecord: function reloadRecord(internalModel, resolve) {
        resolve(internalModel.store.reloadRecord(internalModel));
      },

      rolledBack: function rolledBack(internalModel) {
        internalModel.transitionTo('loaded.saved');
      },

      becameInvalid: function becameInvalid(internalModel) {
        internalModel.transitionTo('invalid');
      },

      rollback: function rollback(internalModel) {
        internalModel.rollbackAttributes();
        internalModel.triggerLater('ready');
      }
    },

    // Once a record has been handed off to the adapter to be
    // saved, it is in the 'in flight' state. Changes to the
    // record cannot be made during this window.
    inFlight: {
      // FLAGS
      isSaving: true,

      // EVENTS
      didSetProperty: _didSetProperty,
      becomeDirty: _ember['default'].K,
      pushedData: _ember['default'].K,

      unloadRecord: assertAgainstUnloadRecord,

      // TODO: More robust semantics around save-while-in-flight
      willCommit: _ember['default'].K,

      didCommit: function didCommit(internalModel) {
        var dirtyType = get(this, 'dirtyType');

        internalModel.transitionTo('saved');
        internalModel.send('invokeLifecycleCallbacks', dirtyType);
      },

      becameInvalid: function becameInvalid(internalModel) {
        internalModel.transitionTo('invalid');
        internalModel.send('invokeLifecycleCallbacks');
      },

      becameError: function becameError(internalModel) {
        internalModel.transitionTo('uncommitted');
        internalModel.triggerLater('becameError', internalModel);
      }
    },

    // A record is in the `invalid` if the adapter has indicated
    // the the record failed server-side invalidations.
    invalid: {
      // FLAGS
      isValid: false,

      // EVENTS
      deleteRecord: function deleteRecord(internalModel) {
        internalModel.transitionTo('deleted.uncommitted');
      },

      didSetProperty: function didSetProperty(internalModel, context) {
        internalModel.removeErrorMessageFromAttribute(context.name);

        _didSetProperty(internalModel, context);
      },

      becameInvalid: _ember['default'].K,
      becomeDirty: _ember['default'].K,
      pushedData: _ember['default'].K,

      willCommit: function willCommit(internalModel) {
        internalModel.clearErrorMessages();
        internalModel.transitionTo('inFlight');
      },

      rolledBack: function rolledBack(internalModel) {
        internalModel.clearErrorMessages();
        internalModel.transitionTo('loaded.saved');
        internalModel.triggerLater('ready');
      },

      becameValid: function becameValid(internalModel) {
        internalModel.transitionTo('uncommitted');
      },

      invokeLifecycleCallbacks: function invokeLifecycleCallbacks(internalModel) {
        internalModel.triggerLater('becameInvalid', internalModel);
      }
    }
  };

  // The created and updated states are created outside the state
  // chart so we can reopen their substates and add mixins as
  // necessary.

  function deepClone(object) {
    var clone = {};
    var value;

    for (var prop in object) {
      value = object[prop];
      if (value && typeof value === 'object') {
        clone[prop] = deepClone(value);
      } else {
        clone[prop] = value;
      }
    }

    return clone;
  }

  function mixin(original, hash) {
    for (var prop in hash) {
      original[prop] = hash[prop];
    }

    return original;
  }

  function dirtyState(options) {
    var newState = deepClone(DirtyState);
    return mixin(newState, options);
  }

  var createdState = dirtyState({
    dirtyType: 'created',
    // FLAGS
    isNew: true
  });

  createdState.invalid.rolledBack = function (internalModel) {
    internalModel.transitionTo('deleted.saved');
  };
  createdState.uncommitted.rolledBack = function (internalModel) {
    internalModel.transitionTo('deleted.saved');
  };

  var updatedState = dirtyState({
    dirtyType: 'updated'
  });

  createdState.uncommitted.deleteRecord = function (internalModel) {
    internalModel.transitionTo('deleted.saved');
    internalModel.send('invokeLifecycleCallbacks');
  };

  createdState.uncommitted.rollback = function (internalModel) {
    DirtyState.uncommitted.rollback.apply(this, arguments);
    internalModel.transitionTo('deleted.saved');
  };

  createdState.uncommitted.pushedData = function (internalModel) {
    internalModel.transitionTo('loaded.updated.uncommitted');
    internalModel.triggerLater('didLoad');
  };

  createdState.uncommitted.propertyWasReset = _ember['default'].K;

  function assertAgainstUnloadRecord(internalModel) {
    (0, _emberDataPrivateDebug.assert)("You can only unload a record which is not inFlight. `" + internalModel + "`", false);
  }

  updatedState.inFlight.unloadRecord = assertAgainstUnloadRecord;

  updatedState.uncommitted.deleteRecord = function (internalModel) {
    internalModel.transitionTo('deleted.uncommitted');
  };

  var RootState = {
    // FLAGS
    isEmpty: false,
    isLoading: false,
    isLoaded: false,
    isDirty: false,
    isSaving: false,
    isDeleted: false,
    isNew: false,
    isValid: true,

    // DEFAULT EVENTS

    // Trying to roll back if you're not in the dirty state
    // doesn't change your state. For example, if you're in the
    // in-flight state, rolling back the record doesn't move
    // you out of the in-flight state.
    rolledBack: _ember['default'].K,
    unloadRecord: function unloadRecord(internalModel) {
      // clear relationships before moving to deleted state
      // otherwise it fails
      internalModel.clearRelationships();
      internalModel.transitionTo('deleted.saved');
    },

    propertyWasReset: _ember['default'].K,

    // SUBSTATES

    // A record begins its lifecycle in the `empty` state.
    // If its data will come from the adapter, it will
    // transition into the `loading` state. Otherwise, if
    // the record is being created on the client, it will
    // transition into the `created` state.
    empty: {
      isEmpty: true,

      // EVENTS
      loadingData: function loadingData(internalModel, promise) {
        internalModel._loadingPromise = promise;
        internalModel.transitionTo('loading');
      },

      loadedData: function loadedData(internalModel) {
        internalModel.transitionTo('loaded.created.uncommitted');
        internalModel.triggerLater('ready');
      },

      pushedData: function pushedData(internalModel) {
        internalModel.transitionTo('loaded.saved');
        internalModel.triggerLater('didLoad');
        internalModel.triggerLater('ready');
      }
    },

    // A record enters this state when the store asks
    // the adapter for its data. It remains in this state
    // until the adapter provides the requested data.
    //
    // Usually, this process is asynchronous, using an
    // XHR to retrieve the data.
    loading: {
      // FLAGS
      isLoading: true,

      exit: function exit(internalModel) {
        internalModel._loadingPromise = null;
      },

      // EVENTS
      pushedData: function pushedData(internalModel) {
        internalModel.transitionTo('loaded.saved');
        internalModel.triggerLater('didLoad');
        internalModel.triggerLater('ready');
        //TODO this seems out of place here
        internalModel.didCleanError();
      },

      becameError: function becameError(internalModel) {
        internalModel.triggerLater('becameError', internalModel);
      },

      notFound: function notFound(internalModel) {
        internalModel.transitionTo('empty');
      }
    },

    // A record enters this state when its data is populated.
    // Most of a record's lifecycle is spent inside substates
    // of the `loaded` state.
    loaded: {
      initialState: 'saved',

      // FLAGS
      isLoaded: true,

      //TODO(Igor) Reloading now triggers a loadingData event,
      //but it should be ok?
      loadingData: _ember['default'].K,

      // SUBSTATES

      // If there are no local changes to a record, it remains
      // in the `saved` state.
      saved: {
        setup: function setup(internalModel) {
          if (internalModel.hasChangedAttributes()) {
            internalModel.adapterDidDirty();
          }
        },

        // EVENTS
        didSetProperty: _didSetProperty,

        pushedData: _ember['default'].K,

        becomeDirty: function becomeDirty(internalModel) {
          internalModel.transitionTo('updated.uncommitted');
        },

        willCommit: function willCommit(internalModel) {
          internalModel.transitionTo('updated.inFlight');
        },

        reloadRecord: function reloadRecord(internalModel, resolve) {
          resolve(internalModel.store.reloadRecord(internalModel));
        },

        deleteRecord: function deleteRecord(internalModel) {
          internalModel.transitionTo('deleted.uncommitted');
        },

        unloadRecord: function unloadRecord(internalModel) {
          // clear relationships before moving to deleted state
          // otherwise it fails
          internalModel.clearRelationships();
          internalModel.transitionTo('deleted.saved');
        },

        didCommit: function didCommit(internalModel) {
          internalModel.send('invokeLifecycleCallbacks', get(internalModel, 'lastDirtyType'));
        },

        // loaded.saved.notFound would be triggered by a failed
        // `reload()` on an unchanged record
        notFound: _ember['default'].K

      },

      // A record is in this state after it has been locally
      // created but before the adapter has indicated that
      // it has been saved.
      created: createdState,

      // A record is in this state if it has already been
      // saved to the server, but there are new local changes
      // that have not yet been saved.
      updated: updatedState
    },

    // A record is in this state if it was deleted from the store.
    deleted: {
      initialState: 'uncommitted',
      dirtyType: 'deleted',

      // FLAGS
      isDeleted: true,
      isLoaded: true,
      isDirty: true,

      // TRANSITIONS
      setup: function setup(internalModel) {
        internalModel.updateRecordArrays();
      },

      // SUBSTATES

      // When a record is deleted, it enters the `start`
      // state. It will exit this state when the record
      // starts to commit.
      uncommitted: {

        // EVENTS

        willCommit: function willCommit(internalModel) {
          internalModel.transitionTo('inFlight');
        },

        rollback: function rollback(internalModel) {
          internalModel.rollbackAttributes();
          internalModel.triggerLater('ready');
        },

        pushedData: _ember['default'].K,
        becomeDirty: _ember['default'].K,
        deleteRecord: _ember['default'].K,

        rolledBack: function rolledBack(internalModel) {
          internalModel.transitionTo('loaded.saved');
          internalModel.triggerLater('ready');
        }
      },

      // After a record starts committing, but
      // before the adapter indicates that the deletion
      // has saved to the server, a record is in the
      // `inFlight` substate of `deleted`.
      inFlight: {
        // FLAGS
        isSaving: true,

        // EVENTS

        unloadRecord: assertAgainstUnloadRecord,

        // TODO: More robust semantics around save-while-in-flight
        willCommit: _ember['default'].K,
        didCommit: function didCommit(internalModel) {
          internalModel.transitionTo('saved');

          internalModel.send('invokeLifecycleCallbacks');
        },

        becameError: function becameError(internalModel) {
          internalModel.transitionTo('uncommitted');
          internalModel.triggerLater('becameError', internalModel);
        },

        becameInvalid: function becameInvalid(internalModel) {
          internalModel.transitionTo('invalid');
          internalModel.triggerLater('becameInvalid', internalModel);
        }
      },

      // Once the adapter indicates that the deletion has
      // been saved, the record enters the `saved` substate
      // of `deleted`.
      saved: {
        // FLAGS
        isDirty: false,

        setup: function setup(internalModel) {
          internalModel.clearRelationships();
          var store = internalModel.store;
          store._dematerializeRecord(internalModel);
        },

        invokeLifecycleCallbacks: function invokeLifecycleCallbacks(internalModel) {
          internalModel.triggerLater('didDelete', internalModel);
          internalModel.triggerLater('didCommit', internalModel);
        },

        willCommit: _ember['default'].K,

        didCommit: _ember['default'].K
      },

      invalid: {
        isValid: false,

        didSetProperty: function didSetProperty(internalModel, context) {
          internalModel.removeErrorMessageFromAttribute(context.name);

          _didSetProperty(internalModel, context);
        },

        becameInvalid: _ember['default'].K,
        becomeDirty: _ember['default'].K,
        deleteRecord: _ember['default'].K,
        willCommit: _ember['default'].K,

        rolledBack: function rolledBack(internalModel) {
          internalModel.clearErrorMessages();
          internalModel.transitionTo('loaded.saved');
          internalModel.triggerLater('ready');
        },

        becameValid: function becameValid(internalModel) {
          internalModel.transitionTo('uncommitted');
        }

      }
    },

    invokeLifecycleCallbacks: function invokeLifecycleCallbacks(internalModel, dirtyType) {
      if (dirtyType === 'created') {
        internalModel.triggerLater('didCreate', internalModel);
      } else {
        internalModel.triggerLater('didUpdate', internalModel);
      }

      internalModel.triggerLater('didCommit', internalModel);
    }
  };

  function wireState(object, parent, name) {
    /*jshint proto:true*/
    // TODO: Use Object.create and copy instead
    object = mixin(parent ? Object.create(parent) : {}, object);
    object.parentState = parent;
    object.stateName = name;

    for (var prop in object) {
      if (!object.hasOwnProperty(prop) || prop === 'parentState' || prop === 'stateName') {
        continue;
      }
      if (typeof object[prop] === 'object') {
        object[prop] = wireState(object[prop], object, name + "." + prop);
      }
    }

    return object;
  }

  RootState = wireState(RootState, null, "root");

  exports['default'] = RootState;
});
define("ember-data/-private/system/model", ["exports", "ember-data/-private/system/model/model", "ember-data/attr", "ember-data/-private/system/model/states", "ember-data/-private/system/model/errors"], function (exports, _emberDataPrivateSystemModelModel, _emberDataAttr, _emberDataPrivateSystemModelStates, _emberDataPrivateSystemModelErrors) {
  /**
    @module ember-data
  */

  "use strict";

  exports.RootState = _emberDataPrivateSystemModelStates["default"];
  exports.attr = _emberDataAttr["default"];
  exports.Errors = _emberDataPrivateSystemModelErrors["default"];
  exports["default"] = _emberDataPrivateSystemModelModel["default"];
});
define('ember-data/-private/system/normalize-link', ['exports'], function (exports) {
  'use strict';

  exports['default'] = _normalizeLink;

  /**
    This method normalizes a link to an "links object". If the passed link is
    already an object it's returned without any modifications.
  
    See http://jsonapi.org/format/#document-links for more information.
  
    @method _normalizeLink
    @private
    @param {String} link
    @return {Object|null}
    @for DS
  */
  function _normalizeLink(link) {
    switch (typeof link) {
      case 'object':
        return link;
      case 'string':
        return { href: link };
    }
    return null;
  }
});
define("ember-data/-private/system/normalize-model-name", ["exports"], function (exports) {
  "use strict";

  exports["default"] = normalizeModelName;

  /**
    All modelNames are dasherized internally. Changing this function may
    require changes to other normalization hooks (such as typeForRoot).
    @method normalizeModelName
    @public
    @param {String} modelName
    @return {String} if the adapter can generate one, an ID
    @for DS
  */
  function normalizeModelName(modelName) {
    return Ember.String.dasherize(modelName);
  }
});
define("ember-data/-private/system/ordered-set", ["exports"], function (exports) {
  "use strict";

  exports["default"] = OrderedSet;

  var EmberOrderedSet = Ember.OrderedSet;
  var guidFor = Ember.guidFor;
  function OrderedSet() {
    this._super$constructor();
  }

  OrderedSet.create = function () {
    var Constructor = this;
    return new Constructor();
  };

  OrderedSet.prototype = Object.create(EmberOrderedSet.prototype);
  OrderedSet.prototype.constructor = OrderedSet;
  OrderedSet.prototype._super$constructor = EmberOrderedSet;

  OrderedSet.prototype.addWithIndex = function (obj, idx) {
    var guid = guidFor(obj);
    var presenceSet = this.presenceSet;
    var list = this.list;

    if (presenceSet[guid] === true) {
      return;
    }

    presenceSet[guid] = true;

    if (idx === undefined || idx == null) {
      list.push(obj);
    } else {
      list.splice(idx, 0, obj);
    }

    this.size += 1;

    return this;
  };
});
define('ember-data/-private/system/promise-proxies', ['exports', 'ember', 'ember-data/-private/debug'], function (exports, _ember, _emberDataPrivateDebug) {
  'use strict';

  var Promise = _ember['default'].RSVP.Promise;
  var get = _ember['default'].get;

  /**
    A `PromiseArray` is an object that acts like both an `Ember.Array`
    and a promise. When the promise is resolved the resulting value
    will be set to the `PromiseArray`'s `content` property. This makes
    it easy to create data bindings with the `PromiseArray` that will be
    updated when the promise resolves.
  
    For more information see the [Ember.PromiseProxyMixin
    documentation](/api/classes/Ember.PromiseProxyMixin.html).
  
    Example
  
    ```javascript
    var promiseArray = DS.PromiseArray.create({
      promise: $.getJSON('/some/remote/data.json')
    });
  
    promiseArray.get('length'); // 0
  
    promiseArray.then(function() {
      promiseArray.get('length'); // 100
    });
    ```
  
    @class PromiseArray
    @namespace DS
    @extends Ember.ArrayProxy
    @uses Ember.PromiseProxyMixin
  */
  var PromiseArray = _ember['default'].ArrayProxy.extend(_ember['default'].PromiseProxyMixin);

  /**
    A `PromiseObject` is an object that acts like both an `Ember.Object`
    and a promise. When the promise is resolved, then the resulting value
    will be set to the `PromiseObject`'s `content` property. This makes
    it easy to create data bindings with the `PromiseObject` that will
    be updated when the promise resolves.
  
    For more information see the [Ember.PromiseProxyMixin
    documentation](/api/classes/Ember.PromiseProxyMixin.html).
  
    Example
  
    ```javascript
    var promiseObject = DS.PromiseObject.create({
      promise: $.getJSON('/some/remote/data.json')
    });
  
    promiseObject.get('name'); // null
  
    promiseObject.then(function() {
      promiseObject.get('name'); // 'Tomster'
    });
    ```
  
    @class PromiseObject
    @namespace DS
    @extends Ember.ObjectProxy
    @uses Ember.PromiseProxyMixin
  */
  var PromiseObject = _ember['default'].ObjectProxy.extend(_ember['default'].PromiseProxyMixin);

  var promiseObject = function promiseObject(promise, label) {
    return PromiseObject.create({
      promise: Promise.resolve(promise, label)
    });
  };

  var promiseArray = function promiseArray(promise, label) {
    return PromiseArray.create({
      promise: Promise.resolve(promise, label)
    });
  };

  /**
    A PromiseManyArray is a PromiseArray that also proxies certain method calls
    to the underlying manyArray.
    Right now we proxy:
  
      * `reload()`
      * `createRecord()`
      * `on()`
      * `one()`
      * `trigger()`
      * `off()`
      * `has()`
  
    @class PromiseManyArray
    @namespace DS
    @extends Ember.ArrayProxy
  */

  function proxyToContent(method) {
    return function () {
      var content = get(this, 'content');
      return content[method].apply(content, arguments);
    };
  }

  var PromiseManyArray = PromiseArray.extend({
    reload: function reload() {
      //I don't think this should ever happen right now, but worth guarding if we refactor the async relationships
      (0, _emberDataPrivateDebug.assert)('You are trying to reload an async manyArray before it has been created', get(this, 'content'));
      return PromiseManyArray.create({
        promise: get(this, 'content').reload()
      });
    },

    createRecord: proxyToContent('createRecord'),

    on: proxyToContent('on'),

    one: proxyToContent('one'),

    trigger: proxyToContent('trigger'),

    off: proxyToContent('off'),

    has: proxyToContent('has')
  });

  var promiseManyArray = function promiseManyArray(promise, label) {
    return PromiseManyArray.create({
      promise: Promise.resolve(promise, label)
    });
  };

  exports.PromiseArray = PromiseArray;
  exports.PromiseObject = PromiseObject;
  exports.PromiseManyArray = PromiseManyArray;
  exports.promiseArray = promiseArray;
  exports.promiseObject = promiseObject;
  exports.promiseManyArray = promiseManyArray;
});
define("ember-data/-private/system/record-array-manager", ["exports", "ember-data/-private/system/record-arrays", "ember-data/-private/system/ordered-set"], function (exports, _emberDataPrivateSystemRecordArrays, _emberDataPrivateSystemOrderedSet) {
  /**
    @module ember-data
  */

  "use strict";

  var MapWithDefault = Ember.MapWithDefault;var get = Ember.get;

  /**
    @class RecordArrayManager
    @namespace DS
    @private
    @extends Ember.Object
  */
  exports["default"] = Ember.Object.extend({
    init: function init() {
      var _this = this;

      this.filteredRecordArrays = MapWithDefault.create({
        defaultValue: function defaultValue() {
          return [];
        }
      });

      this.liveRecordArrays = MapWithDefault.create({
        defaultValue: function defaultValue(typeClass) {
          return _this.createRecordArray(typeClass);
        }
      });

      this.changedRecords = [];
      this._adapterPopulatedRecordArrays = [];
    },

    recordDidChange: function recordDidChange(record) {
      if (this.changedRecords.push(record) !== 1) {
        return;
      }

      Ember.run.schedule('actions', this, this.updateRecordArrays);
    },

    recordArraysForRecord: function recordArraysForRecord(record) {
      record._recordArrays = record._recordArrays || _emberDataPrivateSystemOrderedSet["default"].create();
      return record._recordArrays;
    },

    /**
      This method is invoked whenever data is loaded into the store by the
      adapter or updated by the adapter, or when a record has changed.
       It updates all record arrays that a record belongs to.
       To avoid thrashing, it only runs at most once per run loop.
       @method updateRecordArrays
    */
    updateRecordArrays: function updateRecordArrays() {
      var _this2 = this;

      this.changedRecords.forEach(function (internalModel) {
        if (get(internalModel, 'record.isDestroyed') || get(internalModel, 'record.isDestroying') || get(internalModel, 'currentState.stateName') === 'root.deleted.saved') {
          _this2._recordWasDeleted(internalModel);
        } else {
          _this2._recordWasChanged(internalModel);
        }
      });

      this.changedRecords.length = 0;
    },

    _recordWasDeleted: function _recordWasDeleted(record) {
      var recordArrays = record._recordArrays;

      if (!recordArrays) {
        return;
      }

      recordArrays.forEach(function (array) {
        return array.removeInternalModel(record);
      });

      record._recordArrays = null;
    },

    _recordWasChanged: function _recordWasChanged(record) {
      var _this3 = this;

      var typeClass = record.type;
      var recordArrays = this.filteredRecordArrays.get(typeClass);
      var filter;
      recordArrays.forEach(function (array) {
        filter = get(array, 'filterFunction');
        _this3.updateFilterRecordArray(array, filter, typeClass, record);
      });
    },

    //Need to update live arrays on loading
    recordWasLoaded: function recordWasLoaded(record) {
      var _this4 = this;

      var typeClass = record.type;
      var recordArrays = this.filteredRecordArrays.get(typeClass);
      var filter;

      recordArrays.forEach(function (array) {
        filter = get(array, 'filterFunction');
        _this4.updateFilterRecordArray(array, filter, typeClass, record);
      });

      if (this.liveRecordArrays.has(typeClass)) {
        var liveRecordArray = this.liveRecordArrays.get(typeClass);
        this._addRecordToRecordArray(liveRecordArray, record);
      }
    },
    /**
      Update an individual filter.
       @method updateFilterRecordArray
      @param {DS.FilteredRecordArray} array
      @param {Function} filter
      @param {DS.Model} typeClass
      @param {InternalModel} record
    */
    updateFilterRecordArray: function updateFilterRecordArray(array, filter, typeClass, record) {
      var shouldBeInArray = filter(record.getRecord());
      var recordArrays = this.recordArraysForRecord(record);
      if (shouldBeInArray) {
        this._addRecordToRecordArray(array, record);
      } else {
        recordArrays["delete"](array);
        array.removeInternalModel(record);
      }
    },

    _addRecordToRecordArray: function _addRecordToRecordArray(array, record) {
      var recordArrays = this.recordArraysForRecord(record);
      if (!recordArrays.has(array)) {
        array.addInternalModel(record);
        recordArrays.add(array);
      }
    },

    populateLiveRecordArray: function populateLiveRecordArray(array, modelName) {
      var typeMap = this.store.typeMapFor(modelName);
      var records = typeMap.records;
      var record;

      for (var i = 0, l = records.length; i < l; i++) {
        record = records[i];

        if (!record.isDeleted() && !record.isEmpty()) {
          this._addRecordToRecordArray(array, record);
        }
      }
    },

    /**
      This method is invoked if the `filterFunction` property is
      changed on a `DS.FilteredRecordArray`.
       It essentially re-runs the filter from scratch. This same
      method is invoked when the filter is created in th first place.
       @method updateFilter
      @param {Array} array
      @param {String} modelName
      @param {Function} filter
    */
    updateFilter: function updateFilter(array, modelName, filter) {
      var typeMap = this.store.typeMapFor(modelName);
      var records = typeMap.records;
      var record;

      for (var i = 0, l = records.length; i < l; i++) {
        record = records[i];

        if (!record.isDeleted() && !record.isEmpty()) {
          this.updateFilterRecordArray(array, filter, modelName, record);
        }
      }
    },

    /**
      Get the `DS.RecordArray` for a type, which contains all loaded records of
      given type.
       @method liveRecordArrayFor
      @param {Class} typeClass
      @return {DS.RecordArray}
    */
    liveRecordArrayFor: function liveRecordArrayFor(typeClass) {
      return this.liveRecordArrays.get(typeClass);
    },

    /**
      Create a `DS.RecordArray` for a type.
       @method createRecordArray
      @param {Class} typeClass
      @return {DS.RecordArray}
    */
    createRecordArray: function createRecordArray(typeClass) {
      var array = _emberDataPrivateSystemRecordArrays.RecordArray.create({
        type: typeClass,
        content: Ember.A(),
        store: this.store,
        isLoaded: true,
        manager: this
      });

      return array;
    },

    /**
      Create a `DS.FilteredRecordArray` for a type and register it for updates.
       @method createFilteredRecordArray
      @param {DS.Model} typeClass
      @param {Function} filter
      @param {Object} query (optional
      @return {DS.FilteredRecordArray}
    */
    createFilteredRecordArray: function createFilteredRecordArray(typeClass, filter, query) {
      var array = _emberDataPrivateSystemRecordArrays.FilteredRecordArray.create({
        query: query,
        type: typeClass,
        content: Ember.A(),
        store: this.store,
        manager: this,
        filterFunction: filter
      });

      this.registerFilteredRecordArray(array, typeClass, filter);

      return array;
    },

    /**
      Create a `DS.AdapterPopulatedRecordArray` for a type with given query.
       @method createAdapterPopulatedRecordArray
      @param {DS.Model} typeClass
      @param {Object} query
      @return {DS.AdapterPopulatedRecordArray}
    */
    createAdapterPopulatedRecordArray: function createAdapterPopulatedRecordArray(typeClass, query) {
      var array = _emberDataPrivateSystemRecordArrays.AdapterPopulatedRecordArray.create({
        type: typeClass,
        query: query,
        content: Ember.A(),
        store: this.store,
        manager: this
      });

      this._adapterPopulatedRecordArrays.push(array);

      return array;
    },

    /**
      Register a RecordArray for a given type to be backed by
      a filter function. This will cause the array to update
      automatically when records of that type change attribute
      values or states.
       @method registerFilteredRecordArray
      @param {DS.RecordArray} array
      @param {DS.Model} typeClass
      @param {Function} filter
    */
    registerFilteredRecordArray: function registerFilteredRecordArray(array, typeClass, filter) {
      var recordArrays = this.filteredRecordArrays.get(typeClass);
      recordArrays.push(array);

      this.updateFilter(array, typeClass, filter);
    },

    /**
      Unregister a RecordArray.
      So manager will not update this array.
       @method unregisterRecordArray
      @param {DS.RecordArray} array
    */
    unregisterRecordArray: function unregisterRecordArray(array) {
      var typeClass = array.type;

      // unregister filtered record array
      var recordArrays = this.filteredRecordArrays.get(typeClass);
      var removedFromFiltered = remove(recordArrays, array);

      // remove from adapter populated record array
      var removedFromAdapterPopulated = remove(this._adapterPopulatedRecordArrays, array);

      if (!removedFromFiltered && !removedFromAdapterPopulated) {

        // unregister live record array
        if (this.liveRecordArrays.has(typeClass)) {
          var liveRecordArrayForType = this.liveRecordArrayFor(typeClass);
          if (array === liveRecordArrayForType) {
            this.liveRecordArrays["delete"](typeClass);
          }
        }
      }
    },

    willDestroy: function willDestroy() {
      this._super.apply(this, arguments);

      this.filteredRecordArrays.forEach(function (value) {
        return flatten(value).forEach(destroy);
      });
      this.liveRecordArrays.forEach(destroy);
      this._adapterPopulatedRecordArrays.forEach(destroy);
    }
  });

  function destroy(entry) {
    entry.destroy();
  }

  function flatten(list) {
    var length = list.length;
    var result = Ember.A();

    for (var i = 0; i < length; i++) {
      result = result.concat(list[i]);
    }

    return result;
  }

  function remove(array, item) {
    var index = array.indexOf(item);

    if (index !== -1) {
      array.splice(index, 1);
      return true;
    }

    return false;
  }
});
define("ember-data/-private/system/record-arrays/adapter-populated-record-array", ["exports", "ember", "ember-data/-private/system/record-arrays/record-array", "ember-data/-private/system/clone-null"], function (exports, _ember, _emberDataPrivateSystemRecordArraysRecordArray, _emberDataPrivateSystemCloneNull) {
  "use strict";

  /**
    @module ember-data
  */

  var get = _ember["default"].get;

  /**
    Represents an ordered list of records whose order and membership is
    determined by the adapter. For example, a query sent to the adapter
    may trigger a search on the server, whose results would be loaded
    into an instance of the `AdapterPopulatedRecordArray`.
  
    @class AdapterPopulatedRecordArray
    @namespace DS
    @extends DS.RecordArray
  */
  exports["default"] = _emberDataPrivateSystemRecordArraysRecordArray["default"].extend({
    query: null,

    replace: function replace() {
      var type = get(this, 'type').toString();
      throw new Error("The result of a server query (on " + type + ") is immutable.");
    },

    /**
      @method loadRecords
      @param {Array} records
      @private
    */
    loadRecords: function loadRecords(records) {
      var _this = this;

      var store = get(this, 'store');
      var type = get(this, 'type');
      var modelName = type.modelName;
      var meta = store._metadataFor(modelName);

      //TODO Optimize
      var internalModels = _ember["default"].A(records).mapBy('_internalModel');
      this.setProperties({
        content: _ember["default"].A(internalModels),
        isLoaded: true,
        meta: (0, _emberDataPrivateSystemCloneNull["default"])(meta)
      });

      internalModels.forEach(function (record) {
        _this.manager.recordArraysForRecord(record).add(_this);
      });

      // TODO: should triggering didLoad event be the last action of the runLoop?
      _ember["default"].run.once(this, 'trigger', 'didLoad');
    }
  });
});
define('ember-data/-private/system/record-arrays/filtered-record-array', ['exports', 'ember', 'ember-data/-private/system/record-arrays/record-array'], function (exports, _ember, _emberDataPrivateSystemRecordArraysRecordArray) {
  'use strict';

  /**
    @module ember-data
  */

  var get = _ember['default'].get;

  /**
    Represents a list of records whose membership is determined by the
    store. As records are created, loaded, or modified, the store
    evaluates them to determine if they should be part of the record
    array.
  
    @class FilteredRecordArray
    @namespace DS
    @extends DS.RecordArray
  */
  exports['default'] = _emberDataPrivateSystemRecordArraysRecordArray['default'].extend({
    /**
      The filterFunction is a function used to test records from the store to
      determine if they should be part of the record array.
       Example
       ```javascript
      var allPeople = store.peekAll('person');
      allPeople.mapBy('name'); // ["Tom Dale", "Yehuda Katz", "Trek Glowacki"]
       var people = store.filter('person', function(person) {
        if (person.get('name').match(/Katz$/)) { return true; }
      });
      people.mapBy('name'); // ["Yehuda Katz"]
       var notKatzFilter = function(person) {
        return !person.get('name').match(/Katz$/);
      };
      people.set('filterFunction', notKatzFilter);
      people.mapBy('name'); // ["Tom Dale", "Trek Glowacki"]
      ```
       @method filterFunction
      @param {DS.Model} record
      @return {Boolean} `true` if the record should be in the array
    */
    filterFunction: null,
    isLoaded: true,

    replace: function replace() {
      var type = get(this, 'type').toString();
      throw new Error("The result of a client-side filter (on " + type + ") is immutable.");
    },

    /**
      @method updateFilter
      @private
    */
    _updateFilter: function _updateFilter() {
      var manager = get(this, 'manager');
      manager.updateFilter(this, get(this, 'type'), get(this, 'filterFunction'));
    },

    updateFilter: _ember['default'].observer('filterFunction', function () {
      _ember['default'].run.once(this, this._updateFilter);
    })
  });
});
define("ember-data/-private/system/record-arrays/record-array", ["exports", "ember", "ember-data/-private/system/promise-proxies", "ember-data/-private/system/snapshot-record-array"], function (exports, _ember, _emberDataPrivateSystemPromiseProxies, _emberDataPrivateSystemSnapshotRecordArray) {
  /**
    @module ember-data
  */

  "use strict";

  var get = _ember["default"].get;
  var set = _ember["default"].set;

  /**
    A record array is an array that contains records of a certain type. The record
    array materializes records as needed when they are retrieved for the first
    time. You should not create record arrays yourself. Instead, an instance of
    `DS.RecordArray` or its subclasses will be returned by your application's store
    in response to queries.
  
    @class RecordArray
    @namespace DS
    @extends Ember.ArrayProxy
    @uses Ember.Evented
  */

  exports["default"] = _ember["default"].ArrayProxy.extend(_ember["default"].Evented, {
    /**
      The model type contained by this record array.
       @property type
      @type DS.Model
    */
    type: null,

    /**
      The array of client ids backing the record array. When a
      record is requested from the record array, the record
      for the client id at the same index is materialized, if
      necessary, by the store.
       @property content
      @private
      @type Ember.Array
    */
    content: null,

    /**
      The flag to signal a `RecordArray` is finished loading data.
       Example
       ```javascript
      var people = store.peekAll('person');
      people.get('isLoaded'); // true
      ```
       @property isLoaded
      @type Boolean
    */
    isLoaded: false,
    /**
      The flag to signal a `RecordArray` is currently loading data.
       Example
       ```javascript
      var people = store.peekAll('person');
      people.get('isUpdating'); // false
      people.update();
      people.get('isUpdating'); // true
      ```
       @property isUpdating
      @type Boolean
    */
    isUpdating: false,

    /**
      The store that created this record array.
       @property store
      @private
      @type DS.Store
    */
    store: null,

    /**
      Retrieves an object from the content by index.
       @method objectAtContent
      @private
      @param {Number} index
      @return {DS.Model} record
    */
    objectAtContent: function objectAtContent(index) {
      var content = get(this, 'content');
      var internalModel = content.objectAt(index);
      return internalModel && internalModel.getRecord();
    },

    /**
      Used to get the latest version of all of the records in this array
      from the adapter.
       Example
       ```javascript
      var people = store.peekAll('person');
      people.get('isUpdating'); // false
      people.update();
      people.get('isUpdating'); // true
      ```
       @method update
    */
    update: function update() {
      if (get(this, 'isUpdating')) {
        return;
      }

      var store = get(this, 'store');
      var modelName = get(this, 'type.modelName');
      var query = get(this, 'query');

      if (query) {
        return store._query(modelName, query, this);
      }

      return store.findAll(modelName, { reload: true });
    },

    /**
      Adds an internal model to the `RecordArray` without duplicates
       @method addInternalModel
      @private
      @param {InternalModel} internalModel
      @param {number} an optional index to insert at
    */
    addInternalModel: function addInternalModel(internalModel, idx) {
      var content = get(this, 'content');
      if (idx === undefined) {
        content.addObject(internalModel);
      } else if (!content.contains(internalModel)) {
        content.insertAt(idx, internalModel);
      }
    },

    /**
      Removes an internalModel to the `RecordArray`.
       @method removeInternalModel
      @private
      @param {InternalModel} internalModel
    */
    removeInternalModel: function removeInternalModel(internalModel) {
      get(this, 'content').removeObject(internalModel);
    },

    /**
      Saves all of the records in the `RecordArray`.
       Example
       ```javascript
      var messages = store.peekAll('message');
      messages.forEach(function(message) {
        message.set('hasBeenSeen', true);
      });
      messages.save();
      ```
       @method save
      @return {DS.PromiseArray} promise
    */
    save: function save() {
      var recordArray = this;
      var promiseLabel = "DS: RecordArray#save " + get(this, 'type');
      var promise = _ember["default"].RSVP.all(this.invoke("save"), promiseLabel).then(function (array) {
        return recordArray;
      }, null, "DS: RecordArray#save return RecordArray");

      return _emberDataPrivateSystemPromiseProxies.PromiseArray.create({ promise: promise });
    },

    _dissociateFromOwnRecords: function _dissociateFromOwnRecords() {
      var _this = this;

      this.get('content').forEach(function (record) {
        var recordArrays = record._recordArrays;

        if (recordArrays) {
          recordArrays["delete"](_this);
        }
      });
    },

    /**
      @method _unregisterFromManager
      @private
    */
    _unregisterFromManager: function _unregisterFromManager() {
      var manager = get(this, 'manager');
      manager.unregisterRecordArray(this);
    },

    willDestroy: function willDestroy() {
      this._unregisterFromManager();
      this._dissociateFromOwnRecords();
      set(this, 'content', undefined);
      this._super.apply(this, arguments);
    },

    createSnapshot: function createSnapshot(options) {
      var adapterOptions = options && options.adapterOptions;
      var meta = this.get('meta');
      return new _emberDataPrivateSystemSnapshotRecordArray["default"](this, meta, adapterOptions);
    }
  });
});
define("ember-data/-private/system/record-arrays", ["exports", "ember-data/-private/system/record-arrays/record-array", "ember-data/-private/system/record-arrays/filtered-record-array", "ember-data/-private/system/record-arrays/adapter-populated-record-array"], function (exports, _emberDataPrivateSystemRecordArraysRecordArray, _emberDataPrivateSystemRecordArraysFilteredRecordArray, _emberDataPrivateSystemRecordArraysAdapterPopulatedRecordArray) {
  /**
    @module ember-data
  */

  "use strict";

  exports.RecordArray = _emberDataPrivateSystemRecordArraysRecordArray["default"];
  exports.FilteredRecordArray = _emberDataPrivateSystemRecordArraysFilteredRecordArray["default"];
  exports.AdapterPopulatedRecordArray = _emberDataPrivateSystemRecordArraysAdapterPopulatedRecordArray["default"];
});
define('ember-data/-private/system/relationship-meta', ['exports', 'ember-inflector', 'ember-data/-private/system/normalize-model-name'], function (exports, _emberInflector, _emberDataPrivateSystemNormalizeModelName) {
  'use strict';

  exports.typeForRelationshipMeta = typeForRelationshipMeta;
  exports.relationshipFromMeta = relationshipFromMeta;

  function typeForRelationshipMeta(meta) {
    var modelName;

    modelName = meta.type || meta.key;
    if (meta.kind === 'hasMany') {
      modelName = (0, _emberInflector.singularize)((0, _emberDataPrivateSystemNormalizeModelName['default'])(modelName));
    }
    return modelName;
  }

  function relationshipFromMeta(meta) {
    return {
      key: meta.key,
      kind: meta.kind,
      type: typeForRelationshipMeta(meta),
      options: meta.options,
      parentType: meta.parentType,
      isRelationship: true
    };
  }
});
define("ember-data/-private/system/relationships/belongs-to", ["exports", "ember", "ember-data/-private/debug", "ember-data/-private/system/normalize-model-name"], function (exports, _ember, _emberDataPrivateDebug, _emberDataPrivateSystemNormalizeModelName) {
  "use strict";

  exports["default"] = belongsTo;

  /**
    `DS.belongsTo` is used to define One-To-One and One-To-Many
    relationships on a [DS.Model](/api/data/classes/DS.Model.html).
  
  
    `DS.belongsTo` takes an optional hash as a second parameter, currently
    supported options are:
  
    - `async`: A boolean value used to explicitly declare this to be an async relationship.
    - `inverse`: A string used to identify the inverse property on a
      related model in a One-To-Many relationship. See [Explicit Inverses](#toc_explicit-inverses)
  
    #### One-To-One
    To declare a one-to-one relationship between two models, use
    `DS.belongsTo`:
  
    ```app/models/user.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      profile: DS.belongsTo('profile')
    });
    ```
  
    ```app/models/profile.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      user: DS.belongsTo('user')
    });
    ```
  
    #### One-To-Many
    To declare a one-to-many relationship between two models, use
    `DS.belongsTo` in combination with `DS.hasMany`, like this:
  
    ```app/models/post.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      comments: DS.hasMany('comment')
    });
    ```
  
    ```app/models/comment.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      post: DS.belongsTo('post')
    });
    ```
  
    You can avoid passing a string as the first parameter. In that case Ember Data
    will infer the type from the key name.
  
    ```app/models/comment.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      post: DS.belongsTo()
    });
    ```
  
    will lookup for a Post type.
  
    @namespace
    @method belongsTo
    @for DS
    @param {String} modelName (optional) type of the relationship
    @param {Object} options (optional) a hash of options
    @return {Ember.computed} relationship
  */
  function belongsTo(modelName, options) {
    var opts, userEnteredModelName;
    if (typeof modelName === 'object') {
      opts = modelName;
      userEnteredModelName = undefined;
    } else {
      opts = options;
      userEnteredModelName = modelName;
    }

    if (typeof userEnteredModelName === 'string') {
      userEnteredModelName = (0, _emberDataPrivateSystemNormalizeModelName["default"])(userEnteredModelName);
    }

    (0, _emberDataPrivateDebug.assert)("The first argument to DS.belongsTo must be a string representing a model type key, not an instance of " + _ember["default"].inspect(userEnteredModelName) + ". E.g., to define a relation to the Person model, use DS.belongsTo('person')", typeof userEnteredModelName === 'string' || typeof userEnteredModelName === 'undefined');

    opts = opts || {};

    var meta = {
      type: userEnteredModelName,
      isRelationship: true,
      options: opts,
      kind: 'belongsTo',
      key: null
    };

    return _ember["default"].computed({
      get: function get(key) {
        if (opts.hasOwnProperty('serialize')) {
          (0, _emberDataPrivateDebug.warn)("You provided a serialize option on the \"" + key + "\" property in the \"" + this._internalModel.modelName + "\" class, this belongs in the serializer. See DS.Serializer and it's implementations http://emberjs.com/api/data/classes/DS.Serializer.html", false, {
            id: 'ds.model.serialize-option-in-belongs-to'
          });
        }

        if (opts.hasOwnProperty('embedded')) {
          (0, _emberDataPrivateDebug.warn)("You provided an embedded option on the \"" + key + "\" property in the \"" + this._internalModel.modelName + "\" class, this belongs in the serializer. See DS.EmbeddedRecordsMixin http://emberjs.com/api/data/classes/DS.EmbeddedRecordsMixin.html", false, {
            id: 'ds.model.embedded-option-in-belongs-to'
          });
        }

        return this._internalModel._relationships.get(key).getRecord();
      },
      set: function set(key, value) {
        if (value === undefined) {
          value = null;
        }
        if (value && value.then) {
          this._internalModel._relationships.get(key).setRecordPromise(value);
        } else if (value) {
          this._internalModel._relationships.get(key).setRecord(value._internalModel);
        } else {
          this._internalModel._relationships.get(key).setRecord(value);
        }

        return this._internalModel._relationships.get(key).getRecord();
      }
    }).meta(meta);
  }

  /*
    These observers observe all `belongsTo` relationships on the record. See
    `relationships/ext` to see how these observers get their dependencies.
  */
  var BelongsToMixin = _ember["default"].Mixin.create({
    notifyBelongsToChanged: function notifyBelongsToChanged(key) {
      this.notifyPropertyChange(key);
    }
  });
  exports.BelongsToMixin = BelongsToMixin;
});
define("ember-data/-private/system/relationships/ext", ["exports", "ember", "ember-data/-private/debug", "ember-data/-private/system/relationship-meta", "ember-data/-private/system/empty-object"], function (exports, _ember, _emberDataPrivateDebug, _emberDataPrivateSystemRelationshipMeta, _emberDataPrivateSystemEmptyObject) {
  "use strict";

  var get = _ember["default"].get;
  var Map = _ember["default"].Map;
  var MapWithDefault = _ember["default"].MapWithDefault;

  var relationshipsDescriptor = _ember["default"].computed(function () {
    if (_ember["default"].testing === true && relationshipsDescriptor._cacheable === true) {
      relationshipsDescriptor._cacheable = false;
    }

    var map = new MapWithDefault({
      defaultValue: function defaultValue() {
        return [];
      }
    });

    // Loop through each computed property on the class
    this.eachComputedProperty(function (name, meta) {
      // If the computed property is a relationship, add
      // it to the map.
      if (meta.isRelationship) {
        meta.key = name;
        var relationshipsForType = map.get((0, _emberDataPrivateSystemRelationshipMeta.typeForRelationshipMeta)(meta));

        relationshipsForType.push({
          name: name,
          kind: meta.kind
        });
      }
    });

    return map;
  }).readOnly();

  var relatedTypesDescriptor = _ember["default"].computed(function () {
    var _this = this;

    if (_ember["default"].testing === true && relatedTypesDescriptor._cacheable === true) {
      relatedTypesDescriptor._cacheable = false;
    }

    var modelName;
    var types = _ember["default"].A();

    // Loop through each computed property on the class,
    // and create an array of the unique types involved
    // in relationships
    this.eachComputedProperty(function (name, meta) {
      if (meta.isRelationship) {
        meta.key = name;
        modelName = (0, _emberDataPrivateSystemRelationshipMeta.typeForRelationshipMeta)(meta);

        (0, _emberDataPrivateDebug.assert)("You specified a hasMany (" + meta.type + ") on " + meta.parentType + " but " + meta.type + " was not found.", modelName);

        if (!types.contains(modelName)) {
          (0, _emberDataPrivateDebug.assert)("Trying to sideload " + name + " on " + _this.toString() + " but the type doesn't exist.", !!modelName);
          types.push(modelName);
        }
      }
    });

    return types;
  }).readOnly();

  var relationshipsByNameDescriptor = _ember["default"].computed(function () {
    if (_ember["default"].testing === true && relationshipsByNameDescriptor._cacheable === true) {
      relationshipsByNameDescriptor._cacheable = false;
    }

    var map = Map.create();

    this.eachComputedProperty(function (name, meta) {
      if (meta.isRelationship) {
        meta.key = name;
        var relationship = (0, _emberDataPrivateSystemRelationshipMeta.relationshipFromMeta)(meta);
        relationship.type = (0, _emberDataPrivateSystemRelationshipMeta.typeForRelationshipMeta)(meta);
        map.set(name, relationship);
      }
    });

    return map;
  }).readOnly();

  /**
    @module ember-data
  */

  /*
    This file defines several extensions to the base `DS.Model` class that
    add support for one-to-many relationships.
  */

  /**
    @class Model
    @namespace DS
  */
  var DidDefinePropertyMixin = _ember["default"].Mixin.create({

    /**
      This Ember.js hook allows an object to be notified when a property
      is defined.
       In this case, we use it to be notified when an Ember Data user defines a
      belongs-to relationship. In that case, we need to set up observers for
      each one, allowing us to track relationship changes and automatically
      reflect changes in the inverse has-many array.
       This hook passes the class being set up, as well as the key and value
      being defined. So, for example, when the user does this:
       ```javascript
      DS.Model.extend({
        parent: DS.belongsTo('user')
      });
      ```
       This hook would be called with "parent" as the key and the computed
      property returned by `DS.belongsTo` as the value.
       @method didDefineProperty
      @param {Object} proto
      @param {String} key
      @param {Ember.ComputedProperty} value
    */
    didDefineProperty: function didDefineProperty(proto, key, value) {
      // Check if the value being set is a computed property.
      if (value instanceof _ember["default"].ComputedProperty) {

        // If it is, get the metadata for the relationship. This is
        // populated by the `DS.belongsTo` helper when it is creating
        // the computed property.
        var meta = value.meta();

        meta.parentType = proto.constructor;
      }
    }
  });

  exports.DidDefinePropertyMixin = DidDefinePropertyMixin;

  /*
    These DS.Model extensions add class methods that provide relationship
    introspection abilities about relationships.
  
    A note about the computed properties contained here:
  
    **These properties are effectively sealed once called for the first time.**
    To avoid repeatedly doing expensive iteration over a model's fields, these
    values are computed once and then cached for the remainder of the runtime of
    your application.
  
    If your application needs to modify a class after its initial definition
    (for example, using `reopen()` to add additional attributes), make sure you
    do it before using your model with the store, which uses these properties
    extensively.
  */

  var RelationshipsClassMethodsMixin = _ember["default"].Mixin.create({

    /**
      For a given relationship name, returns the model type of the relationship.
       For example, if you define a model like this:
       ```app/models/post.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        comments: DS.hasMany('comment')
      });
     ```
       Calling `App.Post.typeForRelationship('comments')` will return `App.Comment`.
       @method typeForRelationship
      @static
      @param {String} name the name of the relationship
      @param {store} store an instance of DS.Store
      @return {DS.Model} the type of the relationship, or undefined
    */
    typeForRelationship: function typeForRelationship(name, store) {
      var relationship = get(this, 'relationshipsByName').get(name);
      return relationship && store.modelFor(relationship.type);
    },

    inverseMap: _ember["default"].computed(function () {
      return new _emberDataPrivateSystemEmptyObject["default"]();
    }),

    /**
      Find the relationship which is the inverse of the one asked for.
       For example, if you define models like this:
       ```app/models/post.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        comments: DS.hasMany('message')
      });
      ```
       ```app/models/message.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        owner: DS.belongsTo('post')
      });
      ```
       App.Post.inverseFor('comments') -> { type: App.Message, name: 'owner', kind: 'belongsTo' }
      App.Message.inverseFor('owner') -> { type: App.Post, name: 'comments', kind: 'hasMany' }
       @method inverseFor
      @static
      @param {String} name the name of the relationship
      @return {Object} the inverse relationship, or null
    */
    inverseFor: function inverseFor(name, store) {
      var inverseMap = get(this, 'inverseMap');
      if (inverseMap[name]) {
        return inverseMap[name];
      } else {
        var inverse = this._findInverseFor(name, store);
        inverseMap[name] = inverse;
        return inverse;
      }
    },

    //Calculate the inverse, ignoring the cache
    _findInverseFor: function _findInverseFor(name, store) {

      var inverseType = this.typeForRelationship(name, store);
      if (!inverseType) {
        return null;
      }

      var propertyMeta = this.metaForProperty(name);
      //If inverse is manually specified to be null, like  `comments: DS.hasMany('message', { inverse: null })`
      var options = propertyMeta.options;
      if (options.inverse === null) {
        return null;
      }

      var inverseName, inverseKind, inverse;

      //If inverse is specified manually, return the inverse
      if (options.inverse) {
        inverseName = options.inverse;
        inverse = _ember["default"].get(inverseType, 'relationshipsByName').get(inverseName);

        (0, _emberDataPrivateDebug.assert)("We found no inverse relationships by the name of '" + inverseName + "' on the '" + inverseType.modelName + "' model. This is most likely due to a missing attribute on your model definition.", !_ember["default"].isNone(inverse));

        inverseKind = inverse.kind;
      } else {
        //No inverse was specified manually, we need to use a heuristic to guess one
        if (propertyMeta.type === propertyMeta.parentType.modelName) {
          (0, _emberDataPrivateDebug.warn)("Detected a reflexive relationship by the name of '" + name + "' without an inverse option. Look at http://emberjs.com/guides/models/defining-models/#toc_reflexive-relation for how to explicitly specify inverses.", false, {
            id: 'ds.model.reflexive-relationship-without-inverse'
          });
        }

        var possibleRelationships = findPossibleInverses(this, inverseType);

        if (possibleRelationships.length === 0) {
          return null;
        }

        var filteredRelationships = possibleRelationships.filter(function (possibleRelationship) {
          var optionsForRelationship = inverseType.metaForProperty(possibleRelationship.name).options;
          return name === optionsForRelationship.inverse;
        });

        (0, _emberDataPrivateDebug.assert)("You defined the '" + name + "' relationship on " + this + ", but you defined the inverse relationships of type " + inverseType.toString() + " multiple times. Look at http://emberjs.com/guides/models/defining-models/#toc_explicit-inverses for how to explicitly specify inverses", filteredRelationships.length < 2);

        if (filteredRelationships.length === 1) {
          possibleRelationships = filteredRelationships;
        }

        (0, _emberDataPrivateDebug.assert)("You defined the '" + name + "' relationship on " + this + ", but multiple possible inverse relationships of type " + this + " were found on " + inverseType + ". Look at http://emberjs.com/guides/models/defining-models/#toc_explicit-inverses for how to explicitly specify inverses", possibleRelationships.length === 1);

        inverseName = possibleRelationships[0].name;
        inverseKind = possibleRelationships[0].kind;
      }

      function findPossibleInverses(type, inverseType, relationshipsSoFar) {
        var possibleRelationships = relationshipsSoFar || [];

        var relationshipMap = get(inverseType, 'relationships');
        if (!relationshipMap) {
          return possibleRelationships;
        }

        var relationships = relationshipMap.get(type.modelName);

        relationships = relationships.filter(function (relationship) {
          var optionsForRelationship = inverseType.metaForProperty(relationship.name).options;

          if (!optionsForRelationship.inverse) {
            return true;
          }

          return name === optionsForRelationship.inverse;
        });

        if (relationships) {
          possibleRelationships.push.apply(possibleRelationships, relationships);
        }

        //Recurse to support polymorphism
        if (type.superclass) {
          findPossibleInverses(type.superclass, inverseType, possibleRelationships);
        }

        return possibleRelationships;
      }

      return {
        type: inverseType,
        name: inverseName,
        kind: inverseKind
      };
    },

    /**
      The model's relationships as a map, keyed on the type of the
      relationship. The value of each entry is an array containing a descriptor
      for each relationship with that type, describing the name of the relationship
      as well as the type.
       For example, given the following model definition:
       ```app/models/blog.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        users: DS.hasMany('user'),
        owner: DS.belongsTo('user'),
        posts: DS.hasMany('post')
      });
      ```
       This computed property would return a map describing these
      relationships, like this:
       ```javascript
      import Ember from 'ember';
      import Blog from 'app/models/blog';
       var relationships = Ember.get(Blog, 'relationships');
      relationships.get(App.User);
      //=> [ { name: 'users', kind: 'hasMany' },
      //     { name: 'owner', kind: 'belongsTo' } ]
      relationships.get(App.Post);
      //=> [ { name: 'posts', kind: 'hasMany' } ]
      ```
       @property relationships
      @static
      @type Ember.Map
      @readOnly
    */

    relationships: relationshipsDescriptor,

    /**
      A hash containing lists of the model's relationships, grouped
      by the relationship kind. For example, given a model with this
      definition:
       ```app/models/blog.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        users: DS.hasMany('user'),
        owner: DS.belongsTo('user'),
         posts: DS.hasMany('post')
      });
      ```
       This property would contain the following:
       ```javascript
      import Ember from 'ember';
      import Blog from 'app/models/blog';
       var relationshipNames = Ember.get(Blog, 'relationshipNames');
      relationshipNames.hasMany;
      //=> ['users', 'posts']
      relationshipNames.belongsTo;
      //=> ['owner']
      ```
       @property relationshipNames
      @static
      @type Object
      @readOnly
    */
    relationshipNames: _ember["default"].computed(function () {
      var names = {
        hasMany: [],
        belongsTo: []
      };

      this.eachComputedProperty(function (name, meta) {
        if (meta.isRelationship) {
          names[meta.kind].push(name);
        }
      });

      return names;
    }),

    /**
      An array of types directly related to a model. Each type will be
      included once, regardless of the number of relationships it has with
      the model.
       For example, given a model with this definition:
       ```app/models/blog.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        users: DS.hasMany('user'),
        owner: DS.belongsTo('user'),
         posts: DS.hasMany('post')
      });
      ```
       This property would contain the following:
       ```javascript
      import Ember from 'ember';
      import Blog from 'app/models/blog';
       var relatedTypes = Ember.get(Blog, 'relatedTypes');
      //=> [ App.User, App.Post ]
      ```
       @property relatedTypes
      @static
      @type Ember.Array
      @readOnly
    */
    relatedTypes: relatedTypesDescriptor,

    /**
      A map whose keys are the relationships of a model and whose values are
      relationship descriptors.
       For example, given a model with this
      definition:
       ```app/models/blog.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        users: DS.hasMany('user'),
        owner: DS.belongsTo('user'),
         posts: DS.hasMany('post')
      });
      ```
       This property would contain the following:
       ```javascript
      import Ember from 'ember';
      import Blog from 'app/models/blog';
       var relationshipsByName = Ember.get(Blog, 'relationshipsByName');
      relationshipsByName.get('users');
      //=> { key: 'users', kind: 'hasMany', type: App.User }
      relationshipsByName.get('owner');
      //=> { key: 'owner', kind: 'belongsTo', type: App.User }
      ```
       @property relationshipsByName
      @static
      @type Ember.Map
      @readOnly
    */
    relationshipsByName: relationshipsByNameDescriptor,

    /**
      A map whose keys are the fields of the model and whose values are strings
      describing the kind of the field. A model's fields are the union of all of its
      attributes and relationships.
       For example:
       ```app/models/blog.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        users: DS.hasMany('user'),
        owner: DS.belongsTo('user'),
         posts: DS.hasMany('post'),
         title: DS.attr('string')
      });
      ```
       ```js
      import Ember from 'ember';
      import Blog from 'app/models/blog';
       var fields = Ember.get(Blog, 'fields');
      fields.forEach(function(kind, field) {
        console.log(field, kind);
      });
       // prints:
      // users, hasMany
      // owner, belongsTo
      // posts, hasMany
      // title, attribute
      ```
       @property fields
      @static
      @type Ember.Map
      @readOnly
    */
    fields: _ember["default"].computed(function () {
      var map = Map.create();

      this.eachComputedProperty(function (name, meta) {
        if (meta.isRelationship) {
          map.set(name, meta.kind);
        } else if (meta.isAttribute) {
          map.set(name, 'attribute');
        }
      });

      return map;
    }).readOnly(),

    /**
      Given a callback, iterates over each of the relationships in the model,
      invoking the callback with the name of each relationship and its relationship
      descriptor.
       @method eachRelationship
      @static
      @param {Function} callback the callback to invoke
      @param {any} binding the value to which the callback's `this` should be bound
    */
    eachRelationship: function eachRelationship(callback, binding) {
      get(this, 'relationshipsByName').forEach(function (relationship, name) {
        callback.call(binding, name, relationship);
      });
    },

    /**
      Given a callback, iterates over each of the types related to a model,
      invoking the callback with the related type's class. Each type will be
      returned just once, regardless of how many different relationships it has
      with a model.
       @method eachRelatedType
      @static
      @param {Function} callback the callback to invoke
      @param {any} binding the value to which the callback's `this` should be bound
    */
    eachRelatedType: function eachRelatedType(callback, binding) {
      get(this, 'relatedTypes').forEach(function (type) {
        callback.call(binding, type);
      });
    },

    determineRelationshipType: function determineRelationshipType(knownSide, store) {
      var knownKey = knownSide.key;
      var knownKind = knownSide.kind;
      var inverse = this.inverseFor(knownKey, store);
      var key, otherKind;

      if (!inverse) {
        return knownKind === 'belongsTo' ? 'oneToNone' : 'manyToNone';
      }

      key = inverse.name;
      otherKind = inverse.kind;

      if (otherKind === 'belongsTo') {
        return knownKind === 'belongsTo' ? 'oneToOne' : 'manyToOne';
      } else {
        return knownKind === 'belongsTo' ? 'oneToMany' : 'manyToMany';
      }
    }

  });

  exports.RelationshipsClassMethodsMixin = RelationshipsClassMethodsMixin;

  var RelationshipsInstanceMethodsMixin = _ember["default"].Mixin.create({
    /**
      Given a callback, iterates over each of the relationships in the model,
      invoking the callback with the name of each relationship and its relationship
      descriptor.
        The callback method you provide should have the following signature (all
      parameters are optional):
       ```javascript
      function(name, descriptor);
      ```
       - `name` the name of the current property in the iteration
      - `descriptor` the meta object that describes this relationship
       The relationship descriptor argument is an object with the following properties.
      - **key** <span class="type">String</span> the name of this relationship on the Model
     - **kind** <span class="type">String</span> "hasMany" or "belongsTo"
     - **options** <span class="type">Object</span> the original options hash passed when the relationship was declared
     - **parentType** <span class="type">DS.Model</span> the type of the Model that owns this relationship
     - **type** <span class="type">DS.Model</span> the type of the related Model
       Note that in addition to a callback, you can also pass an optional target
      object that will be set as `this` on the context.
       Example
       ```app/serializers/application.js
      import DS from 'ember-data';
       export default DS.JSONSerializer.extend({
        serialize: function(record, options) {
          var json = {};
           record.eachRelationship(function(name, descriptor) {
            if (descriptor.kind === 'hasMany') {
              var serializedHasManyName = name.toUpperCase() + '_IDS';
              json[serializedHasManyName] = record.get(name).mapBy('id');
            }
          });
           return json;
        }
      });
      ```
       @method eachRelationship
      @param {Function} callback the callback to invoke
      @param {any} binding the value to which the callback's `this` should be bound
    */
    eachRelationship: function eachRelationship(callback, binding) {
      this.constructor.eachRelationship(callback, binding);
    },

    relationshipFor: function relationshipFor(name) {
      return get(this.constructor, 'relationshipsByName').get(name);
    },

    inverseFor: function inverseFor(key) {
      return this.constructor.inverseFor(key, this.store);
    }

  });
  exports.RelationshipsInstanceMethodsMixin = RelationshipsInstanceMethodsMixin;
});
define("ember-data/-private/system/relationships/has-many", ["exports", "ember", "ember-data/-private/debug", "ember-data/-private/system/normalize-model-name", "ember-data/-private/system/is-array-like"], function (exports, _ember, _emberDataPrivateDebug, _emberDataPrivateSystemNormalizeModelName, _emberDataPrivateSystemIsArrayLike) {
  "use strict";

  exports["default"] = hasMany;

  /**
    @module ember-data
  */

  /**
    `DS.hasMany` is used to define One-To-Many and Many-To-Many
    relationships on a [DS.Model](/api/data/classes/DS.Model.html).
  
    `DS.hasMany` takes an optional hash as a second parameter, currently
    supported options are:
  
    - `async`: A boolean value used to explicitly declare this to be an async relationship.
    - `inverse`: A string used to identify the inverse property on a related model.
  
    #### One-To-Many
    To declare a one-to-many relationship between two models, use
    `DS.belongsTo` in combination with `DS.hasMany`, like this:
  
    ```app/models/post.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      comments: DS.hasMany('comment')
    });
    ```
  
    ```app/models/comment.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      post: DS.belongsTo('post')
    });
    ```
  
    #### Many-To-Many
    To declare a many-to-many relationship between two models, use
    `DS.hasMany`:
  
    ```app/models/post.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      tags: DS.hasMany('tag')
    });
    ```
  
    ```app/models/tag.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      posts: DS.hasMany('post')
    });
    ```
  
    You can avoid passing a string as the first parameter. In that case Ember Data
    will infer the type from the singularized key name.
  
    ```app/models/post.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      tags: DS.hasMany()
    });
    ```
  
    will lookup for a Tag type.
  
    #### Explicit Inverses
  
    Ember Data will do its best to discover which relationships map to
    one another. In the one-to-many code above, for example, Ember Data
    can figure out that changing the `comments` relationship should update
    the `post` relationship on the inverse because post is the only
    relationship to that model.
  
    However, sometimes you may have multiple `belongsTo`/`hasManys` for the
    same type. You can specify which property on the related model is
    the inverse using `DS.hasMany`'s `inverse` option:
  
    ```app/models/comment.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      onePost: DS.belongsTo('post'),
      twoPost: DS.belongsTo('post'),
      redPost: DS.belongsTo('post'),
      bluePost: DS.belongsTo('post')
    });
    ```
  
    ```app/models/post.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      comments: DS.hasMany('comment', {
        inverse: 'redPost'
      })
    });
    ```
  
    You can also specify an inverse on a `belongsTo`, which works how
    you'd expect.
  
    @namespace
    @method hasMany
    @for DS
    @param {String} type (optional) type of the relationship
    @param {Object} options (optional) a hash of options
    @return {Ember.computed} relationship
  */
  function hasMany(type, options) {
    if (typeof type === 'object') {
      options = type;
      type = undefined;
    }

    (0, _emberDataPrivateDebug.assert)("The first argument to DS.hasMany must be a string representing a model type key, not an instance of " + _ember["default"].inspect(type) + ". E.g., to define a relation to the Comment model, use DS.hasMany('comment')", typeof type === 'string' || typeof type === 'undefined');

    options = options || {};

    if (typeof type === 'string') {
      type = (0, _emberDataPrivateSystemNormalizeModelName["default"])(type);
    }

    // Metadata about relationships is stored on the meta of
    // the relationship. This is used for introspection and
    // serialization. Note that `key` is populated lazily
    // the first time the CP is called.
    var meta = {
      type: type,
      isRelationship: true,
      options: options,
      kind: 'hasMany',
      key: null
    };

    return _ember["default"].computed({
      get: function get(key) {
        var relationship = this._internalModel._relationships.get(key);
        return relationship.getRecords();
      },
      set: function set(key, records) {
        var Model = require('ember-data/model')["default"];
        (0, _emberDataPrivateDebug.assert)("You must pass an array of records to set a hasMany relationship", (0, _emberDataPrivateSystemIsArrayLike["default"])(records));
        (0, _emberDataPrivateDebug.assert)("All elements of a hasMany relationship must be instances of DS.Model, you passed " + _ember["default"].inspect(records), (function () {
          return _ember["default"].A(records).every(function (record) {
            return Model.detectInstance(record);
          });
        })());

        var relationship = this._internalModel._relationships.get(key);
        relationship.clear();
        relationship.addRecords(_ember["default"].A(records).mapBy('_internalModel'));
        return relationship.getRecords();
      }
    }).meta(meta);
  }

  var HasManyMixin = _ember["default"].Mixin.create({
    notifyHasManyAdded: function notifyHasManyAdded(key) {
      //We need to notifyPropertyChange in the adding case because we need to make sure
      //we fetch the newly added record in case it is unloaded
      //TODO(Igor): Consider whether we could do this only if the record state is unloaded

      //Goes away once hasMany is double promisified
      this.notifyPropertyChange(key);
    }
  });
  exports.HasManyMixin = HasManyMixin;
});
define("ember-data/-private/system/relationships/state/belongs-to", ["exports", "ember", "ember-data/-private/debug", "ember-data/-private/system/promise-proxies", "ember-data/-private/utils", "ember-data/-private/system/relationships/state/relationship"], function (exports, _ember, _emberDataPrivateDebug, _emberDataPrivateSystemPromiseProxies, _emberDataPrivateUtils, _emberDataPrivateSystemRelationshipsStateRelationship) {
  "use strict";

  exports["default"] = BelongsToRelationship;

  function BelongsToRelationship(store, record, inverseKey, relationshipMeta) {
    this._super$constructor(store, record, inverseKey, relationshipMeta);
    this.record = record;
    this.key = relationshipMeta.key;
    this.inverseRecord = null;
    this.canonicalState = null;
  }

  BelongsToRelationship.prototype = Object.create(_emberDataPrivateSystemRelationshipsStateRelationship["default"].prototype);
  BelongsToRelationship.prototype.constructor = BelongsToRelationship;
  BelongsToRelationship.prototype._super$constructor = _emberDataPrivateSystemRelationshipsStateRelationship["default"];

  BelongsToRelationship.prototype.setRecord = function (newRecord) {
    if (newRecord) {
      this.addRecord(newRecord);
    } else if (this.inverseRecord) {
      this.removeRecord(this.inverseRecord);
    }
    this.setHasData(true);
    this.setHasLoaded(true);
  };

  BelongsToRelationship.prototype.setCanonicalRecord = function (newRecord) {
    if (newRecord) {
      this.addCanonicalRecord(newRecord);
    } else if (this.inverseRecord) {
      this.removeCanonicalRecord(this.inverseRecord);
    }
    this.setHasData(true);
    this.setHasLoaded(true);
  };

  BelongsToRelationship.prototype._super$addCanonicalRecord = _emberDataPrivateSystemRelationshipsStateRelationship["default"].prototype.addCanonicalRecord;
  BelongsToRelationship.prototype.addCanonicalRecord = function (newRecord) {
    if (this.canonicalMembers.has(newRecord)) {
      return;
    }

    if (this.canonicalState) {
      this.removeCanonicalRecord(this.canonicalState);
    }

    this.canonicalState = newRecord;
    this._super$addCanonicalRecord(newRecord);
  };

  BelongsToRelationship.prototype._super$flushCanonical = _emberDataPrivateSystemRelationshipsStateRelationship["default"].prototype.flushCanonical;
  BelongsToRelationship.prototype.flushCanonical = function () {
    //temporary fix to not remove newly created records if server returned null.
    //TODO remove once we have proper diffing
    if (this.inverseRecord && this.inverseRecord.isNew() && !this.canonicalState) {
      return;
    }
    this.inverseRecord = this.canonicalState;
    this.record.notifyBelongsToChanged(this.key);
    this._super$flushCanonical();
  };

  BelongsToRelationship.prototype._super$addRecord = _emberDataPrivateSystemRelationshipsStateRelationship["default"].prototype.addRecord;
  BelongsToRelationship.prototype.addRecord = function (newRecord) {
    if (this.members.has(newRecord)) {
      return;
    }

    (0, _emberDataPrivateUtils.assertPolymorphicType)(this.record, this.relationshipMeta, newRecord);

    if (this.inverseRecord) {
      this.removeRecord(this.inverseRecord);
    }

    this.inverseRecord = newRecord;
    this._super$addRecord(newRecord);
    this.record.notifyBelongsToChanged(this.key);
  };

  BelongsToRelationship.prototype.setRecordPromise = function (newPromise) {
    var content = newPromise.get && newPromise.get('content');
    (0, _emberDataPrivateDebug.assert)("You passed in a promise that did not originate from an EmberData relationship. You can only pass promises that come from a belongsTo or hasMany relationship to the get call.", content !== undefined);
    this.setRecord(content ? content._internalModel : content);
  };

  BelongsToRelationship.prototype._super$removeRecordFromOwn = _emberDataPrivateSystemRelationshipsStateRelationship["default"].prototype.removeRecordFromOwn;
  BelongsToRelationship.prototype.removeRecordFromOwn = function (record) {
    if (!this.members.has(record)) {
      return;
    }
    this.inverseRecord = null;
    this._super$removeRecordFromOwn(record);
    this.record.notifyBelongsToChanged(this.key);
  };

  BelongsToRelationship.prototype._super$removeCanonicalRecordFromOwn = _emberDataPrivateSystemRelationshipsStateRelationship["default"].prototype.removeCanonicalRecordFromOwn;
  BelongsToRelationship.prototype.removeCanonicalRecordFromOwn = function (record) {
    if (!this.canonicalMembers.has(record)) {
      return;
    }
    this.canonicalState = null;
    this._super$removeCanonicalRecordFromOwn(record);
  };

  BelongsToRelationship.prototype.findRecord = function () {
    if (this.inverseRecord) {
      return this.store._findByInternalModel(this.inverseRecord);
    } else {
      return _ember["default"].RSVP.Promise.resolve(null);
    }
  };

  BelongsToRelationship.prototype.fetchLink = function () {
    var _this = this;

    return this.store.findBelongsTo(this.record, this.link, this.relationshipMeta).then(function (record) {
      if (record) {
        _this.addRecord(record);
      }
      return record;
    });
  };

  BelongsToRelationship.prototype.getRecord = function () {
    var _this2 = this;

    //TODO(Igor) flushCanonical here once our syncing is not stupid
    if (this.isAsync) {
      var promise;
      if (this.link) {
        if (this.hasLoaded) {
          promise = this.findRecord();
        } else {
          promise = this.findLink().then(function () {
            return _this2.findRecord();
          });
        }
      } else {
        promise = this.findRecord();
      }

      return _emberDataPrivateSystemPromiseProxies.PromiseObject.create({
        promise: promise,
        content: this.inverseRecord ? this.inverseRecord.getRecord() : null
      });
    } else {
      if (this.inverseRecord === null) {
        return null;
      }
      var toReturn = this.inverseRecord.getRecord();
      (0, _emberDataPrivateDebug.assert)("You looked up the '" + this.key + "' relationship on a '" + this.record.type.modelName + "' with id " + this.record.id + " but some of the associated records were not loaded. Either make sure they are all loaded together with the parent record, or specify that the relationship is async (`DS.belongsTo({ async: true })`)", toReturn === null || !toReturn.get('isEmpty'));
      return toReturn;
    }
  };
});
define("ember-data/-private/system/relationships/state/create", ["exports", "ember", "ember-data/-private/system/relationships/state/has-many", "ember-data/-private/system/relationships/state/belongs-to", "ember-data/-private/system/empty-object"], function (exports, _ember, _emberDataPrivateSystemRelationshipsStateHasMany, _emberDataPrivateSystemRelationshipsStateBelongsTo, _emberDataPrivateSystemEmptyObject) {
  "use strict";

  exports["default"] = Relationships;

  var get = _ember["default"].get;

  function createRelationshipFor(record, relationshipMeta, store) {
    var inverseKey;
    var inverse = record.type.inverseFor(relationshipMeta.key, store);

    if (inverse) {
      inverseKey = inverse.name;
    }

    if (relationshipMeta.kind === 'hasMany') {
      return new _emberDataPrivateSystemRelationshipsStateHasMany["default"](store, record, inverseKey, relationshipMeta);
    } else {
      return new _emberDataPrivateSystemRelationshipsStateBelongsTo["default"](store, record, inverseKey, relationshipMeta);
    }
  }
  function Relationships(record) {
    this.record = record;
    this.initializedRelationships = new _emberDataPrivateSystemEmptyObject["default"]();
  }

  Relationships.prototype.has = function (key) {
    return !!this.initializedRelationships[key];
  };

  Relationships.prototype.get = function (key) {
    var relationships = this.initializedRelationships;
    var relationshipsByName = get(this.record.type, 'relationshipsByName');
    if (!relationships[key] && relationshipsByName.get(key)) {
      relationships[key] = createRelationshipFor(this.record, relationshipsByName.get(key), this.record.store);
    }
    return relationships[key];
  };
});
define("ember-data/-private/system/relationships/state/has-many", ["exports", "ember-data/-private/debug", "ember-data/-private/system/promise-proxies", "ember-data/-private/system/relationships/state/relationship", "ember-data/-private/system/ordered-set", "ember-data/-private/system/many-array", "ember-data/-private/utils"], function (exports, _emberDataPrivateDebug, _emberDataPrivateSystemPromiseProxies, _emberDataPrivateSystemRelationshipsStateRelationship, _emberDataPrivateSystemOrderedSet, _emberDataPrivateSystemManyArray, _emberDataPrivateUtils) {
  "use strict";

  exports["default"] = ManyRelationship;

  function ManyRelationship(store, record, inverseKey, relationshipMeta) {
    this._super$constructor(store, record, inverseKey, relationshipMeta);
    this.belongsToType = relationshipMeta.type;
    this.canonicalState = [];
    this.manyArray = _emberDataPrivateSystemManyArray["default"].create({
      canonicalState: this.canonicalState,
      store: this.store,
      relationship: this,
      type: this.store.modelFor(this.belongsToType),
      record: record
    });
    this.isPolymorphic = relationshipMeta.options.polymorphic;
    this.manyArray.isPolymorphic = this.isPolymorphic;
  }

  ManyRelationship.prototype = Object.create(_emberDataPrivateSystemRelationshipsStateRelationship["default"].prototype);
  ManyRelationship.prototype.constructor = ManyRelationship;
  ManyRelationship.prototype._super$constructor = _emberDataPrivateSystemRelationshipsStateRelationship["default"];

  ManyRelationship.prototype.destroy = function () {
    this.manyArray.destroy();
  };

  ManyRelationship.prototype._super$updateMeta = _emberDataPrivateSystemRelationshipsStateRelationship["default"].prototype.updateMeta;
  ManyRelationship.prototype.updateMeta = function (meta) {
    this._super$updateMeta(meta);
    this.manyArray.set('meta', meta);
  };

  ManyRelationship.prototype._super$addCanonicalRecord = _emberDataPrivateSystemRelationshipsStateRelationship["default"].prototype.addCanonicalRecord;
  ManyRelationship.prototype.addCanonicalRecord = function (record, idx) {
    if (this.canonicalMembers.has(record)) {
      return;
    }
    if (idx !== undefined) {
      this.canonicalState.splice(idx, 0, record);
    } else {
      this.canonicalState.push(record);
    }
    this._super$addCanonicalRecord(record, idx);
  };

  ManyRelationship.prototype._super$addRecord = _emberDataPrivateSystemRelationshipsStateRelationship["default"].prototype.addRecord;
  ManyRelationship.prototype.addRecord = function (record, idx) {
    if (this.members.has(record)) {
      return;
    }
    this._super$addRecord(record, idx);
    this.manyArray.internalAddRecords([record], idx);
  };

  ManyRelationship.prototype._super$removeCanonicalRecordFromOwn = _emberDataPrivateSystemRelationshipsStateRelationship["default"].prototype.removeCanonicalRecordFromOwn;
  ManyRelationship.prototype.removeCanonicalRecordFromOwn = function (record, idx) {
    var i = idx;
    if (!this.canonicalMembers.has(record)) {
      return;
    }
    if (i === undefined) {
      i = this.canonicalState.indexOf(record);
    }
    if (i > -1) {
      this.canonicalState.splice(i, 1);
    }
    this._super$removeCanonicalRecordFromOwn(record, idx);
  };

  ManyRelationship.prototype._super$flushCanonical = _emberDataPrivateSystemRelationshipsStateRelationship["default"].prototype.flushCanonical;
  ManyRelationship.prototype.flushCanonical = function () {
    this.manyArray.flushCanonical();
    this._super$flushCanonical();
  };

  ManyRelationship.prototype._super$removeRecordFromOwn = _emberDataPrivateSystemRelationshipsStateRelationship["default"].prototype.removeRecordFromOwn;
  ManyRelationship.prototype.removeRecordFromOwn = function (record, idx) {
    if (!this.members.has(record)) {
      return;
    }
    this._super$removeRecordFromOwn(record, idx);
    if (idx !== undefined) {
      //TODO(Igor) not used currently, fix
      this.manyArray.currentState.removeAt(idx);
    } else {
      this.manyArray.internalRemoveRecords([record]);
    }
  };

  ManyRelationship.prototype.notifyRecordRelationshipAdded = function (record, idx) {
    (0, _emberDataPrivateUtils.assertPolymorphicType)(this.record, this.relationshipMeta, record);

    this.record.notifyHasManyAdded(this.key, record, idx);
  };

  ManyRelationship.prototype.reload = function () {
    var self = this;
    if (this.link) {
      return this.fetchLink();
    } else {
      return this.store.scheduleFetchMany(this.manyArray.toArray()).then(function () {
        //Goes away after the manyArray refactor
        self.manyArray.set('isLoaded', true);
        return self.manyArray;
      });
    }
  };

  ManyRelationship.prototype.computeChanges = function (records) {
    var members = this.canonicalMembers;
    var recordsToRemove = [];
    var length;
    var record;
    var i;

    records = setForArray(records);

    members.forEach(function (member) {
      if (records.has(member)) {
        return;
      }

      recordsToRemove.push(member);
    });

    this.removeCanonicalRecords(recordsToRemove);

    // Using records.toArray() since currently using
    // removeRecord can modify length, messing stuff up
    // forEach since it directly looks at "length" each
    // iteration
    records = records.toArray();
    length = records.length;
    for (i = 0; i < length; i++) {
      record = records[i];
      this.removeCanonicalRecord(record);
      this.addCanonicalRecord(record, i);
    }
  };

  ManyRelationship.prototype.fetchLink = function () {
    var _this = this;

    return this.store.findHasMany(this.record, this.link, this.relationshipMeta).then(function (records) {
      if (records.hasOwnProperty('meta')) {
        _this.updateMeta(records.meta);
      }
      _this.store._backburner.join(function () {
        _this.updateRecordsFromAdapter(records);
      });
      return _this.manyArray;
    });
  };

  ManyRelationship.prototype.findRecords = function () {
    var _this2 = this;

    //TODO CLEANUP
    return this.store.findMany(this.manyArray.toArray().map(function (rec) {
      return rec._internalModel;
    })).then(function () {
      if (!_this2.manyArray.get('isDestroyed')) {
        //Goes away after the manyArray refactor
        _this2.manyArray.set('isLoaded', true);
      }
      return _this2.manyArray;
    });
  };
  ManyRelationship.prototype.notifyHasManyChanged = function () {
    this.record.notifyHasManyAdded(this.key);
  };

  ManyRelationship.prototype.getRecords = function () {
    var _this3 = this;

    //TODO(Igor) sync server here, once our syncing is not stupid
    if (this.isAsync) {
      var promise;
      if (this.link) {
        if (this.hasLoaded) {
          promise = this.findRecords();
        } else {
          promise = this.findLink().then(function () {
            return _this3.findRecords();
          });
        }
      } else {
        promise = this.findRecords();
      }
      return _emberDataPrivateSystemPromiseProxies.PromiseManyArray.create({
        content: this.manyArray,
        promise: promise
      });
    } else {
      (0, _emberDataPrivateDebug.assert)("You looked up the '" + this.key + "' relationship on a '" + this.record.type.modelName + "' with id " + this.record.id + " but some of the associated records were not loaded. Either make sure they are all loaded together with the parent record, or specify that the relationship is async (`DS.hasMany({ async: true })`)", this.manyArray.isEvery('isEmpty', false));

      //TODO(Igor) WTF DO I DO HERE?
      if (!this.manyArray.get('isDestroyed')) {
        this.manyArray.set('isLoaded', true);
      }
      return this.manyArray;
    }
  };

  function setForArray(array) {
    var set = new _emberDataPrivateSystemOrderedSet["default"]();

    if (array) {
      for (var i = 0, l = array.length; i < l; i++) {
        set.add(array[i]);
      }
    }

    return set;
  }
});
define("ember-data/-private/system/relationships/state/relationship", ["exports", "ember", "ember-data/-private/debug", "ember-data/-private/system/ordered-set"], function (exports, _ember, _emberDataPrivateDebug, _emberDataPrivateSystemOrderedSet) {
  "use strict";

  exports["default"] = Relationship;

  function Relationship(store, record, inverseKey, relationshipMeta) {
    var async = relationshipMeta.options.async;
    this.members = new _emberDataPrivateSystemOrderedSet["default"]();
    this.canonicalMembers = new _emberDataPrivateSystemOrderedSet["default"]();
    this.store = store;
    this.key = relationshipMeta.key;
    this.inverseKey = inverseKey;
    this.record = record;
    this.isAsync = typeof async === 'undefined' ? true : async;
    this.relationshipMeta = relationshipMeta;
    //This probably breaks for polymorphic relationship in complex scenarios, due to
    //multiple possible modelNames
    this.inverseKeyForImplicit = this.record.constructor.modelName + this.key;
    this.linkPromise = null;
    this.meta = null;
    this.hasData = false;
    this.hasLoaded = false;
  }

  Relationship.prototype = {
    constructor: Relationship,

    destroy: _ember["default"].K,

    updateMeta: function updateMeta(meta) {
      this.meta = meta;
    },

    clear: function clear() {
      var members = this.members.list;
      var member;

      while (members.length > 0) {
        member = members[0];
        this.removeRecord(member);
      }
    },

    removeRecords: function removeRecords(records) {
      var _this = this;

      records.forEach(function (record) {
        return _this.removeRecord(record);
      });
    },

    addRecords: function addRecords(records, idx) {
      var _this2 = this;

      records.forEach(function (record) {
        _this2.addRecord(record, idx);
        if (idx !== undefined) {
          idx++;
        }
      });
    },

    addCanonicalRecords: function addCanonicalRecords(records, idx) {
      for (var i = 0; i < records.length; i++) {
        if (idx !== undefined) {
          this.addCanonicalRecord(records[i], i + idx);
        } else {
          this.addCanonicalRecord(records[i]);
        }
      }
    },

    addCanonicalRecord: function addCanonicalRecord(record, idx) {
      if (!this.canonicalMembers.has(record)) {
        this.canonicalMembers.add(record);
        if (this.inverseKey) {
          record._relationships.get(this.inverseKey).addCanonicalRecord(this.record);
        } else {
          if (!record._implicitRelationships[this.inverseKeyForImplicit]) {
            record._implicitRelationships[this.inverseKeyForImplicit] = new Relationship(this.store, record, this.key, { options: {} });
          }
          record._implicitRelationships[this.inverseKeyForImplicit].addCanonicalRecord(this.record);
        }
      }
      this.flushCanonicalLater();
      this.setHasData(true);
    },

    removeCanonicalRecords: function removeCanonicalRecords(records, idx) {
      for (var i = 0; i < records.length; i++) {
        if (idx !== undefined) {
          this.removeCanonicalRecord(records[i], i + idx);
        } else {
          this.removeCanonicalRecord(records[i]);
        }
      }
    },

    removeCanonicalRecord: function removeCanonicalRecord(record, idx) {
      if (this.canonicalMembers.has(record)) {
        this.removeCanonicalRecordFromOwn(record);
        if (this.inverseKey) {
          this.removeCanonicalRecordFromInverse(record);
        } else {
          if (record._implicitRelationships[this.inverseKeyForImplicit]) {
            record._implicitRelationships[this.inverseKeyForImplicit].removeCanonicalRecord(this.record);
          }
        }
      }
      this.flushCanonicalLater();
    },

    addRecord: function addRecord(record, idx) {
      if (!this.members.has(record)) {
        this.members.addWithIndex(record, idx);
        this.notifyRecordRelationshipAdded(record, idx);
        if (this.inverseKey) {
          record._relationships.get(this.inverseKey).addRecord(this.record);
        } else {
          if (!record._implicitRelationships[this.inverseKeyForImplicit]) {
            record._implicitRelationships[this.inverseKeyForImplicit] = new Relationship(this.store, record, this.key, { options: {} });
          }
          record._implicitRelationships[this.inverseKeyForImplicit].addRecord(this.record);
        }
        this.record.updateRecordArraysLater();
      }
      this.setHasData(true);
    },

    removeRecord: function removeRecord(record) {
      if (this.members.has(record)) {
        this.removeRecordFromOwn(record);
        if (this.inverseKey) {
          this.removeRecordFromInverse(record);
        } else {
          if (record._implicitRelationships[this.inverseKeyForImplicit]) {
            record._implicitRelationships[this.inverseKeyForImplicit].removeRecord(this.record);
          }
        }
      }
    },

    removeRecordFromInverse: function removeRecordFromInverse(record) {
      var inverseRelationship = record._relationships.get(this.inverseKey);
      //Need to check for existence, as the record might unloading at the moment
      if (inverseRelationship) {
        inverseRelationship.removeRecordFromOwn(this.record);
      }
    },

    removeRecordFromOwn: function removeRecordFromOwn(record) {
      this.members["delete"](record);
      this.notifyRecordRelationshipRemoved(record);
      this.record.updateRecordArrays();
    },

    removeCanonicalRecordFromInverse: function removeCanonicalRecordFromInverse(record) {
      var inverseRelationship = record._relationships.get(this.inverseKey);
      //Need to check for existence, as the record might unloading at the moment
      if (inverseRelationship) {
        inverseRelationship.removeCanonicalRecordFromOwn(this.record);
      }
    },

    removeCanonicalRecordFromOwn: function removeCanonicalRecordFromOwn(record) {
      this.canonicalMembers["delete"](record);
      this.flushCanonicalLater();
    },

    flushCanonical: function flushCanonical() {
      this.willSync = false;
      //a hack for not removing new records
      //TODO remove once we have proper diffing
      var newRecords = [];
      for (var i = 0; i < this.members.list.length; i++) {
        if (this.members.list[i].isNew()) {
          newRecords.push(this.members.list[i]);
        }
      }
      //TODO(Igor) make this less abysmally slow
      this.members = this.canonicalMembers.copy();
      for (i = 0; i < newRecords.length; i++) {
        this.members.add(newRecords[i]);
      }
    },

    flushCanonicalLater: function flushCanonicalLater() {
      var _this3 = this;

      if (this.willSync) {
        return;
      }
      this.willSync = true;
      this.store._backburner.join(function () {
        return _this3.store._backburner.schedule('syncRelationships', _this3, _this3.flushCanonical);
      });
    },

    updateLink: function updateLink(link) {
      (0, _emberDataPrivateDebug.warn)("You have pushed a record of type '" + this.record.type.modelName + "' with '" + this.key + "' as a link, but the association is not an async relationship.", this.isAsync, {
        id: 'ds.store.push-link-for-sync-relationship'
      });
      (0, _emberDataPrivateDebug.assert)("You have pushed a record of type '" + this.record.type.modelName + "' with '" + this.key + "' as a link, but the value of that link is not a string.", typeof link === 'string' || link === null);
      if (link !== this.link) {
        this.link = link;
        this.linkPromise = null;
        this.setHasLoaded(false);
        this.record.notifyPropertyChange(this.key);
      }
    },

    findLink: function findLink() {
      if (this.linkPromise) {
        return this.linkPromise;
      } else {
        var promise = this.fetchLink();
        this.linkPromise = promise;
        return promise.then(function (result) {
          return result;
        });
      }
    },

    updateRecordsFromAdapter: function updateRecordsFromAdapter(records) {
      //TODO(Igor) move this to a proper place
      //TODO Once we have adapter support, we need to handle updated and canonical changes
      this.computeChanges(records);
      this.setHasData(true);
      this.setHasLoaded(true);
    },

    notifyRecordRelationshipAdded: _ember["default"].K,
    notifyRecordRelationshipRemoved: _ember["default"].K,

    /*
      `hasData` for a relationship is a flag to indicate if we consider the
      content of this relationship "known". Snapshots uses this to tell the
      difference between unknown (`undefined`) or empty (`null`). The reason for
      this is that we wouldn't want to serialize unknown relationships as `null`
      as that might overwrite remote state.
       All relationships for a newly created (`store.createRecord()`) are
      considered known (`hasData === true`).
     */
    setHasData: function setHasData(value) {
      this.hasData = value;
    },

    /*
      `hasLoaded` is a flag to indicate if we have gotten data from the adapter or
      not when the relationship has a link.
       This is used to be able to tell when to fetch the link and when to return
      the local data in scenarios where the local state is considered known
      (`hasData === true`).
       Updating the link will automatically set `hasLoaded` to `false`.
     */
    setHasLoaded: function setHasLoaded(value) {
      this.hasLoaded = value;
    }
  };
});
define("ember-data/-private/system/serializer", ["exports"], function (exports) {
  /**
    @module ember-data
  */

  /**
    `DS.Serializer` is an abstract base class that you should override in your
    application to customize it for your backend. The minimum set of methods
    that you should implement is:
  
      * `normalizeResponse()`
      * `serialize()`
  
    And you can optionally override the following methods:
  
      * `normalize()`
  
    For an example implementation, see
    [DS.JSONSerializer](DS.JSONSerializer.html), the included JSON serializer.
  
    @class Serializer
    @namespace DS
    @extends Ember.Object
  */

  "use strict";

  exports["default"] = Ember.Object.extend({

    /**
      The `store` property is the application's `store` that contains all records.
      It's injected as a service.
      It can be used to push records from a non flat data structure server
      response.
       @property store
      @type {DS.Store}
      @public
    */

    /**
      The `normalizeResponse` method is used to normalize a payload from the
      server to a JSON-API Document.
       http://jsonapi.org/format/#document-structure
       @method normalizeResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @return {Object} JSON-API Document
    */
    normalizeResponse: null,

    /**
      The `serialize` method is used when a record is saved in order to convert
      the record into the form that your external data source expects.
       `serialize` takes an optional `options` hash with a single option:
       - `includeId`: If this is `true`, `serialize` should include the ID
        in the serialized object it builds.
       @method serialize
      @param {DS.Model} record
      @param {Object} [options]
      @return {Object}
    */
    serialize: null,

    /**
      The `normalize` method is used to convert a payload received from your
      external data source into the normalized form `store.push()` expects. You
      should override this method, munge the hash and return the normalized
      payload.
       @method normalize
      @param {DS.Model} typeClass
      @param {Object} hash
      @return {Object}
    */
    normalize: function normalize(typeClass, hash) {
      return hash;
    }

  });
});
define('ember-data/-private/system/snapshot-record-array', ['exports'], function (exports) {
  'use strict';

  exports['default'] = SnapshotRecordArray;

  /**
    @module ember-data
  */

  /**
    @class SnapshotRecordArray
    @namespace DS
    @private
    @constructor
    @param {Array} snapshots An array of snapshots
    @param {Object} meta
  */
  function SnapshotRecordArray(recordArray, meta, adapterOptions) {
    /**
      An array of snapshots
      @private
      @property _snapshots
      @type {Array}
    */
    this._snapshots = null;
    /**
      An array of records
      @private
      @property _recordArray
      @type {Array}
    */
    this._recordArray = recordArray;
    /**
      Number of records in the array
      @property length
      @type {Number}
    */
    this.length = recordArray.get('length');
    /**
      The type of the underlying records for the snapshots in the array, as a DS.Model
      @property type
      @type {DS.Model}
    */
    this.type = recordArray.get('type');
    /**
      Meta object
      @property meta
      @type {Object}
    */
    this.meta = meta;
    /**
      A hash of adapter options
      @property adapterOptions
      @type {Object}
    */
    this.adapterOptions = adapterOptions;
  }

  /**
    Get snapshots of the underlying record array
    @method snapshots
    @return {Array} Array of snapshots
  */
  SnapshotRecordArray.prototype.snapshots = function () {
    if (this._snapshots) {
      return this._snapshots;
    }
    var recordArray = this._recordArray;
    this._snapshots = recordArray.invoke('createSnapshot');

    return this._snapshots;
  };
});
define("ember-data/-private/system/snapshot", ["exports", "ember", "ember-data/-private/system/empty-object"], function (exports, _ember, _emberDataPrivateSystemEmptyObject) {
  "use strict";

  exports["default"] = Snapshot;

  /**
    @module ember-data
  */

  var get = _ember["default"].get;

  /**
    @class Snapshot
    @namespace DS
    @private
    @constructor
    @param {DS.Model} internalModel The model to create a snapshot from
  */
  function Snapshot(internalModel) {
    var _this = this;

    this._attributes = new _emberDataPrivateSystemEmptyObject["default"]();
    this._belongsToRelationships = new _emberDataPrivateSystemEmptyObject["default"]();
    this._belongsToIds = new _emberDataPrivateSystemEmptyObject["default"]();
    this._hasManyRelationships = new _emberDataPrivateSystemEmptyObject["default"]();
    this._hasManyIds = new _emberDataPrivateSystemEmptyObject["default"]();

    var record = internalModel.getRecord();
    this.record = record;
    record.eachAttribute(function (keyName) {
      return _this._attributes[keyName] = get(record, keyName);
    });

    this.id = internalModel.id;
    this._internalModel = internalModel;
    this.type = internalModel.type;
    this.modelName = internalModel.type.modelName;

    this._changedAttributes = record.changedAttributes();
  }

  Snapshot.prototype = {
    constructor: Snapshot,

    /**
      The id of the snapshot's underlying record
       Example
       ```javascript
      // store.push('post', { id: 1, author: 'Tomster', title: 'Ember.js rocks' });
      postSnapshot.id; // => '1'
      ```
       @property id
      @type {String}
    */
    id: null,

    /**
      The underlying record for this snapshot. Can be used to access methods and
      properties defined on the record.
       Example
       ```javascript
      var json = snapshot.record.toJSON();
      ```
       @property record
      @type {DS.Model}
    */
    record: null,

    /**
      The type of the underlying record for this snapshot, as a DS.Model.
       @property type
      @type {DS.Model}
    */
    type: null,

    /**
      The name of the type of the underlying record for this snapshot, as a string.
       @property modelName
      @type {String}
    */
    modelName: null,

    /**
      Returns the value of an attribute.
       Example
       ```javascript
      // store.push('post', { id: 1, author: 'Tomster', title: 'Ember.js rocks' });
      postSnapshot.attr('author'); // => 'Tomster'
      postSnapshot.attr('title'); // => 'Ember.js rocks'
      ```
       Note: Values are loaded eagerly and cached when the snapshot is created.
       @method attr
      @param {String} keyName
      @return {Object} The attribute value or undefined
    */
    attr: function attr(keyName) {
      if (keyName in this._attributes) {
        return this._attributes[keyName];
      }
      throw new _ember["default"].Error("Model '" + _ember["default"].inspect(this.record) + "' has no attribute named '" + keyName + "' defined.");
    },

    /**
      Returns all attributes and their corresponding values.
       Example
       ```javascript
      // store.push('post', { id: 1, author: 'Tomster', title: 'Ember.js rocks' });
      postSnapshot.attributes(); // => { author: 'Tomster', title: 'Ember.js rocks' }
      ```
       @method attributes
      @return {Object} All attributes of the current snapshot
    */
    attributes: function attributes() {
      return _ember["default"].copy(this._attributes);
    },

    /**
      Returns all changed attributes and their old and new values.
       Example
       ```javascript
      // store.push('post', { id: 1, author: 'Tomster', title: 'Ember.js rocks' });
      postModel.set('title', 'Ember.js rocks!');
      postSnapshot.changedAttributes(); // => { title: ['Ember.js rocks', 'Ember.js rocks!'] }
      ```
       @method changedAttributes
      @return {Object} All changed attributes of the current snapshot
    */
    changedAttributes: function changedAttributes() {
      var changedAttributes = new _emberDataPrivateSystemEmptyObject["default"]();
      var changedAttributeKeys = Object.keys(this._changedAttributes);

      for (var i = 0, _length = changedAttributeKeys.length; i < _length; i++) {
        var key = changedAttributeKeys[i];
        changedAttributes[key] = _ember["default"].copy(this._changedAttributes[key]);
      }

      return changedAttributes;
    },

    /**
      Returns the current value of a belongsTo relationship.
       `belongsTo` takes an optional hash of options as a second parameter,
      currently supported options are:
      - `id`: set to `true` if you only want the ID of the related record to be
        returned.
       Example
       ```javascript
      // store.push('post', { id: 1, title: 'Hello World' });
      // store.createRecord('comment', { body: 'Lorem ipsum', post: post });
      commentSnapshot.belongsTo('post'); // => DS.Snapshot
      commentSnapshot.belongsTo('post', { id: true }); // => '1'
       // store.push('comment', { id: 1, body: 'Lorem ipsum' });
      commentSnapshot.belongsTo('post'); // => undefined
      ```
       Calling `belongsTo` will return a new Snapshot as long as there's any known
      data for the relationship available, such as an ID. If the relationship is
      known but unset, `belongsTo` will return `null`. If the contents of the
      relationship is unknown `belongsTo` will return `undefined`.
       Note: Relationships are loaded lazily and cached upon first access.
       @method belongsTo
      @param {String} keyName
      @param {Object} [options]
      @return {(DS.Snapshot|String|null|undefined)} A snapshot or ID of a known
        relationship or null if the relationship is known but unset. undefined
        will be returned if the contents of the relationship is unknown.
    */
    belongsTo: function belongsTo(keyName, options) {
      var id = options && options.id;
      var relationship, inverseRecord, hasData;
      var result;

      if (id && keyName in this._belongsToIds) {
        return this._belongsToIds[keyName];
      }

      if (!id && keyName in this._belongsToRelationships) {
        return this._belongsToRelationships[keyName];
      }

      relationship = this._internalModel._relationships.get(keyName);
      if (!(relationship && relationship.relationshipMeta.kind === 'belongsTo')) {
        throw new _ember["default"].Error("Model '" + _ember["default"].inspect(this.record) + "' has no belongsTo relationship named '" + keyName + "' defined.");
      }

      hasData = get(relationship, 'hasData');
      inverseRecord = get(relationship, 'inverseRecord');

      if (hasData) {
        if (inverseRecord && !inverseRecord.isDeleted()) {
          if (id) {
            result = get(inverseRecord, 'id');
          } else {
            result = inverseRecord.createSnapshot();
          }
        } else {
          result = null;
        }
      }

      if (id) {
        this._belongsToIds[keyName] = result;
      } else {
        this._belongsToRelationships[keyName] = result;
      }

      return result;
    },

    /**
      Returns the current value of a hasMany relationship.
       `hasMany` takes an optional hash of options as a second parameter,
      currently supported options are:
      - `ids`: set to `true` if you only want the IDs of the related records to be
        returned.
       Example
       ```javascript
      // store.push('post', { id: 1, title: 'Hello World', comments: [2, 3] });
      postSnapshot.hasMany('comments'); // => [DS.Snapshot, DS.Snapshot]
      postSnapshot.hasMany('comments', { ids: true }); // => ['2', '3']
       // store.push('post', { id: 1, title: 'Hello World' });
      postSnapshot.hasMany('comments'); // => undefined
      ```
       Note: Relationships are loaded lazily and cached upon first access.
       @method hasMany
      @param {String} keyName
      @param {Object} [options]
      @return {(Array|undefined)} An array of snapshots or IDs of a known
        relationship or an empty array if the relationship is known but unset.
        undefined will be returned if the contents of the relationship is unknown.
    */
    hasMany: function hasMany(keyName, options) {
      var ids = options && options.ids;
      var relationship, members, hasData;
      var results;

      if (ids && keyName in this._hasManyIds) {
        return this._hasManyIds[keyName];
      }

      if (!ids && keyName in this._hasManyRelationships) {
        return this._hasManyRelationships[keyName];
      }

      relationship = this._internalModel._relationships.get(keyName);
      if (!(relationship && relationship.relationshipMeta.kind === 'hasMany')) {
        throw new _ember["default"].Error("Model '" + _ember["default"].inspect(this.record) + "' has no hasMany relationship named '" + keyName + "' defined.");
      }

      hasData = get(relationship, 'hasData');
      members = get(relationship, 'members');

      if (hasData) {
        results = [];
        members.forEach(function (member) {
          if (!member.isDeleted()) {
            if (ids) {
              results.push(member.id);
            } else {
              results.push(member.createSnapshot());
            }
          }
        });
      }

      if (ids) {
        this._hasManyIds[keyName] = results;
      } else {
        this._hasManyRelationships[keyName] = results;
      }

      return results;
    },

    /**
      Iterates through all the attributes of the model, calling the passed
      function on each attribute.
       Example
       ```javascript
      snapshot.eachAttribute(function(name, meta) {
        // ...
      });
      ```
       @method eachAttribute
      @param {Function} callback the callback to execute
      @param {Object} [binding] the value to which the callback's `this` should be bound
    */
    eachAttribute: function eachAttribute(callback, binding) {
      this.record.eachAttribute(callback, binding);
    },

    /**
      Iterates through all the relationships of the model, calling the passed
      function on each relationship.
       Example
       ```javascript
      snapshot.eachRelationship(function(name, relationship) {
        // ...
      });
      ```
       @method eachRelationship
      @param {Function} callback the callback to execute
      @param {Object} [binding] the value to which the callback's `this` should be bound
    */
    eachRelationship: function eachRelationship(callback, binding) {
      this.record.eachRelationship(callback, binding);
    },

    /**
      @method serialize
      @param {Object} options
      @return {Object} an object whose values are primitive JSON values only
     */
    serialize: function serialize(options) {
      return this.record.store.serializerFor(this.modelName).serialize(this, options);
    }
  };
});
define("ember-data/-private/system/store/common", ["exports"], function (exports) {
  "use strict";

  exports._bind = _bind;
  exports._guard = _guard;
  exports._objectIsAlive = _objectIsAlive;

  var get = Ember.get;

  function _bind(fn) {
    var args = Array.prototype.slice.call(arguments, 1);

    return function () {
      return fn.apply(undefined, args);
    };
  }

  function _guard(promise, test) {
    var guarded = promise['finally'](function () {
      if (!test()) {
        guarded._subscribers.length = 0;
      }
    });

    return guarded;
  }

  function _objectIsAlive(object) {
    return !(get(object, "isDestroyed") || get(object, "isDestroying"));
  }
});
define('ember-data/-private/system/store/container-instance-cache', ['exports', 'ember', 'ember-data/-private/system/empty-object'], function (exports, _ember, _emberDataPrivateSystemEmptyObject) {
  'use strict';

  exports['default'] = ContainerInstanceCache;

  /**
   * The `ContainerInstanceCache` serves as a lazy cache for looking up
   * instances of serializers and adapters. It has some additional logic for
   * finding the 'fallback' adapter or serializer.
   *
   * The 'fallback' adapter or serializer is an adapter or serializer that is looked up
   * when the preferred lookup fails. For example, say you try to look up `adapter:post`,
   * but there is no entry (app/adapters/post.js in EmberCLI) for `adapter:post` in the registry.
   *
   * The `fallbacks` array passed will then be used; the first entry in the fallbacks array
   * that exists in the container will then be cached for `adapter:post`. So, the next time you
   * look up `adapter:post`, you'll get the `adapter:application` instance (or whatever the fallback
   * was if `adapter:application` doesn't exist).
   *
   * @private
   * @class ContainerInstanceCache
   *
  */
  function ContainerInstanceCache(owner) {
    this._owner = owner;
    this._cache = new _emberDataPrivateSystemEmptyObject['default']();
  }

  ContainerInstanceCache.prototype = new _emberDataPrivateSystemEmptyObject['default']();

  _ember['default'].merge(ContainerInstanceCache.prototype, {
    get: function get(type, preferredKey, fallbacks) {
      var cache = this._cache;
      var preferredLookupKey = type + ':' + preferredKey;

      if (!(preferredLookupKey in cache)) {
        var instance = this.instanceFor(preferredLookupKey) || this._findInstance(type, fallbacks);
        if (instance) {
          cache[preferredLookupKey] = instance;
        }
      }
      return cache[preferredLookupKey];
    },

    _findInstance: function _findInstance(type, fallbacks) {
      for (var i = 0, _length = fallbacks.length; i < _length; i++) {
        var fallback = fallbacks[i];
        var lookupKey = type + ':' + fallback;
        var instance = this.instanceFor(lookupKey);

        if (instance) {
          return instance;
        }
      }
    },

    instanceFor: function instanceFor(key) {
      var cache = this._cache;
      if (!cache[key]) {
        var instance = this._owner.lookup(key);
        if (instance) {
          cache[key] = instance;
        }
      }
      return cache[key];
    },

    destroy: function destroy() {
      var cache = this._cache;
      var cacheEntries = Object.keys(cache);

      for (var i = 0, _length2 = cacheEntries.length; i < _length2; i++) {
        var cacheKey = cacheEntries[i];
        var cacheEntry = cache[cacheKey];
        if (cacheEntry) {
          cacheEntry.destroy();
        }
      }
      this._owner = null;
    },

    constructor: ContainerInstanceCache,

    toString: function toString() {
      return 'ContainerInstanceCache';
    }
  });
});
define("ember-data/-private/system/store/finders", ["exports", "ember", "ember-data/-private/debug", "ember-data/-private/system/store/common", "ember-data/-private/system/store/serializer-response", "ember-data/-private/system/store/serializers"], function (exports, _ember, _emberDataPrivateDebug, _emberDataPrivateSystemStoreCommon, _emberDataPrivateSystemStoreSerializerResponse, _emberDataPrivateSystemStoreSerializers) {
  "use strict";

  exports._find = _find;
  exports._findMany = _findMany;
  exports._findHasMany = _findHasMany;
  exports._findBelongsTo = _findBelongsTo;
  exports._findAll = _findAll;
  exports._query = _query;
  exports._queryRecord = _queryRecord;

  var Promise = _ember["default"].RSVP.Promise;

  function _find(adapter, store, typeClass, id, internalModel, options) {
    var snapshot = internalModel.createSnapshot(options);
    var promise = adapter.findRecord(store, typeClass, id, snapshot);
    var serializer = (0, _emberDataPrivateSystemStoreSerializers.serializerForAdapter)(store, adapter, internalModel.type.modelName);
    var label = "DS: Handle Adapter#findRecord of " + typeClass + " with id: " + id;

    promise = Promise.resolve(promise, label);
    promise = (0, _emberDataPrivateSystemStoreCommon._guard)(promise, (0, _emberDataPrivateSystemStoreCommon._bind)(_emberDataPrivateSystemStoreCommon._objectIsAlive, store));

    return promise.then(function (adapterPayload) {
      (0, _emberDataPrivateDebug.assert)("You made a request for a " + typeClass.typeClassKey + " with id " + id + ", but the adapter's response did not have any data", adapterPayload);
      return store._adapterRun(function () {
        var payload = (0, _emberDataPrivateSystemStoreSerializerResponse.normalizeResponseHelper)(serializer, store, typeClass, adapterPayload, id, 'findRecord');
        //TODO Optimize
        var record = store.push(payload);
        return record._internalModel;
      });
    }, function (error) {
      internalModel.notFound();
      if (internalModel.isEmpty()) {
        internalModel.unloadRecord();
      }

      throw error;
    }, "DS: Extract payload of '" + typeClass + "'");
  }

  function _findMany(adapter, store, typeClass, ids, internalModels) {
    var snapshots = _ember["default"].A(internalModels).invoke('createSnapshot');
    var promise = adapter.findMany(store, typeClass, ids, snapshots);
    var serializer = (0, _emberDataPrivateSystemStoreSerializers.serializerForAdapter)(store, adapter, typeClass.modelName);
    var label = "DS: Handle Adapter#findMany of " + typeClass;

    if (promise === undefined) {
      throw new Error('adapter.findMany returned undefined, this was very likely a mistake');
    }

    promise = Promise.resolve(promise, label);
    promise = (0, _emberDataPrivateSystemStoreCommon._guard)(promise, (0, _emberDataPrivateSystemStoreCommon._bind)(_emberDataPrivateSystemStoreCommon._objectIsAlive, store));

    return promise.then(function (adapterPayload) {
      return store._adapterRun(function () {
        var payload = (0, _emberDataPrivateSystemStoreSerializerResponse.normalizeResponseHelper)(serializer, store, typeClass, adapterPayload, null, 'findMany');
        //TODO Optimize, no need to materialize here
        var records = store.push(payload);
        return records.map(function (record) {
          return record._internalModel;
        });
      });
    }, null, "DS: Extract payload of " + typeClass);
  }

  function _findHasMany(adapter, store, internalModel, link, relationship) {
    var snapshot = internalModel.createSnapshot();
    var typeClass = store.modelFor(relationship.type);
    var promise = adapter.findHasMany(store, snapshot, link, relationship);
    var serializer = (0, _emberDataPrivateSystemStoreSerializers.serializerForAdapter)(store, adapter, relationship.type);
    var label = "DS: Handle Adapter#findHasMany of " + internalModel + " : " + relationship.type;

    promise = Promise.resolve(promise, label);
    promise = (0, _emberDataPrivateSystemStoreCommon._guard)(promise, (0, _emberDataPrivateSystemStoreCommon._bind)(_emberDataPrivateSystemStoreCommon._objectIsAlive, store));
    promise = (0, _emberDataPrivateSystemStoreCommon._guard)(promise, (0, _emberDataPrivateSystemStoreCommon._bind)(_emberDataPrivateSystemStoreCommon._objectIsAlive, internalModel));

    return promise.then(function (adapterPayload) {
      return store._adapterRun(function () {
        var payload = (0, _emberDataPrivateSystemStoreSerializerResponse.normalizeResponseHelper)(serializer, store, typeClass, adapterPayload, null, 'findHasMany');
        //TODO Use a non record creating push
        var records = store.push(payload);
        var recordArray = records.map(function (record) {
          return record._internalModel;
        });
        recordArray.meta = payload.meta;
        return recordArray;
      });
    }, null, "DS: Extract payload of " + internalModel + " : hasMany " + relationship.type);
  }

  function _findBelongsTo(adapter, store, internalModel, link, relationship) {
    var snapshot = internalModel.createSnapshot();
    var typeClass = store.modelFor(relationship.type);
    var promise = adapter.findBelongsTo(store, snapshot, link, relationship);
    var serializer = (0, _emberDataPrivateSystemStoreSerializers.serializerForAdapter)(store, adapter, relationship.type);
    var label = "DS: Handle Adapter#findBelongsTo of " + internalModel + " : " + relationship.type;

    promise = Promise.resolve(promise, label);
    promise = (0, _emberDataPrivateSystemStoreCommon._guard)(promise, (0, _emberDataPrivateSystemStoreCommon._bind)(_emberDataPrivateSystemStoreCommon._objectIsAlive, store));
    promise = (0, _emberDataPrivateSystemStoreCommon._guard)(promise, (0, _emberDataPrivateSystemStoreCommon._bind)(_emberDataPrivateSystemStoreCommon._objectIsAlive, internalModel));

    return promise.then(function (adapterPayload) {
      return store._adapterRun(function () {
        var payload = (0, _emberDataPrivateSystemStoreSerializerResponse.normalizeResponseHelper)(serializer, store, typeClass, adapterPayload, null, 'findBelongsTo');

        if (!payload.data) {
          return null;
        }

        //TODO Optimize
        var record = store.push(payload);
        return record._internalModel;
      });
    }, null, "DS: Extract payload of " + internalModel + " : " + relationship.type);
  }

  function _findAll(adapter, store, typeClass, sinceToken, options) {
    var modelName = typeClass.modelName;
    var recordArray = store.peekAll(modelName);
    var snapshotArray = recordArray.createSnapshot(options);
    var promise = adapter.findAll(store, typeClass, sinceToken, snapshotArray);
    var serializer = (0, _emberDataPrivateSystemStoreSerializers.serializerForAdapter)(store, adapter, modelName);
    var label = "DS: Handle Adapter#findAll of " + typeClass;

    promise = Promise.resolve(promise, label);
    promise = (0, _emberDataPrivateSystemStoreCommon._guard)(promise, (0, _emberDataPrivateSystemStoreCommon._bind)(_emberDataPrivateSystemStoreCommon._objectIsAlive, store));

    return promise.then(function (adapterPayload) {
      store._adapterRun(function () {
        var payload = (0, _emberDataPrivateSystemStoreSerializerResponse.normalizeResponseHelper)(serializer, store, typeClass, adapterPayload, null, 'findAll');
        //TODO Optimize
        store.push(payload);
      });

      store.didUpdateAll(typeClass);
      return store.peekAll(modelName);
    }, null, "DS: Extract payload of findAll " + typeClass);
  }

  function _query(adapter, store, typeClass, query, recordArray) {
    var modelName = typeClass.modelName;
    var promise = adapter.query(store, typeClass, query, recordArray);

    var serializer = (0, _emberDataPrivateSystemStoreSerializers.serializerForAdapter)(store, adapter, modelName);
    var label = "DS: Handle Adapter#query of " + typeClass;

    promise = Promise.resolve(promise, label);
    promise = (0, _emberDataPrivateSystemStoreCommon._guard)(promise, (0, _emberDataPrivateSystemStoreCommon._bind)(_emberDataPrivateSystemStoreCommon._objectIsAlive, store));

    return promise.then(function (adapterPayload) {
      var records;
      store._adapterRun(function () {
        var payload = (0, _emberDataPrivateSystemStoreSerializerResponse.normalizeResponseHelper)(serializer, store, typeClass, adapterPayload, null, 'query');
        //TODO Optimize
        records = store.push(payload);
      });

      (0, _emberDataPrivateDebug.assert)('The response to store.query is expected to be an array but it was a single record. Please wrap your response in an array or use `store.queryRecord` to query for a single record.', _ember["default"].isArray(records));
      recordArray.loadRecords(records);
      return recordArray;
    }, null, "DS: Extract payload of query " + typeClass);
  }

  function _queryRecord(adapter, store, typeClass, query) {
    var modelName = typeClass.modelName;
    var promise = adapter.queryRecord(store, typeClass, query);
    var serializer = (0, _emberDataPrivateSystemStoreSerializers.serializerForAdapter)(store, adapter, modelName);
    var label = "DS: Handle Adapter#queryRecord of " + typeClass;

    promise = Promise.resolve(promise, label);
    promise = (0, _emberDataPrivateSystemStoreCommon._guard)(promise, (0, _emberDataPrivateSystemStoreCommon._bind)(_emberDataPrivateSystemStoreCommon._objectIsAlive, store));

    return promise.then(function (adapterPayload) {
      var record;
      store._adapterRun(function () {
        var payload = (0, _emberDataPrivateSystemStoreSerializerResponse.normalizeResponseHelper)(serializer, store, typeClass, adapterPayload, null, 'queryRecord');
        //TODO Optimize
        record = store.push(payload);
      });

      return record;
    }, null, "DS: Extract payload of queryRecord " + typeClass);
  }
});
define('ember-data/-private/system/store/serializer-response', ['exports', 'ember', 'ember-data/-private/debug'], function (exports, _ember, _emberDataPrivateDebug) {
  'use strict';

  exports.validateDocumentStructure = validateDocumentStructure;
  exports.normalizeResponseHelper = normalizeResponseHelper;

  /*
    This is a helper method that validates a JSON API top-level document
  
    The format of a document is described here:
    http://jsonapi.org/format/#document-top-level
  
    @method validateDocumentStructure
    @param {Object} doc JSON API document
    @return {array} An array of errors found in the document structure
  */

  function validateDocumentStructure(doc) {
    var errors = [];
    if (!doc || typeof doc !== 'object') {
      errors.push('Top level of a JSON API document must be an object');
    } else {
      if (!('data' in doc) && !('errors' in doc) && !('meta' in doc)) {
        errors.push('One or more of the following keys must be present: "data", "errors", "meta".');
      } else {
        if ('data' in doc && 'errors' in doc) {
          errors.push('Top level keys "errors" and "data" cannot both be present in a JSON API document');
        }
      }
      if ('data' in doc) {
        if (!(doc.data === null || _ember['default'].isArray(doc.data) || typeof doc.data === 'object')) {
          errors.push('data must be null, an object, or an array');
        }
      }
      if ('meta' in doc) {
        if (typeof doc.meta !== 'object') {
          errors.push('meta must be an object');
        }
      }
      if ('errors' in doc) {
        if (!_ember['default'].isArray(doc.errors)) {
          errors.push('errors must be an array');
        }
      }
      if ('links' in doc) {
        if (typeof doc.links !== 'object') {
          errors.push('links must be an object');
        }
      }
      if ('jsonapi' in doc) {
        if (typeof doc.jsonapi !== 'object') {
          errors.push('jsonapi must be an object');
        }
      }
      if ('included' in doc) {
        if (typeof doc.included !== 'object') {
          errors.push('included must be an array');
        }
      }
    }

    return errors;
  }

  /*
    This is a helper method that always returns a JSON-API Document.
  
    @method normalizeResponseHelper
    @param {DS.Serializer} serializer
    @param {DS.Store} store
    @param {subclass of DS.Model} modelClass
    @param {Object} payload
    @param {String|Number} id
    @param {String} requestType
    @return {Object} JSON-API Document
  */

  function normalizeResponseHelper(serializer, store, modelClass, payload, id, requestType) {
    var normalizedResponse = serializer.normalizeResponse(store, modelClass, payload, id, requestType);
    var validationErrors = [];
    (0, _emberDataPrivateDebug.runInDebug)(function () {
      validationErrors = validateDocumentStructure(normalizedResponse);
    });
    (0, _emberDataPrivateDebug.assert)('normalizeResponse must return a valid JSON API document:\n\t* ' + validationErrors.join('\n\t* '), _ember['default'].isEmpty(validationErrors));
    // TODO: Remove after metadata refactor
    if (normalizedResponse.meta) {
      store._setMetadataFor(modelClass.modelName, normalizedResponse.meta);
    }

    return normalizedResponse;
  }
});
define("ember-data/-private/system/store/serializers", ["exports"], function (exports) {
  "use strict";

  exports.serializerForAdapter = serializerForAdapter;

  function serializerForAdapter(store, adapter, type) {
    var serializer = adapter.serializer;

    if (serializer === undefined) {
      serializer = store.serializerFor(type);
    }

    if (serializer === null || serializer === undefined) {
      serializer = {
        extract: function extract(store, type, payload) {
          return payload;
        }
      };
    }

    return serializer;
  }
});
define("ember-data/-private/system/store", ["exports", "ember", "ember-data/-private/debug", "ember-data/-private/system/normalize-link", "ember-data/-private/system/normalize-model-name", "ember-data/-private/adapters/errors", "ember-data/-private/system/promise-proxies", "ember-data/-private/system/store/common", "ember-data/-private/system/store/serializer-response", "ember-data/-private/system/store/serializers", "ember-data/-private/system/store/finders", "ember-data/-private/utils", "ember-data/-private/system/coerce-id", "ember-data/-private/system/record-array-manager", "ember-data/-private/system/store/container-instance-cache", "ember-data/-private/system/model/internal-model", "ember-data/-private/system/empty-object"], function (exports, _ember, _emberDataPrivateDebug, _emberDataPrivateSystemNormalizeLink, _emberDataPrivateSystemNormalizeModelName, _emberDataPrivateAdaptersErrors, _emberDataPrivateSystemPromiseProxies, _emberDataPrivateSystemStoreCommon, _emberDataPrivateSystemStoreSerializerResponse, _emberDataPrivateSystemStoreSerializers, _emberDataPrivateSystemStoreFinders, _emberDataPrivateUtils, _emberDataPrivateSystemCoerceId, _emberDataPrivateSystemRecordArrayManager, _emberDataPrivateSystemStoreContainerInstanceCache, _emberDataPrivateSystemModelInternalModel, _emberDataPrivateSystemEmptyObject) {
  /**
    @module ember-data
  */

  "use strict";

  var badIdFormatAssertion = '`id` has to be non-empty string or number';

  exports.badIdFormatAssertion = badIdFormatAssertion;

  var Backburner = _ember["default"]._Backburner || _ember["default"].Backburner || _ember["default"].__loader.require('backburner')['default'] || _ember["default"].__loader.require('backburner')['Backburner'];
  var Map = _ember["default"].Map;
  var isArray = Array.isArray || _ember["default"].isArray;

  //Shim Backburner.join
  if (!Backburner.prototype.join) {
    var isString = function isString(suspect) {
      return typeof suspect === 'string';
    };

    Backburner.prototype.join = function () /*target, method, args */{
      var method, target;

      if (this.currentInstance) {
        var length = arguments.length;
        if (length === 1) {
          method = arguments[0];
          target = null;
        } else {
          target = arguments[0];
          method = arguments[1];
        }

        if (isString(method)) {
          method = target[method];
        }

        if (length === 1) {
          return method();
        } else if (length === 2) {
          return method.call(target);
        } else {
          var args = new Array(length - 2);
          for (var i = 0, l = length - 2; i < l; i++) {
            args[i] = arguments[i + 2];
          }
          return method.apply(target, args);
        }
      } else {
        return this.run.apply(this, arguments);
      }
    };
  }

  //Get the materialized model from the internalModel/promise that returns
  //an internal model and return it in a promiseObject. Useful for returning
  //from find methods
  function promiseRecord(internalModel, label) {
    var toReturn = internalModel.then(function (model) {
      return model.getRecord();
    });
    return (0, _emberDataPrivateSystemPromiseProxies.promiseObject)(toReturn, label);
  }

  var get = _ember["default"].get;
  var set = _ember["default"].set;
  var once = _ember["default"].run.once;
  var isNone = _ember["default"].isNone;
  var Promise = _ember["default"].RSVP.Promise;
  var copy = _ember["default"].copy;
  var Store;

  var Service = _ember["default"].Service;
  if (!Service) {
    Service = _ember["default"].Object;
  }

  // Implementors Note:
  //
  //   The variables in this file are consistently named according to the following
  //   scheme:
  //
  //   * +id+ means an identifier managed by an external source, provided inside
  //     the data provided by that source. These are always coerced to be strings
  //     before being used internally.
  //   * +clientId+ means a transient numerical identifier generated at runtime by
  //     the data store. It is important primarily because newly created objects may
  //     not yet have an externally generated id.
  //   * +internalModel+ means a record internalModel object, which holds metadata about a
  //     record, even if it has not yet been fully materialized.
  //   * +type+ means a DS.Model.

  /**
    The store contains all of the data for records loaded from the server.
    It is also responsible for creating instances of `DS.Model` that wrap
    the individual data for a record, so that they can be bound to in your
    Handlebars templates.
  
    Define your application's store like this:
  
    ```app/services/store.js
    import DS from 'ember-data';
  
    export default DS.Store.extend({
    });
    ```
  
    Most Ember.js applications will only have a single `DS.Store` that is
    automatically created by their `Ember.Application`.
  
    You can retrieve models from the store in several ways. To retrieve a record
    for a specific id, use `DS.Store`'s `findRecord()` method:
  
    ```javascript
    store.findRecord('person', 123).then(function (person) {
    });
    ```
  
    By default, the store will talk to your backend using a standard
    REST mechanism. You can customize how the store talks to your
    backend by specifying a custom adapter:
  
    ```app/adapters/application.js
    import DS from 'ember-data';
  
    export default DS.Adapter.extend({
    });
    ```
  
    You can learn more about writing a custom adapter by reading the `DS.Adapter`
    documentation.
  
    ### Store createRecord() vs. push() vs. pushPayload()
  
    The store provides multiple ways to create new record objects. They have
    some subtle differences in their use which are detailed below:
  
    [createRecord](#method_createRecord) is used for creating new
    records on the client side. This will return a new record in the
    `created.uncommitted` state. In order to persist this record to the
    backend you will need to call `record.save()`.
  
    [push](#method_push) is used to notify Ember Data's store of new or
    updated records that exist in the backend. This will return a record
    in the `loaded.saved` state. The primary use-case for `store#push` is
    to notify Ember Data about record updates (full or partial) that happen
    outside of the normal adapter methods (for example
    [SSE](http://dev.w3.org/html5/eventsource/) or [Web
    Sockets](http://www.w3.org/TR/2009/WD-websockets-20091222/)).
  
    [pushPayload](#method_pushPayload) is a convenience wrapper for
    `store#push` that will deserialize payloads if the
    Serializer implements a `pushPayload` method.
  
    Note: When creating a new record using any of the above methods
    Ember Data will update `DS.RecordArray`s such as those returned by
    `store#peekAll()`, `store#findAll()` or `store#filter()`. This means any
    data bindings or computed properties that depend on the RecordArray
    will automatically be synced to include the new or updated record
    values.
  
    @class Store
    @namespace DS
    @extends Ember.Service
  */
  exports.Store = Store = Service.extend({

    /**
      @method init
      @private
    */
    init: function init() {
      this._super.apply(this, arguments);
      this._backburner = new Backburner(['normalizeRelationships', 'syncRelationships', 'finished']);
      // internal bookkeeping; not observable
      this.typeMaps = {};
      this.recordArrayManager = _emberDataPrivateSystemRecordArrayManager["default"].create({
        store: this
      });
      this._pendingSave = [];
      this._instanceCache = new _emberDataPrivateSystemStoreContainerInstanceCache["default"]((0, _emberDataPrivateUtils.getOwner)(this));
      //Used to keep track of all the find requests that need to be coalesced
      this._pendingFetch = Map.create();
    },

    /**
      The adapter to use to communicate to a backend server or other persistence layer.
       This can be specified as an instance, class, or string.
       If you want to specify `app/adapters/custom.js` as a string, do:
       ```js
      adapter: 'custom'
      ```
       @property adapter
      @default DS.JSONAPIAdapter
      @type {(DS.Adapter|String)}
    */
    adapter: '-json-api',

    /**
      Returns a JSON representation of the record using a custom
      type-specific serializer, if one exists.
       The available options are:
       * `includeId`: `true` if the record's ID should be included in
        the JSON representation
       @method serialize
      @private
      @param {DS.Model} record the record to serialize
      @param {Object} options an options hash
    */
    serialize: function serialize(record, options) {
      var snapshot = record._internalModel.createSnapshot();
      return snapshot.serialize(options);
    },

    /**
      This property returns the adapter, after resolving a possible
      string key.
       If the supplied `adapter` was a class, or a String property
      path resolved to a class, this property will instantiate the
      class.
       This property is cacheable, so the same instance of a specified
      adapter class should be used for the lifetime of the store.
       @property defaultAdapter
      @private
      @return DS.Adapter
    */
    defaultAdapter: _ember["default"].computed('adapter', function () {
      var adapter = get(this, 'adapter');

      (0, _emberDataPrivateDebug.assert)('You tried to set `adapter` property to an instance of `DS.Adapter`, where it should be a name', typeof adapter === 'string');

      adapter = this.retrieveManagedInstance('adapter', adapter);

      return adapter;
    }),

    // .....................
    // . CREATE NEW RECORD .
    // .....................

    /**
      Create a new record in the current store. The properties passed
      to this method are set on the newly created record.
       To create a new instance of a `Post`:
       ```js
      store.createRecord('post', {
        title: "Rails is omakase"
      });
      ```
       To create a new instance of a `Post` that has a relationship with a `User` record:
       ```js
      var user = this.store.peekRecord('user', 1);
      store.createRecord('post', {
        title: "Rails is omakase",
        user: user
      });
      ```
       @method createRecord
      @param {String} modelName
      @param {Object} inputProperties a hash of properties to set on the
        newly created record.
      @return {DS.Model} record
    */
    createRecord: function createRecord(modelName, inputProperties) {
      (0, _emberDataPrivateDebug.assert)("Passing classes to store methods has been removed. Please pass a dasherized string instead of " + _ember["default"].inspect(modelName), typeof modelName === 'string');
      var typeClass = this.modelFor(modelName);
      var properties = copy(inputProperties) || new _emberDataPrivateSystemEmptyObject["default"]();

      // If the passed properties do not include a primary key,
      // give the adapter an opportunity to generate one. Typically,
      // client-side ID generators will use something like uuid.js
      // to avoid conflicts.

      if (isNone(properties.id)) {
        properties.id = this._generateId(modelName, properties);
      }

      // Coerce ID to a string
      properties.id = (0, _emberDataPrivateSystemCoerceId["default"])(properties.id);

      var internalModel = this.buildInternalModel(typeClass, properties.id);
      var record = internalModel.getRecord();

      // Move the record out of its initial `empty` state into
      // the `loaded` state.
      internalModel.loadedData();

      // Set the properties specified on the record.
      record.setProperties(properties);

      internalModel.eachRelationship(function (key, descriptor) {
        internalModel._relationships.get(key).setHasData(true);
      });

      return record;
    },

    /**
      If possible, this method asks the adapter to generate an ID for
      a newly created record.
       @method _generateId
      @private
      @param {String} modelName
      @param {Object} properties from the new record
      @return {String} if the adapter can generate one, an ID
    */
    _generateId: function _generateId(modelName, properties) {
      var adapter = this.adapterFor(modelName);

      if (adapter && adapter.generateIdForRecord) {
        return adapter.generateIdForRecord(this, modelName, properties);
      }

      return null;
    },

    // .................
    // . DELETE RECORD .
    // .................

    /**
      For symmetry, a record can be deleted via the store.
       Example
       ```javascript
      var post = store.createRecord('post', {
        title: "Rails is omakase"
      });
       store.deleteRecord(post);
      ```
       @method deleteRecord
      @param {DS.Model} record
    */
    deleteRecord: function deleteRecord(record) {
      record.deleteRecord();
    },

    /**
      For symmetry, a record can be unloaded via the store. Only
      non-dirty records can be unloaded.
       Example
       ```javascript
      store.find('post', 1).then(function(post) {
        store.unloadRecord(post);
      });
      ```
       @method unloadRecord
      @param {DS.Model} record
    */
    unloadRecord: function unloadRecord(record) {
      record.unloadRecord();
    },

    // ................
    // . FIND RECORDS .
    // ................

    /**
      @method find
      @param {String} modelName
      @param {String|Integer} id
      @param {Object} options
      @return {Promise} promise
      @private
    */
    find: function find(modelName, id, options) {
      // The default `model` hook in Ember.Route calls `find(modelName, id)`,
      // that's why we have to keep this method around even though `findRecord` is
      // the public way to get a record by modelName and id.

      if (arguments.length === 1) {
        (0, _emberDataPrivateDebug.assert)('Using store.find(type) has been removed. Use store.findAll(type) to retrieve all records for a given type.');
      }

      if (_ember["default"].typeOf(id) === 'object') {
        (0, _emberDataPrivateDebug.assert)('Calling store.find() with a query object is no longer supported. Use store.query() instead.');
      }

      if (options) {
        (0, _emberDataPrivateDebug.assert)('Calling store.find(type, id, { preload: preload }) is no longer supported. Use store.findRecord(type, id, { preload: preload }) instead.');
      }

      (0, _emberDataPrivateDebug.assert)("You need to pass the model name and id to the store's find method", arguments.length === 2);
      (0, _emberDataPrivateDebug.assert)("You cannot pass `" + _ember["default"].inspect(id) + "` as id to the store's find method", _ember["default"].typeOf(id) === 'string' || _ember["default"].typeOf(id) === 'number');
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember["default"].inspect(modelName), typeof modelName === 'string');

      return this.findRecord(modelName, id);
    },

    /**
      This method returns a record for a given type and id combination.
       The `findRecord` method will always return a **promise** that will be
      resolved with the record. If the record was already in the store,
      the promise will be resolved immediately. Otherwise, the store
      will ask the adapter's `find` method to find the necessary data.
       The `findRecord` method will always resolve its promise with the same
      object for a given type and `id`.
       Example
       ```app/routes/post.js
      import Ember from 'ember';
       export default Ember.Route.extend({
        model: function(params) {
          return this.store.findRecord('post', params.post_id);
        }
      });
      ```
       If you would like to force the record to reload, instead of
      loading it from the cache when present you can set `reload: true`
      in the options object for `findRecord`.
       ```app/routes/post/edit.js
      import Ember from 'ember';
       export default Ember.Route.extend({
        model: function(params) {
          return this.store.findRecord('post', params.post_id, { reload: true });
        }
      });
      ```
       @method findRecord
      @param {String} modelName
      @param {(String|Integer)} id
      @param {Object} options
      @return {Promise} promise
    */
    findRecord: function findRecord(modelName, id, options) {
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember["default"].inspect(modelName), typeof modelName === 'string');
      (0, _emberDataPrivateDebug.assert)(badIdFormatAssertion, typeof id === 'string' && id.length > 0 || typeof id === 'number' && !isNaN(id));

      var internalModel = this._internalModelForId(modelName, id);
      options = options || {};

      if (!this.hasRecordForId(modelName, id)) {
        return this._findByInternalModel(internalModel, options);
      }

      var fetchedInternalModel = this._findRecord(internalModel, options);

      return promiseRecord(fetchedInternalModel, "DS: Store#findRecord " + internalModel.typeKey + " with id: " + get(internalModel, 'id'));
    },

    _findRecord: function _findRecord(internalModel, options) {
      // Refetch if the reload option is passed
      if (options.reload) {
        return this.scheduleFetch(internalModel, options);
      }

      // Refetch the record if the adapter thinks the record is stale
      var snapshot = internalModel.createSnapshot();
      snapshot.adapterOptions = options && options.adapterOptions;
      var typeClass = internalModel.type;
      var adapter = this.adapterFor(typeClass.modelName);
      if (adapter.shouldReloadRecord(this, snapshot)) {
        return this.scheduleFetch(internalModel, options);
      }

      // Trigger the background refetch if all the previous checks fail
      if (adapter.shouldBackgroundReloadRecord(this, snapshot)) {
        this.scheduleFetch(internalModel, options);
      }

      // Return the cached record
      return Promise.resolve(internalModel);
    },

    _findByInternalModel: function _findByInternalModel(internalModel, options) {
      options = options || {};

      if (options.preload) {
        internalModel._preloadData(options.preload);
      }

      var fetchedInternalModel = this._findEmptyInternalModel(internalModel, options);

      return promiseRecord(fetchedInternalModel, "DS: Store#findRecord " + internalModel.typeKey + " with id: " + get(internalModel, 'id'));
    },

    _findEmptyInternalModel: function _findEmptyInternalModel(internalModel, options) {
      if (internalModel.isEmpty()) {
        return this.scheduleFetch(internalModel, options);
      }

      //TODO double check about reloading
      if (internalModel.isLoading()) {
        return internalModel._loadingPromise;
      }

      return Promise.resolve(internalModel);
    },

    /**
      This method makes a series of requests to the adapter's `find` method
      and returns a promise that resolves once they are all loaded.
       @private
      @method findByIds
      @param {String} modelName
      @param {Array} ids
      @return {Promise} promise
    */
    findByIds: function findByIds(modelName, ids) {
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember["default"].inspect(modelName), typeof modelName === 'string');
      var store = this;

      return (0, _emberDataPrivateSystemPromiseProxies.promiseArray)(_ember["default"].RSVP.all(ids.map(function (id) {
        return store.findRecord(modelName, id);
      })).then(_ember["default"].A, null, "DS: Store#findByIds of " + modelName + " complete"));
    },

    /**
      This method is called by `findRecord` if it discovers that a particular
      type/id pair hasn't been loaded yet to kick off a request to the
      adapter.
       @method fetchRecord
      @private
      @param {InternalModel} internalModel model
      @return {Promise} promise
     */
    // TODO rename this to have an underscore
    fetchRecord: function fetchRecord(internalModel, options) {
      var typeClass = internalModel.type;
      var id = internalModel.id;
      var adapter = this.adapterFor(typeClass.modelName);

      (0, _emberDataPrivateDebug.assert)("You tried to find a record but you have no adapter (for " + typeClass + ")", adapter);
      (0, _emberDataPrivateDebug.assert)("You tried to find a record but your adapter (for " + typeClass + ") does not implement 'findRecord'", typeof adapter.findRecord === 'function' || typeof adapter.find === 'function');

      var promise = (0, _emberDataPrivateSystemStoreFinders._find)(adapter, this, typeClass, id, internalModel, options);
      return promise;
    },

    scheduleFetchMany: function scheduleFetchMany(records) {
      var internalModels = records.map(function (record) {
        return record._internalModel;
      });
      return Promise.all(internalModels.map(this.scheduleFetch, this));
    },

    scheduleFetch: function scheduleFetch(internalModel, options) {
      var typeClass = internalModel.type;

      if (internalModel._loadingPromise) {
        return internalModel._loadingPromise;
      }

      var resolver = _ember["default"].RSVP.defer('Fetching ' + typeClass + 'with id: ' + internalModel.id);
      var pendingFetchItem = {
        record: internalModel,
        resolver: resolver,
        options: options
      };
      var promise = resolver.promise;

      internalModel.loadingData(promise);

      if (!this._pendingFetch.get(typeClass)) {
        this._pendingFetch.set(typeClass, [pendingFetchItem]);
      } else {
        this._pendingFetch.get(typeClass).push(pendingFetchItem);
      }
      _ember["default"].run.scheduleOnce('afterRender', this, this.flushAllPendingFetches);

      return promise;
    },

    flushAllPendingFetches: function flushAllPendingFetches() {
      if (this.isDestroyed || this.isDestroying) {
        return;
      }

      this._pendingFetch.forEach(this._flushPendingFetchForType, this);
      this._pendingFetch = Map.create();
    },

    _flushPendingFetchForType: function _flushPendingFetchForType(pendingFetchItems, typeClass) {
      var store = this;
      var adapter = store.adapterFor(typeClass.modelName);
      var shouldCoalesce = !!adapter.findMany && adapter.coalesceFindRequests;
      var records = _ember["default"].A(pendingFetchItems).mapBy('record');

      function _fetchRecord(recordResolverPair) {
        recordResolverPair.resolver.resolve(store.fetchRecord(recordResolverPair.record, recordResolverPair.options)); // TODO adapter options
      }

      function resolveFoundRecords(records) {
        records.forEach(function (record) {
          var pair = _ember["default"].A(pendingFetchItems).findBy('record', record);
          if (pair) {
            var resolver = pair.resolver;
            resolver.resolve(record);
          }
        });
        return records;
      }

      function makeMissingRecordsRejector(requestedRecords) {
        return function rejectMissingRecords(resolvedRecords) {
          resolvedRecords = _ember["default"].A(resolvedRecords);
          var missingRecords = requestedRecords.reject(function (record) {
            return resolvedRecords.contains(record);
          });
          if (missingRecords.length) {
            (0, _emberDataPrivateDebug.warn)('Ember Data expected to find records with the following ids in the adapter response but they were missing: ' + _ember["default"].inspect(_ember["default"].A(missingRecords).mapBy('id')), false, {
              id: 'ds.store.missing-records-from-adapter'
            });
          }
          rejectRecords(missingRecords);
        };
      }

      function makeRecordsRejector(records) {
        return function (error) {
          rejectRecords(records, error);
        };
      }

      function rejectRecords(records, error) {
        records.forEach(function (record) {
          var pair = _ember["default"].A(pendingFetchItems).findBy('record', record);
          if (pair) {
            var resolver = pair.resolver;
            resolver.reject(error);
          }
        });
      }

      if (pendingFetchItems.length === 1) {
        _fetchRecord(pendingFetchItems[0]);
      } else if (shouldCoalesce) {

        // TODO: Improve records => snapshots => records => snapshots
        //
        // We want to provide records to all store methods and snapshots to all
        // adapter methods. To make sure we're doing that we're providing an array
        // of snapshots to adapter.groupRecordsForFindMany(), which in turn will
        // return grouped snapshots instead of grouped records.
        //
        // But since the _findMany() finder is a store method we need to get the
        // records from the grouped snapshots even though the _findMany() finder
        // will once again convert the records to snapshots for adapter.findMany()

        var snapshots = _ember["default"].A(records).invoke('createSnapshot');
        var groups = adapter.groupRecordsForFindMany(this, snapshots);
        groups.forEach(function (groupOfSnapshots) {
          var groupOfRecords = _ember["default"].A(groupOfSnapshots).mapBy('_internalModel');
          var requestedRecords = _ember["default"].A(groupOfRecords);
          var ids = requestedRecords.mapBy('id');
          if (ids.length > 1) {
            (0, _emberDataPrivateSystemStoreFinders._findMany)(adapter, store, typeClass, ids, requestedRecords).then(resolveFoundRecords).then(makeMissingRecordsRejector(requestedRecords)).then(null, makeRecordsRejector(requestedRecords));
          } else if (ids.length === 1) {
            var pair = _ember["default"].A(pendingFetchItems).findBy('record', groupOfRecords[0]);
            _fetchRecord(pair);
          } else {
            (0, _emberDataPrivateDebug.assert)("You cannot return an empty array from adapter's method groupRecordsForFindMany", false);
          }
        });
      } else {
        pendingFetchItems.forEach(_fetchRecord);
      }
    },

    /**
      Get a record by a given type and ID without triggering a fetch.
       This method will synchronously return the record if it is available in the store,
      otherwise it will return `null`. A record is available if it has been fetched earlier, or
      pushed manually into the store.
       _Note: This is an synchronous method and does not return a promise._
       ```js
      var post = store.peekRecord('post', 1);
       post.get('id'); // 1
      ```
       @method peekRecord
      @param {String} modelName
      @param {String|Integer} id
      @return {DS.Model|null} record
    */
    peekRecord: function peekRecord(modelName, id) {
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember["default"].inspect(modelName), typeof modelName === 'string');
      if (this.hasRecordForId(modelName, id)) {
        return this._internalModelForId(modelName, id).getRecord();
      } else {
        return null;
      }
    },

    /**
      This method is called by the record's `reload` method.
       This method calls the adapter's `find` method, which returns a promise. When
      **that** promise resolves, `reloadRecord` will resolve the promise returned
      by the record's `reload`.
       @method reloadRecord
      @private
      @param {DS.Model} internalModel
      @return {Promise} promise
    */
    reloadRecord: function reloadRecord(internalModel) {
      var modelName = internalModel.type.modelName;
      var adapter = this.adapterFor(modelName);
      var id = internalModel.id;

      (0, _emberDataPrivateDebug.assert)("You cannot reload a record without an ID", id);
      (0, _emberDataPrivateDebug.assert)("You tried to reload a record but you have no adapter (for " + modelName + ")", adapter);
      (0, _emberDataPrivateDebug.assert)("You tried to reload a record but your adapter does not implement `findRecord`", typeof adapter.findRecord === 'function' || typeof adapter.find === 'function');

      return this.scheduleFetch(internalModel);
    },

    /**
      Returns true if a record for a given type and ID is already loaded.
       @method hasRecordForId
      @param {(String|DS.Model)} modelName
      @param {(String|Integer)} inputId
      @return {Boolean}
    */
    hasRecordForId: function hasRecordForId(modelName, inputId) {
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember["default"].inspect(modelName), typeof modelName === 'string');
      var typeClass = this.modelFor(modelName);
      var id = (0, _emberDataPrivateSystemCoerceId["default"])(inputId);
      var internalModel = this.typeMapFor(typeClass).idToRecord[id];
      return !!internalModel && internalModel.isLoaded();
    },

    /**
      Returns id record for a given type and ID. If one isn't already loaded,
      it builds a new record and leaves it in the `empty` state.
       @method recordForId
      @private
      @param {String} modelName
      @param {(String|Integer)} id
      @return {DS.Model} record
    */
    recordForId: function recordForId(modelName, id) {
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember["default"].inspect(modelName), typeof modelName === 'string');
      return this._internalModelForId(modelName, id).getRecord();
    },

    _internalModelForId: function _internalModelForId(typeName, inputId) {
      var typeClass = this.modelFor(typeName);
      var id = (0, _emberDataPrivateSystemCoerceId["default"])(inputId);
      var idToRecord = this.typeMapFor(typeClass).idToRecord;
      var record = idToRecord[id];

      if (!record || !idToRecord[id]) {
        record = this.buildInternalModel(typeClass, id);
      }

      return record;
    },

    /**
      @method findMany
      @private
      @param {Array} internalModels
      @return {Promise} promise
    */
    findMany: function findMany(internalModels) {
      var _this = this;

      return Promise.all(internalModels.map(function (internalModel) {
        return _this._findByInternalModel(internalModel);
      }));
    },

    /**
      If a relationship was originally populated by the adapter as a link
      (as opposed to a list of IDs), this method is called when the
      relationship is fetched.
       The link (which is usually a URL) is passed through unchanged, so the
      adapter can make whatever request it wants.
       The usual use-case is for the server to register a URL as a link, and
      then use that URL in the future to make a request for the relationship.
       @method findHasMany
      @private
      @param {DS.Model} owner
      @param {any} link
      @param {(Relationship)} relationship
      @return {Promise} promise
    */
    findHasMany: function findHasMany(owner, link, relationship) {
      var adapter = this.adapterFor(owner.type.modelName);

      (0, _emberDataPrivateDebug.assert)("You tried to load a hasMany relationship but you have no adapter (for " + owner.type + ")", adapter);
      (0, _emberDataPrivateDebug.assert)("You tried to load a hasMany relationship from a specified `link` in the original payload but your adapter does not implement `findHasMany`", typeof adapter.findHasMany === 'function');

      return (0, _emberDataPrivateSystemStoreFinders._findHasMany)(adapter, this, owner, link, relationship);
    },

    /**
      @method findBelongsTo
      @private
      @param {DS.Model} owner
      @param {any} link
      @param {Relationship} relationship
      @return {Promise} promise
    */
    findBelongsTo: function findBelongsTo(owner, link, relationship) {
      var adapter = this.adapterFor(owner.type.modelName);

      (0, _emberDataPrivateDebug.assert)("You tried to load a belongsTo relationship but you have no adapter (for " + owner.type + ")", adapter);
      (0, _emberDataPrivateDebug.assert)("You tried to load a belongsTo relationship from a specified `link` in the original payload but your adapter does not implement `findBelongsTo`", typeof adapter.findBelongsTo === 'function');

      return (0, _emberDataPrivateSystemStoreFinders._findBelongsTo)(adapter, this, owner, link, relationship);
    },

    /**
      This method delegates a query to the adapter. This is the one place where
      adapter-level semantics are exposed to the application.
       Exposing queries this way seems preferable to creating an abstract query
      language for all server-side queries, and then require all adapters to
      implement them.
       ---
       If you do something like this:
       ```javascript
      store.query('person', { page: 1 });
      ```
       The call made to the server, using a Rails backend, will look something like this:
       ```
      Started GET "/api/v1/person?page=1"
      Processing by Api::V1::PersonsController#index as HTML
      Parameters: { "page"=>"1" }
      ```
       ---
       If you do something like this:
       ```javascript
      store.query('person', { ids: [1, 2, 3] });
      ```
       The call to the server, using a Rails backend, will look something like this:
       ```
      Started GET "/api/v1/person?ids%5B%5D=1&ids%5B%5D=2&ids%5B%5D=3"
      Processing by Api::V1::PersonsController#index as HTML
      Parameters: { "ids" => ["1", "2", "3"] }
      ```
       This method returns a promise, which is resolved with a `RecordArray`
      once the server returns.
       @method query
      @param {String} modelName
      @param {any} query an opaque query to be used by the adapter
      @return {Promise} promise
    */
    query: function query(modelName, _query2) {
      return this._query(modelName, _query2);
    },

    _query: function _query(modelName, query, array) {
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember["default"].inspect(modelName), typeof modelName === 'string');
      var typeClass = this.modelFor(modelName);
      array = array || this.recordArrayManager.createAdapterPopulatedRecordArray(typeClass, query);

      var adapter = this.adapterFor(modelName);

      (0, _emberDataPrivateDebug.assert)("You tried to load a query but you have no adapter (for " + typeClass + ")", adapter);
      (0, _emberDataPrivateDebug.assert)("You tried to load a query but your adapter does not implement `query`", typeof adapter.query === 'function');

      return (0, _emberDataPrivateSystemPromiseProxies.promiseArray)((0, _emberDataPrivateSystemStoreFinders._query)(adapter, this, typeClass, query, array));
    },

    /**
      This method delegates a query to the adapter. This is the one place where
      adapter-level semantics are exposed to the application.
       Exposing queries this way seems preferable to creating an abstract query
      language for all server-side queries, and then require all adapters to
      implement them.
       This method returns a promise, which is resolved with a `RecordObject`
      once the server returns.
       @method queryRecord
      @param {String or subclass of DS.Model} type
      @param {any} query an opaque query to be used by the adapter
      @return {Promise} promise
    */
    queryRecord: function queryRecord(modelName, query) {
      (0, _emberDataPrivateDebug.assert)("You need to pass a type to the store's queryRecord method", modelName);
      (0, _emberDataPrivateDebug.assert)("You need to pass a query hash to the store's queryRecord method", query);
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember["default"].inspect(modelName), typeof modelName === 'string');

      var typeClass = this.modelFor(modelName);
      var adapter = this.adapterFor(modelName);

      (0, _emberDataPrivateDebug.assert)("You tried to make a query but you have no adapter (for " + typeClass + ")", adapter);
      (0, _emberDataPrivateDebug.assert)("You tried to make a query but your adapter does not implement `queryRecord`", typeof adapter.queryRecord === 'function');

      return (0, _emberDataPrivateSystemPromiseProxies.promiseObject)((0, _emberDataPrivateSystemStoreFinders._queryRecord)(adapter, this, typeClass, query));
    },

    /**
      `findAll` ask the adapter's `findAll` method to find the records
      for the given type, and return a promise that will be resolved
      once the server returns the values. The promise will resolve into
      all records of this type present in the store, even if the server
      only returns a subset of them.
       ```app/routes/authors.js
      import Ember from 'ember';
       export default Ember.Route.extend({
        model: function(params) {
          return this.store.findAll('author');
        }
      });
      ```
       @method findAll
      @param {String} modelName
      @param {Object} options
      @return {DS.AdapterPopulatedRecordArray}
    */
    findAll: function findAll(modelName, options) {
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember["default"].inspect(modelName), typeof modelName === 'string');
      var typeClass = this.modelFor(modelName);

      return this._fetchAll(typeClass, this.peekAll(modelName), options);
    },

    /**
      @method _fetchAll
      @private
      @param {DS.Model} typeClass
      @param {DS.RecordArray} array
      @return {Promise} promise
    */
    _fetchAll: function _fetchAll(typeClass, array, options) {
      options = options || {};
      var adapter = this.adapterFor(typeClass.modelName);
      var sinceToken = this.typeMapFor(typeClass).metadata.since;

      set(array, 'isUpdating', true);

      (0, _emberDataPrivateDebug.assert)("You tried to load all records but you have no adapter (for " + typeClass + ")", adapter);
      (0, _emberDataPrivateDebug.assert)("You tried to load all records but your adapter does not implement `findAll`", typeof adapter.findAll === 'function');
      if (options.reload) {
        return (0, _emberDataPrivateSystemPromiseProxies.promiseArray)((0, _emberDataPrivateSystemStoreFinders._findAll)(adapter, this, typeClass, sinceToken, options));
      }
      var snapshotArray = array.createSnapshot(options);
      if (adapter.shouldReloadAll(this, snapshotArray)) {
        return (0, _emberDataPrivateSystemPromiseProxies.promiseArray)((0, _emberDataPrivateSystemStoreFinders._findAll)(adapter, this, typeClass, sinceToken, options));
      }
      if (adapter.shouldBackgroundReloadAll(this, snapshotArray)) {
        (0, _emberDataPrivateSystemStoreFinders._findAll)(adapter, this, typeClass, sinceToken, options);
      }
      return (0, _emberDataPrivateSystemPromiseProxies.promiseArray)(Promise.resolve(array));
    },

    /**
      @method didUpdateAll
      @param {DS.Model} typeClass
      @private
    */
    didUpdateAll: function didUpdateAll(typeClass) {
      var liveRecordArray = this.recordArrayManager.liveRecordArrayFor(typeClass);
      set(liveRecordArray, 'isUpdating', false);
    },

    /**
      This method returns a filtered array that contains all of the
      known records for a given type in the store.
       Note that because it's just a filter, the result will contain any
      locally created records of the type, however, it will not make a
      request to the backend to retrieve additional records. If you
      would like to request all the records from the backend please use
      [store.findAll](#method_findAll).
       Also note that multiple calls to `peekAll` for a given type will always
      return the same `RecordArray`.
       Example
       ```javascript
      var localPosts = store.peekAll('post');
      ```
       @method peekAll
      @param {String} modelName
      @return {DS.RecordArray}
    */
    peekAll: function peekAll(modelName) {
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember["default"].inspect(modelName), typeof modelName === 'string');
      var typeClass = this.modelFor(modelName);

      var liveRecordArray = this.recordArrayManager.liveRecordArrayFor(typeClass);
      this.recordArrayManager.populateLiveRecordArray(liveRecordArray, typeClass);

      return liveRecordArray;
    },

    /**
     This method unloads all records in the store.
      Optionally you can pass a type which unload all records for a given type.
      ```javascript
     store.unloadAll();
     store.unloadAll('post');
     ```
      @method unloadAll
     @param {String=} modelName
    */
    unloadAll: function unloadAll(modelName) {
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember["default"].inspect(modelName), !modelName || typeof modelName === 'string');
      if (arguments.length === 0) {
        var typeMaps = this.typeMaps;
        var keys = Object.keys(typeMaps);

        var types = keys.map(byType);

        types.forEach(this.unloadAll, this);
      } else {
        var typeClass = this.modelFor(modelName);
        var typeMap = this.typeMapFor(typeClass);
        var records = typeMap.records.slice();
        var record;

        for (var i = 0; i < records.length; i++) {
          record = records[i];
          record.unloadRecord();
          record.destroy(); // maybe within unloadRecord
        }

        typeMap.metadata = new _emberDataPrivateSystemEmptyObject["default"]();
      }

      function byType(entry) {
        return typeMaps[entry]['type'].modelName;
      }
    },

    /**
      Takes a type and filter function, and returns a live RecordArray that
      remains up to date as new records are loaded into the store or created
      locally.
       The filter function takes a materialized record, and returns true
      if the record should be included in the filter and false if it should
      not.
       Example
       ```javascript
      store.filter('post', function(post) {
        return post.get('unread');
      });
      ```
       The filter function is called once on all records for the type when
      it is created, and then once on each newly loaded or created record.
       If any of a record's properties change, or if it changes state, the
      filter function will be invoked again to determine whether it should
      still be in the array.
       Optionally you can pass a query, which is the equivalent of calling
      [find](#method_find) with that same query, to fetch additional records
      from the server. The results returned by the server could then appear
      in the filter if they match the filter function.
       The query itself is not used to filter records, it's only sent to your
      server for you to be able to do server-side filtering. The filter
      function will be applied on the returned results regardless.
       Example
       ```javascript
      store.filter('post', { unread: true }, function(post) {
        return post.get('unread');
      }).then(function(unreadPosts) {
        unreadPosts.get('length'); // 5
        var unreadPost = unreadPosts.objectAt(0);
        unreadPost.set('unread', false);
        unreadPosts.get('length'); // 4
      });
      ```
       @method filter
      @param {String} modelName
      @param {Object} query optional query
      @param {Function} filter
      @return {DS.PromiseArray}
    */
    filter: function filter(modelName, query, _filter) {
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember["default"].inspect(modelName), typeof modelName === 'string');

      if (!_ember["default"].ENV.ENABLE_DS_FILTER) {
        (0, _emberDataPrivateDebug.assert)('The filter API has been moved to a plugin. To enable store.filter using an environment flag, or to use an alternative, you can visit the ember-data-filter addon page. https://github.com/ember-data/ember-data-filter', false);
      }

      var promise;
      var length = arguments.length;
      var array;
      var hasQuery = length === 3;

      // allow an optional server query
      if (hasQuery) {
        promise = this.query(modelName, query);
      } else if (arguments.length === 2) {
        _filter = query;
      }

      modelName = this.modelFor(modelName);

      if (hasQuery) {
        array = this.recordArrayManager.createFilteredRecordArray(modelName, _filter, query);
      } else {
        array = this.recordArrayManager.createFilteredRecordArray(modelName, _filter);
      }

      promise = promise || Promise.resolve(array);

      return (0, _emberDataPrivateSystemPromiseProxies.promiseArray)(promise.then(function () {
        return array;
      }, null, 'DS: Store#filter of ' + modelName));
    },

    /**
      This method returns if a certain record is already loaded
      in the store. Use this function to know beforehand if a findRecord()
      will result in a request or that it will be a cache hit.
        Example
       ```javascript
      store.recordIsLoaded('post', 1); // false
      store.findRecord('post', 1).then(function() {
        store.recordIsLoaded('post', 1); // true
      });
      ```
       @method recordIsLoaded
      @param {String} modelName
      @param {string} id
      @return {boolean}
    */
    recordIsLoaded: function recordIsLoaded(modelName, id) {
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember["default"].inspect(modelName), typeof modelName === 'string');
      return this.hasRecordForId(modelName, id);
    },

    /**
      @method _metadataFor
      @param {String} modelName
      @return {object}
      @private
    */
    _metadataFor: function _metadataFor(modelName) {
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember["default"].inspect(modelName), typeof modelName === 'string');
      var typeClass = this.modelFor(modelName);
      return this.typeMapFor(typeClass).metadata;
    },

    /**
      @method _setMetadataFor
      @param {String} modelName
      @param {Object} metadata metadata to set
      @private
    */
    _setMetadataFor: function _setMetadataFor(modelName, metadata) {
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember["default"].inspect(modelName), typeof modelName === 'string');
      var typeClass = this.modelFor(modelName);
      _ember["default"].merge(this.typeMapFor(typeClass).metadata, metadata);
    },

    // ............
    // . UPDATING .
    // ............

    /**
      If the adapter updates attributes the record will notify
      the store to update its  membership in any filters.
      To avoid thrashing, this method is invoked only once per
      run loop per record.
       @method dataWasUpdated
      @private
      @param {Class} type
      @param {InternalModel} internalModel
    */
    dataWasUpdated: function dataWasUpdated(type, internalModel) {
      this.recordArrayManager.recordDidChange(internalModel);
    },

    // ..............
    // . PERSISTING .
    // ..............

    /**
      This method is called by `record.save`, and gets passed a
      resolver for the promise that `record.save` returns.
       It schedules saving to happen at the end of the run loop.
       @method scheduleSave
      @private
      @param {InternalModel} internalModel
      @param {Resolver} resolver
      @param {Object} options
    */
    scheduleSave: function scheduleSave(internalModel, resolver, options) {
      var snapshot = internalModel.createSnapshot(options);
      internalModel.flushChangedAttributes();
      internalModel.adapterWillCommit();
      this._pendingSave.push({
        snapshot: snapshot,
        resolver: resolver
      });
      once(this, 'flushPendingSave');
    },

    /**
      This method is called at the end of the run loop, and
      flushes any records passed into `scheduleSave`
       @method flushPendingSave
      @private
    */
    flushPendingSave: function flushPendingSave() {
      var _this2 = this;

      var pending = this._pendingSave.slice();
      this._pendingSave = [];

      pending.forEach(function (pendingItem) {
        var snapshot = pendingItem.snapshot;
        var resolver = pendingItem.resolver;
        var record = snapshot._internalModel;
        var adapter = _this2.adapterFor(record.type.modelName);
        var operation;

        if (get(record, 'currentState.stateName') === 'root.deleted.saved') {
          return resolver.resolve();
        } else if (record.isNew()) {
          operation = 'createRecord';
        } else if (record.isDeleted()) {
          operation = 'deleteRecord';
        } else {
          operation = 'updateRecord';
        }

        resolver.resolve(_commit(adapter, _this2, operation, snapshot));
      });
    },

    /**
      This method is called once the promise returned by an
      adapter's `createRecord`, `updateRecord` or `deleteRecord`
      is resolved.
       If the data provides a server-generated ID, it will
      update the record and the store's indexes.
       @method didSaveRecord
      @private
      @param {InternalModel} internalModel the in-flight internal model
      @param {Object} data optional data (see above)
    */
    didSaveRecord: function didSaveRecord(internalModel, dataArg) {
      var data;
      if (dataArg) {
        data = dataArg.data;
      }
      if (data) {
        // normalize relationship IDs into records
        this._backburner.schedule('normalizeRelationships', this, '_setupRelationships', internalModel, internalModel.type, data);
        this.updateId(internalModel, data);
      }

      //We first make sure the primary data has been updated
      //TODO try to move notification to the user to the end of the runloop
      internalModel.adapterDidCommit(data);
    },

    /**
      This method is called once the promise returned by an
      adapter's `createRecord`, `updateRecord` or `deleteRecord`
      is rejected with a `DS.InvalidError`.
       @method recordWasInvalid
      @private
      @param {InternalModel} internalModel
      @param {Object} errors
    */
    recordWasInvalid: function recordWasInvalid(internalModel, errors) {
      internalModel.adapterDidInvalidate(errors);
    },

    /**
      This method is called once the promise returned by an
      adapter's `createRecord`, `updateRecord` or `deleteRecord`
      is rejected (with anything other than a `DS.InvalidError`).
       @method recordWasError
      @private
      @param {InternalModel} internalModel
      @param {Error} error
    */
    recordWasError: function recordWasError(internalModel, error) {
      internalModel.adapterDidError(error);
    },

    /**
      When an adapter's `createRecord`, `updateRecord` or `deleteRecord`
      resolves with data, this method extracts the ID from the supplied
      data.
       @method updateId
      @private
      @param {InternalModel} internalModel
      @param {Object} data
    */
    updateId: function updateId(internalModel, data) {
      var oldId = internalModel.id;
      var id = (0, _emberDataPrivateSystemCoerceId["default"])(data.id);

      (0, _emberDataPrivateDebug.assert)("An adapter cannot assign a new id to a record that already has an id. " + internalModel + " had id: " + oldId + " and you tried to update it with " + id + ". This likely happened because your server returned data in response to a find or update that had a different id than the one you sent.", oldId === null || id === oldId);

      this.typeMapFor(internalModel.type).idToRecord[id] = internalModel;

      internalModel.setId(id);
    },

    /**
      Returns a map of IDs to client IDs for a given type.
       @method typeMapFor
      @private
      @param {DS.Model} typeClass
      @return {Object} typeMap
    */
    typeMapFor: function typeMapFor(typeClass) {
      var typeMaps = get(this, 'typeMaps');
      var guid = _ember["default"].guidFor(typeClass);
      var typeMap = typeMaps[guid];

      if (typeMap) {
        return typeMap;
      }

      typeMap = {
        idToRecord: new _emberDataPrivateSystemEmptyObject["default"](),
        records: [],
        metadata: new _emberDataPrivateSystemEmptyObject["default"](),
        type: typeClass
      };

      typeMaps[guid] = typeMap;

      return typeMap;
    },

    // ................
    // . LOADING DATA .
    // ................

    /**
      This internal method is used by `push`.
       @method _load
      @private
      @param {(String|DS.Model)} type
      @param {Object} data
    */
    _load: function _load(data) {
      var internalModel = this._internalModelForId(data.type, data.id);

      internalModel.setupData(data);

      this.recordArrayManager.recordDidChange(internalModel);

      return internalModel;
    },

    /*
      In case someone defined a relationship to a mixin, for example:
      ```
        var Comment = DS.Model.extend({
          owner: belongsTo('commentable'. { polymorphic: true})
        });
        var Commentable = Ember.Mixin.create({
          comments: hasMany('comment')
        });
      ```
      we want to look up a Commentable class which has all the necessary
      relationship metadata. Thus, we look up the mixin and create a mock
      DS.Model, so we can access the relationship CPs of the mixin (`comments`)
      in this case
    */

    _modelForMixin: function _modelForMixin(modelName) {
      var normalizedModelName = (0, _emberDataPrivateSystemNormalizeModelName["default"])(modelName);
      // container.registry = 2.1
      // container._registry = 1.11 - 2.0
      // container = < 1.11
      var owner = (0, _emberDataPrivateUtils.getOwner)(this);

      var mixin = owner._lookupFactory('mixin:' + normalizedModelName);
      if (mixin) {
        //Cache the class as a model
        owner.register('model:' + normalizedModelName, DS.Model.extend(mixin));
      }
      var factory = this.modelFactoryFor(normalizedModelName);
      if (factory) {
        factory.__isMixin = true;
        factory.__mixin = mixin;
      }

      return factory;
    },

    /**
      Returns a model class for a particular key. Used by
      methods that take a type key (like `find`, `createRecord`,
      etc.)
       @method modelFor
      @param {String} modelName
      @return {DS.Model}
    */
    modelFor: function modelFor(modelName) {
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember["default"].inspect(modelName), typeof modelName === 'string');

      var factory = this.modelFactoryFor(modelName);
      if (!factory) {
        //Support looking up mixins as base types for polymorphic relationships
        factory = this._modelForMixin(modelName);
      }
      if (!factory) {
        throw new _ember["default"].Error("No model was found for '" + modelName + "'");
      }
      factory.modelName = factory.modelName || (0, _emberDataPrivateSystemNormalizeModelName["default"])(modelName);

      return factory;
    },

    modelFactoryFor: function modelFactoryFor(modelName) {
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember["default"].inspect(modelName), typeof modelName === 'string');
      var normalizedKey = (0, _emberDataPrivateSystemNormalizeModelName["default"])(modelName);

      var owner = (0, _emberDataPrivateUtils.getOwner)(this);

      return owner._lookupFactory('model:' + normalizedKey);
    },

    /**
      Push some data for a given type into the store.
       This method expects normalized [JSON API](http://jsonapi.org/) document. This means you have to follow [JSON API specification](http://jsonapi.org/format/) with few minor adjustments:
      - record's `type` should always be in singular, dasherized form
      - members (properties) should be camelCased
       [Your primary data should be wrapped inside `data` property](http://jsonapi.org/format/#document-top-level):
       ```js
      store.push({
        data: {
          // primary data for single record of type `Person`
          id: '1',
          type: 'person',
          attributes: {
            firstName: 'Daniel',
            lastName: 'Kmak'
          }
        }
      });
      ```
       [Demo.](http://ember-twiddle.com/fb99f18cd3b4d3e2a4c7)
       `data` property can also hold an array (of records):
       ```js
      store.push({
        data: [
          // an array of records
          {
            id: '1',
            type: 'person',
            attributes: {
              firstName: 'Daniel',
              lastName: 'Kmak'
            }
          },
          {
            id: '2',
            type: 'person',
            attributes: {
              firstName: 'Tom',
              lastName: 'Dale'
            }
          }
        ]
      });
      ```
       [Demo.](http://ember-twiddle.com/69cdbeaa3702159dc355)
       There are some typical properties for `JSONAPI` payload:
      * `id` - mandatory, unique record's key
      * `type` - mandatory string which matches `model`'s dasherized name in singular form
      * `attributes` - object which holds data for record attributes - `DS.attr`'s declared in model
      * `relationships` - object which must contain any of the following properties under each relationships' respective key (example path is `relationships.achievements.data`):
        - [`links`](http://jsonapi.org/format/#document-links)
        - [`data`](http://jsonapi.org/format/#document-resource-object-linkage) - place for primary data
        - [`meta`](http://jsonapi.org/format/#document-meta) - object which contains meta-information about relationship
       For this model:
       ```app/models/person.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        firstName: DS.attr('string'),
        lastName: DS.attr('string'),
         children: DS.hasMany('person')
      });
      ```
       To represent the children as IDs:
       ```js
      {
        data: {
          id: '1',
          type: 'person',
          attributes: {
            firstName: 'Tom',
            lastName: 'Dale'
          },
          relationships: {
            children: {
              data: [
                {
                  id: '2',
                  type: 'person'
                },
                {
                  id: '3',
                  type: 'person'
                },
                {
                  id: '4',
                  type: 'person'
                }
              ]
            }
          }
        }
      }
      ```
       [Demo.](http://ember-twiddle.com/343e1735e034091f5bde)
       To represent the children relationship as a URL:
       ```js
      {
        data: {
          id: '1',
          type: 'person',
          attributes: {
            firstName: 'Tom',
            lastName: 'Dale'
          },
          relationships: {
            children: {
              links: {
                related: '/people/1/children'
              }
            }
          }
        }
      }
      ```
       If you're streaming data or implementing an adapter, make sure
      that you have converted the incoming data into this form. The
      store's [normalize](#method_normalize) method is a convenience
      helper for converting a json payload into the form Ember Data
      expects.
       ```js
      store.push(store.normalize('person', data));
      ```
       This method can be used both to push in brand new
      records, as well as to update existing records.
       @method push
      @param {Object} data
      @return {DS.Model|Array} the record(s) that was created or
        updated.
    */
    push: function push(data) {
      var included = data.included;
      var i, length;
      if (included) {
        for (i = 0, length = included.length; i < length; i++) {
          this._pushInternalModel(included[i]);
        }
      }

      if (isArray(data.data)) {
        length = data.data.length;
        var internalModels = new Array(length);
        for (i = 0; i < length; i++) {
          internalModels[i] = this._pushInternalModel(data.data[i]).getRecord();
        }
        return internalModels;
      }

      if (data.data === null) {
        return null;
      }

      (0, _emberDataPrivateDebug.assert)("Expected an object in the 'data' property in a call to 'push' for " + data.type + ", but was " + _ember["default"].typeOf(data.data), _ember["default"].typeOf(data.data) === 'object');

      var internalModel = this._pushInternalModel(data.data);

      return internalModel.getRecord();
    },

    _hasModelFor: function _hasModelFor(type) {
      return (0, _emberDataPrivateUtils.getOwner)(this)._lookupFactory("model:" + type);
    },

    _pushInternalModel: function _pushInternalModel(data) {
      var _this3 = this;

      var modelName = data.type;
      (0, _emberDataPrivateDebug.assert)("You must include an 'id' for " + modelName + " in an object passed to 'push'", data.id != null && data.id !== '');
      (0, _emberDataPrivateDebug.assert)("You tried to push data with a type '" + modelName + "' but no model could be found with that name.", this._hasModelFor(modelName));

      var type = this.modelFor(modelName);

      // If Ember.ENV.DS_WARN_ON_UNKNOWN_KEYS is set to true and the payload
      // contains unknown keys, log a warning.

      if (_ember["default"].ENV.DS_WARN_ON_UNKNOWN_KEYS) {
        (0, _emberDataPrivateDebug.warn)("The payload for '" + type.modelName + "' contains these unknown keys: " + _ember["default"].inspect(Object.keys(data).forEach(function (key) {
          return !(key === 'id' || key === 'links' || get(type, 'fields').has(key) || key.match(/Type$/));
        })) + ". Make sure they've been defined in your model.", Object.keys(data).filter(function (key) {
          return !(key === 'id' || key === 'links' || get(type, 'fields').has(key) || key.match(/Type$/));
        }).length === 0, { id: 'ds.store.unknown-keys-in-payload' });
      }

      // Actually load the record into the store.
      var internalModel = this._load(data);

      this._backburner.join(function () {
        _this3._backburner.schedule('normalizeRelationships', _this3, '_setupRelationships', internalModel, type, data);
      });

      return internalModel;
    },

    _setupRelationships: function _setupRelationships(record, type, data) {
      // If the payload contains relationships that are specified as
      // IDs, normalizeRelationships will convert them into DS.Model instances
      // (possibly unloaded) before we push the payload into the
      // store.

      data = normalizeRelationships(this, type, data);

      // Now that the pushed record as well as any related records
      // are in the store, create the data structures used to track
      // relationships.
      setupRelationships(this, record, data);
    },

    /**
      Push some raw data into the store.
       This method can be used both to push in brand new
      records, as well as to update existing records. You
      can push in more than one type of object at once.
      All objects should be in the format expected by the
      serializer.
       ```app/serializers/application.js
      import DS from 'ember-data';
       export default DS.ActiveModelSerializer;
      ```
       ```js
      var pushData = {
        posts: [
          { id: 1, post_title: "Great post", comment_ids: [2] }
        ],
        comments: [
          { id: 2, comment_body: "Insightful comment" }
        ]
      }
       store.pushPayload(pushData);
      ```
       By default, the data will be deserialized using a default
      serializer (the application serializer if it exists).
       Alternatively, `pushPayload` will accept a model type which
      will determine which serializer will process the payload.
       ```app/serializers/application.js
      import DS from 'ember-data';
       export default DS.ActiveModelSerializer;
      ```
       ```app/serializers/post.js
      import DS from 'ember-data';
       export default DS.JSONSerializer;
      ```
       ```js
      store.pushPayload('comment', pushData); // Will use the application serializer
      store.pushPayload('post', pushData); // Will use the post serializer
      ```
       @method pushPayload
      @param {String} modelName Optionally, a model type used to determine which serializer will be used
      @param {Object} inputPayload
    */
    pushPayload: function pushPayload(modelName, inputPayload) {
      var _this4 = this;

      var serializer;
      var payload;
      if (!inputPayload) {
        payload = modelName;
        serializer = defaultSerializer(this);
        (0, _emberDataPrivateDebug.assert)("You cannot use `store#pushPayload` without a modelName unless your default serializer defines `pushPayload`", typeof serializer.pushPayload === 'function');
      } else {
        payload = inputPayload;
        (0, _emberDataPrivateDebug.assert)("Passing classes to store methods has been removed. Please pass a dasherized string instead of " + _ember["default"].inspect(modelName), typeof modelName === 'string');
        serializer = this.serializerFor(modelName);
      }
      this._adapterRun(function () {
        return serializer.pushPayload(_this4, payload);
      });
    },

    /**
      `normalize` converts a json payload into the normalized form that
      [push](#method_push) expects.
       Example
       ```js
      socket.on('message', function(message) {
        var modelName = message.model;
        var data = message.data;
        store.push(modelName, store.normalize(modelName, data));
      });
      ```
       @method normalize
      @param {String} modelName The name of the model type for this payload
      @param {Object} payload
      @return {Object} The normalized payload
    */
    normalize: function normalize(modelName, payload) {
      (0, _emberDataPrivateDebug.assert)("Passing classes to store methods has been removed. Please pass a dasherized string instead of " + _ember["default"].inspect(modelName), typeof modelName === 'string');
      var serializer = this.serializerFor(modelName);
      var model = this.modelFor(modelName);
      return serializer.normalize(model, payload);
    },

    /**
      Build a brand new record for a given type, ID, and
      initial data.
       @method buildRecord
      @private
      @param {DS.Model} type
      @param {String} id
      @param {Object} data
      @return {InternalModel} internal model
    */
    buildInternalModel: function buildInternalModel(type, id, data) {
      var typeMap = this.typeMapFor(type);
      var idToRecord = typeMap.idToRecord;

      (0, _emberDataPrivateDebug.assert)("The id " + id + " has already been used with another record of type " + type.toString() + ".", !id || !idToRecord[id]);
      (0, _emberDataPrivateDebug.assert)("'" + _ember["default"].inspect(type) + "' does not appear to be an ember-data model", typeof type._create === 'function');

      // lookupFactory should really return an object that creates
      // instances with the injections applied
      var internalModel = new _emberDataPrivateSystemModelInternalModel["default"](type, id, this, null, data);

      // if we're creating an item, this process will be done
      // later, once the object has been persisted.
      if (id) {
        idToRecord[id] = internalModel;
      }

      typeMap.records.push(internalModel);

      return internalModel;
    },

    //Called by the state machine to notify the store that the record is ready to be interacted with
    recordWasLoaded: function recordWasLoaded(record) {
      this.recordArrayManager.recordWasLoaded(record);
    },

    // ...............
    // . DESTRUCTION .
    // ...............

    /**
      When a record is destroyed, this un-indexes it and
      removes it from any record arrays so it can be GCed.
       @method _dematerializeRecord
      @private
      @param {InternalModel} internalModel
    */
    _dematerializeRecord: function _dematerializeRecord(internalModel) {
      var type = internalModel.type;
      var typeMap = this.typeMapFor(type);
      var id = internalModel.id;

      internalModel.updateRecordArrays();

      if (id) {
        delete typeMap.idToRecord[id];
      }

      var loc = typeMap.records.indexOf(internalModel);
      typeMap.records.splice(loc, 1);
    },

    // ......................
    // . PER-TYPE ADAPTERS
    // ......................

    /**
      Returns an instance of the adapter for a given type. For
      example, `adapterFor('person')` will return an instance of
      `App.PersonAdapter`.
       If no `App.PersonAdapter` is found, this method will look
      for an `App.ApplicationAdapter` (the default adapter for
      your entire application).
       If no `App.ApplicationAdapter` is found, it will return
      the value of the `defaultAdapter`.
       @method adapterFor
      @private
      @param {String} modelName
      @return DS.Adapter
    */
    adapterFor: function adapterFor(modelName) {

      (0, _emberDataPrivateDebug.assert)("Passing classes to store.adapterFor has been removed. Please pass a dasherized string instead of " + _ember["default"].inspect(modelName), typeof modelName === 'string');

      return this.lookupAdapter(modelName);
    },

    _adapterRun: function _adapterRun(fn) {
      return this._backburner.run(fn);
    },

    // ..............................
    // . RECORD CHANGE NOTIFICATION .
    // ..............................

    /**
      Returns an instance of the serializer for a given type. For
      example, `serializerFor('person')` will return an instance of
      `App.PersonSerializer`.
       If no `App.PersonSerializer` is found, this method will look
      for an `App.ApplicationSerializer` (the default serializer for
      your entire application).
       if no `App.ApplicationSerializer` is found, it will attempt
      to get the `defaultSerializer` from the `PersonAdapter`
      (`adapterFor('person')`).
       If a serializer cannot be found on the adapter, it will fall back
      to an instance of `DS.JSONSerializer`.
       @method serializerFor
      @private
      @param {String} modelName the record to serialize
      @return {DS.Serializer}
    */
    serializerFor: function serializerFor(modelName) {

      (0, _emberDataPrivateDebug.assert)("Passing classes to store.serializerFor has been removed. Please pass a dasherized string instead of " + _ember["default"].inspect(modelName), typeof modelName === 'string');

      var fallbacks = ['application', this.adapterFor(modelName).get('defaultSerializer'), '-default'];

      var serializer = this.lookupSerializer(modelName, fallbacks);
      return serializer;
    },

    /**
      Retrieve a particular instance from the
      container cache. If not found, creates it and
      placing it in the cache.
       Enabled a store to manage local instances of
      adapters and serializers.
       @method retrieveManagedInstance
      @private
      @param {String} modelName the object modelName
      @param {String} name the object name
      @param {Array} fallbacks the fallback objects to lookup if the lookup for modelName or 'application' fails
      @return {Ember.Object}
    */
    retrieveManagedInstance: function retrieveManagedInstance(type, modelName, fallbacks) {
      var normalizedModelName = (0, _emberDataPrivateSystemNormalizeModelName["default"])(modelName);

      var instance = this._instanceCache.get(type, normalizedModelName, fallbacks);
      set(instance, 'store', this);
      return instance;
    },

    lookupAdapter: function lookupAdapter(name) {
      return this.retrieveManagedInstance('adapter', name, this.get('_adapterFallbacks'));
    },

    _adapterFallbacks: _ember["default"].computed('adapter', function () {
      var adapter = this.get('adapter');
      return ['application', adapter, '-json-api'];
    }),

    lookupSerializer: function lookupSerializer(name, fallbacks) {
      return this.retrieveManagedInstance('serializer', name, fallbacks);
    },

    willDestroy: function willDestroy() {
      this._super.apply(this, arguments);
      this.recordArrayManager.destroy();

      this.unloadAll();

      for (var cacheKey in this._containerCache) {
        this._containerCache[cacheKey].destroy();
        delete this._containerCache[cacheKey];
      }

      delete this._containerCache;
    }

  });

  function normalizeRelationships(store, type, data, record) {
    data.relationships = data.relationships || {};
    type.eachRelationship(function (key, relationship) {
      var kind = relationship.kind;
      var value;
      if (data.relationships[key] && data.relationships[key].data) {
        value = data.relationships[key].data;
        if (kind === 'belongsTo') {
          data.relationships[key].data = deserializeRecordId(store, key, relationship, value);
        } else if (kind === 'hasMany') {
          data.relationships[key].data = deserializeRecordIds(store, key, relationship, value);
        }
      }
    });

    return data;
  }

  function deserializeRecordId(store, key, relationship, id) {
    if (isNone(id)) {
      return;
    }

    (0, _emberDataPrivateDebug.assert)("A " + relationship.parentType + " record was pushed into the store with the value of " + key + " being " + _ember["default"].inspect(id) + ", but " + key + " is a belongsTo relationship so the value must not be an array. You should probably check your data payload or serializer.", !isArray(id));

    //TODO:Better asserts
    return store._internalModelForId(id.type, id.id);
  }

  function deserializeRecordIds(store, key, relationship, ids) {
    if (isNone(ids)) {
      return;
    }

    (0, _emberDataPrivateDebug.assert)("A " + relationship.parentType + " record was pushed into the store with the value of " + key + " being '" + _ember["default"].inspect(ids) + "', but " + key + " is a hasMany relationship so the value must be an array. You should probably check your data payload or serializer.", isArray(ids));
    return ids.map(function (id) {
      return deserializeRecordId(store, key, relationship, id);
    });
  }

  // Delegation to the adapter and promise management

  function defaultSerializer(store) {
    return store.serializerFor('application');
  }

  function _commit(adapter, store, operation, snapshot) {
    var internalModel = snapshot._internalModel;
    var modelName = snapshot.modelName;
    var typeClass = store.modelFor(modelName);
    var promise = adapter[operation](store, typeClass, snapshot);
    var serializer = (0, _emberDataPrivateSystemStoreSerializers.serializerForAdapter)(store, adapter, modelName);
    var label = "DS: Extract and notify about " + operation + " completion of " + internalModel;

    (0, _emberDataPrivateDebug.assert)("Your adapter's '" + operation + "' method must return a value, but it returned 'undefined'", promise !== undefined);

    promise = Promise.resolve(promise, label);
    promise = (0, _emberDataPrivateSystemStoreCommon._guard)(promise, (0, _emberDataPrivateSystemStoreCommon._bind)(_emberDataPrivateSystemStoreCommon._objectIsAlive, store));
    promise = (0, _emberDataPrivateSystemStoreCommon._guard)(promise, (0, _emberDataPrivateSystemStoreCommon._bind)(_emberDataPrivateSystemStoreCommon._objectIsAlive, internalModel));

    return promise.then(function (adapterPayload) {
      store._adapterRun(function () {
        var payload, data;
        if (adapterPayload) {
          payload = (0, _emberDataPrivateSystemStoreSerializerResponse.normalizeResponseHelper)(serializer, store, typeClass, adapterPayload, snapshot.id, operation);
          if (payload.included) {
            store.push({ data: payload.included });
          }
          data = payload.data;
        }
        store.didSaveRecord(internalModel, { data: data });
      });

      return internalModel;
    }, function (error) {
      if (error instanceof _emberDataPrivateAdaptersErrors.InvalidError) {
        var errors = serializer.extractErrors(store, typeClass, error, snapshot.id);
        store.recordWasInvalid(internalModel, errors);
      } else {
        store.recordWasError(internalModel, error);
      }

      throw error;
    }, label);
  }

  function setupRelationships(store, record, data) {
    var typeClass = record.type;
    if (!data.relationships) {
      return;
    }

    typeClass.eachRelationship(function (key, descriptor) {
      var kind = descriptor.kind;
      if (!data.relationships[key]) {
        return;
      }

      var relationship;

      if (data.relationships[key].links && data.relationships[key].links.related) {
        var relatedLink = (0, _emberDataPrivateSystemNormalizeLink["default"])(data.relationships[key].links.related);
        if (relatedLink && relatedLink.href) {
          relationship = record._relationships.get(key);
          relationship.updateLink(relatedLink.href);
        }
      }

      if (data.relationships[key].meta) {
        relationship = record._relationships.get(key);
        relationship.updateMeta(data.relationships[key].meta);
      }
      var value = data.relationships[key].data;

      if (value !== undefined) {
        if (kind === 'belongsTo') {
          relationship = record._relationships.get(key);
          relationship.setCanonicalRecord(value);
        } else if (kind === 'hasMany') {
          relationship = record._relationships.get(key);
          relationship.updateRecordsFromAdapter(value);
        }
      }
    });
  }

  exports.Store = Store;
  exports["default"] = Store;
});
define("ember-data/-private/transforms/boolean", ["exports", "ember-data/transform"], function (exports, _emberDataTransform) {
  "use strict";

  /**
    The `DS.BooleanTransform` class is used to serialize and deserialize
    boolean attributes on Ember Data record objects. This transform is
    used when `boolean` is passed as the type parameter to the
    [DS.attr](../../data#method_attr) function.
  
    Usage
  
    ```app/models/user.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      isAdmin: DS.attr('boolean'),
      name: DS.attr('string'),
      email: DS.attr('string')
    });
    ```
  
    @class BooleanTransform
    @extends DS.Transform
    @namespace DS
   */
  exports["default"] = _emberDataTransform["default"].extend({
    deserialize: function deserialize(serialized) {
      var type = typeof serialized;

      if (type === "boolean") {
        return serialized;
      } else if (type === "string") {
        return serialized.match(/^true$|^t$|^1$/i) !== null;
      } else if (type === "number") {
        return serialized === 1;
      } else {
        return false;
      }
    },

    serialize: function serialize(deserialized) {
      return Boolean(deserialized);
    }
  });
});
define("ember-data/-private/transforms/date", ["exports", "ember", "ember-data/-private/ext/date", "ember-data/transform"], function (exports, _ember, _emberDataPrivateExtDate, _emberDataTransform) {
  "use strict";

  exports["default"] = _emberDataTransform["default"].extend({
    deserialize: function deserialize(serialized) {
      var type = typeof serialized;

      if (type === "string") {
        return new Date(_ember["default"].Date.parse(serialized));
      } else if (type === "number") {
        return new Date(serialized);
      } else if (serialized === null || serialized === undefined) {
        // if the value is null return null
        // if the value is not present in the data return undefined
        return serialized;
      } else {
        return null;
      }
    },

    serialize: function serialize(date) {
      if (date instanceof Date) {
        return date.toISOString();
      } else {
        return null;
      }
    }
  });
});

/**
  The `DS.DateTransform` class is used to serialize and deserialize
  date attributes on Ember Data record objects. This transform is used
  when `date` is passed as the type parameter to the
  [DS.attr](../../data#method_attr) function.

  ```app/models/score.js
  import DS from 'ember-data';

  export default DS.Model.extend({
    value: DS.attr('number'),
    player: DS.belongsTo('player'),
    date: DS.attr('date')
  });
  ```

  @class DateTransform
  @extends DS.Transform
  @namespace DS
 */
define("ember-data/-private/transforms/number", ["exports", "ember", "ember-data/transform"], function (exports, _ember, _emberDataTransform) {
  "use strict";

  var empty = _ember["default"].isEmpty;

  function isNumber(value) {
    return value === value && value !== Infinity && value !== -Infinity;
  }

  /**
    The `DS.NumberTransform` class is used to serialize and deserialize
    numeric attributes on Ember Data record objects. This transform is
    used when `number` is passed as the type parameter to the
    [DS.attr](../../data#method_attr) function.
  
    Usage
  
    ```app/models/score.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      value: DS.attr('number'),
      player: DS.belongsTo('player'),
      date: DS.attr('date')
    });
    ```
  
    @class NumberTransform
    @extends DS.Transform
    @namespace DS
   */
  exports["default"] = _emberDataTransform["default"].extend({
    deserialize: function deserialize(serialized) {
      var transformed;

      if (empty(serialized)) {
        return null;
      } else {
        transformed = Number(serialized);

        return isNumber(transformed) ? transformed : null;
      }
    },

    serialize: function serialize(deserialized) {
      var transformed;

      if (empty(deserialized)) {
        return null;
      } else {
        transformed = Number(deserialized);

        return isNumber(transformed) ? transformed : null;
      }
    }
  });
});
define("ember-data/-private/transforms/string", ["exports", "ember", "ember-data/transform"], function (exports, _ember, _emberDataTransform) {
  "use strict";

  var none = _ember["default"].isNone;

  /**
    The `DS.StringTransform` class is used to serialize and deserialize
    string attributes on Ember Data record objects. This transform is
    used when `string` is passed as the type parameter to the
    [DS.attr](../../data#method_attr) function.
  
    Usage
  
    ```app/models/user.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      isAdmin: DS.attr('boolean'),
      name: DS.attr('string'),
      email: DS.attr('string')
    });
    ```
  
    @class StringTransform
    @extends DS.Transform
    @namespace DS
   */
  exports["default"] = _emberDataTransform["default"].extend({
    deserialize: function deserialize(serialized) {
      return none(serialized) ? null : String(serialized);
    },
    serialize: function serialize(deserialized) {
      return none(deserialized) ? null : String(deserialized);
    }
  });
});
define("ember-data/-private/transforms", ["exports", "ember-data/transform", "ember-data/-private/transforms/number", "ember-data/-private/transforms/date", "ember-data/-private/transforms/string", "ember-data/-private/transforms/boolean"], function (exports, _emberDataTransform, _emberDataPrivateTransformsNumber, _emberDataPrivateTransformsDate, _emberDataPrivateTransformsString, _emberDataPrivateTransformsBoolean) {
  "use strict";

  exports.Transform = _emberDataTransform["default"];
  exports.NumberTransform = _emberDataPrivateTransformsNumber["default"];
  exports.DateTransform = _emberDataPrivateTransformsDate["default"];
  exports.StringTransform = _emberDataPrivateTransformsString["default"];
  exports.BooleanTransform = _emberDataPrivateTransformsBoolean["default"];
});
define('ember-data/-private/utils', ['exports', 'ember', 'ember-data/-private/debug'], function (exports, _ember, _emberDataPrivateDebug) {
  'use strict';

  var get = _ember['default'].get;

  /**
    Assert that `addedRecord` has a valid type so it can be added to the
    relationship of the `record`.
  
    The assert basically checks if the `addedRecord` can be added to the
    relationship (specified via `relationshipMeta`) of the `record`.
  
    This utility should only be used internally, as both record parameters must
    be an InternalModel and the `relationshipMeta` needs to be the meta
    information about the relationship, retrieved via
    `record.relationshipFor(key)`.
  
    @method assertPolymorphicType
    @param {InternalModel} record
    @param {RelationshipMeta} relationshipMeta retrieved via
           `record.relationshipFor(key)`
    @param {InternalModel} addedRecord record which
           should be added/set for the relationship
  */
  var assertPolymorphicType = function assertPolymorphicType(record, relationshipMeta, addedRecord) {
    var addedType = addedRecord.type.modelName;
    var recordType = record.type.modelName;
    var key = relationshipMeta.key;
    var typeClass = record.store.modelFor(relationshipMeta.type);

    var assertionMessage = 'You cannot add a record of type \'' + addedType + '\' to the \'' + recordType + '.' + key + '\' relationship (only \'' + typeClass.modelName + '\' allowed)';

    (0, _emberDataPrivateDebug.assert)(assertionMessage, checkPolymorphic(typeClass, addedRecord));
  };

  function checkPolymorphic(typeClass, addedRecord) {
    if (typeClass.__isMixin) {
      //TODO Need to do this in order to support mixins, should convert to public api
      //once it exists in Ember
      return typeClass.__mixin.detect(addedRecord.type.PrototypeMixin);
    }
    if (_ember['default'].MODEL_FACTORY_INJECTIONS) {
      typeClass = typeClass.superclass;
    }
    return typeClass.detect(addedRecord.type);
  }

  /**
    Check if the passed model has a `type` attribute or a relationship named `type`.
  
    @method modelHasAttributeOrRelationshipNamedType
    @param modelClass
   */
  function modelHasAttributeOrRelationshipNamedType(modelClass) {
    return get(modelClass, 'attributes').has('type') || get(modelClass, 'relationshipsByName').has('type');
  }

  /*
    ember-container-inject-owner is a new feature in Ember 2.3 that finally provides a public
    API for looking items up.  This function serves as a super simple polyfill to avoid
    triggering deprecations.
  */
  function getOwner(context) {
    var owner;

    if (_ember['default'].getOwner) {
      owner = _ember['default'].getOwner(context);
    }

    if (!owner && context.container) {
      owner = context.container;
    }

    if (owner && owner.lookupFactory && !owner._lookupFactory) {
      // `owner` is a container, we are just making this work
      owner._lookupFactory = owner.lookupFactory;
      owner.register = function () {
        var registry = owner.registry || owner._registry || owner;

        return registry.register.apply(registry, arguments);
      };
    }

    return owner;
  }

  exports.assertPolymorphicType = assertPolymorphicType;
  exports.modelHasAttributeOrRelationshipNamedType = modelHasAttributeOrRelationshipNamedType;
  exports.getOwner = getOwner;
});
define('ember-data/adapter', ['exports', 'ember'], function (exports, _ember) {
  /**
    @module ember-data
  */

  'use strict';

  var get = _ember['default'].get;

  /**
    An adapter is an object that receives requests from a store and
    translates them into the appropriate action to take against your
    persistence layer. The persistence layer is usually an HTTP API, but
    may be anything, such as the browser's local storage. Typically the
    adapter is not invoked directly instead its functionality is accessed
    through the `store`.
  
    ### Creating an Adapter
  
    Create a new subclass of `DS.Adapter` in the `app/adapters` folder:
  
    ```app/adapters/application.js
    import DS from 'ember-data';
  
    export default DS.Adapter.extend({
      // ...your code here
    });
    ```
  
    Model-specific adapters can be created by putting your adapter
    class in an `app/adapters/` + `model-name` + `.js` file of the application.
  
    ```app/adapters/post.js
    import DS from 'ember-data';
  
    export default DS.Adapter.extend({
      // ...Post-specific adapter code goes here
    });
    ```
  
    `DS.Adapter` is an abstract base class that you should override in your
    application to customize it for your backend. The minimum set of methods
    that you should implement is:
  
      * `findRecord()`
      * `createRecord()`
      * `updateRecord()`
      * `deleteRecord()`
      * `findAll()`
      * `query()`
  
    To improve the network performance of your application, you can optimize
    your adapter by overriding these lower-level methods:
  
      * `findMany()`
  
  
    For an example implementation, see `DS.RESTAdapter`, the
    included REST adapter.
  
    @class Adapter
    @namespace DS
    @extends Ember.Object
  */

  exports['default'] = _ember['default'].Object.extend({

    /**
      If you would like your adapter to use a custom serializer you can
      set the `defaultSerializer` property to be the name of the custom
      serializer.
       Note the `defaultSerializer` serializer has a lower priority than
      a model specific serializer (i.e. `PostSerializer`) or the
      `application` serializer.
       ```app/adapters/django.js
      import DS from 'ember-data';
       export default DS.Adapter.extend({
        defaultSerializer: 'django'
      });
      ```
       @property defaultSerializer
      @type {String}
    */
    defaultSerializer: '-default',

    /**
      The `findRecord()` method is invoked when the store is asked for a record that
      has not previously been loaded. In response to `findRecord()` being called, you
      should query your persistence layer for a record with the given ID. Once
      found, you can asynchronously call the store's `push()` method to push
      the record into the store.
       Here is an example `findRecord` implementation:
       ```app/adapters/application.js
      import DS from 'ember-data';
       export default DS.Adapter.extend({
        findRecord: function(store, type, id, snapshot) {
          var url = [type.modelName, id].join('/');
           return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.getJSON(url).then(function(data) {
              Ember.run(null, resolve, data);
            }, function(jqXHR) {
              jqXHR.then = null; // tame jQuery's ill mannered promises
              Ember.run(null, reject, jqXHR);
            });
          });
        }
      });
      ```
       @method findRecord
      @param {DS.Store} store
      @param {DS.Model} type
      @param {String} id
      @param {DS.Snapshot} snapshot
      @return {Promise} promise
    */
    findRecord: null,

    /**
      The `findAll()` method is used to retrieve all records for a given type.
       Example
       ```app/adapters/application.js
      import DS from 'ember-data';
       export default DS.Adapter.extend({
        findAll: function(store, type, sinceToken) {
          var url = type;
          var query = { since: sinceToken };
          return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.getJSON(url, query).then(function(data) {
              Ember.run(null, resolve, data);
            }, function(jqXHR) {
              jqXHR.then = null; // tame jQuery's ill mannered promises
              Ember.run(null, reject, jqXHR);
            });
          });
        }
      });
      ```
       @method findAll
      @param {DS.Store} store
      @param {DS.Model} type
      @param {String} sinceToken
      @param {DS.SnapshotRecordArray} snapshotRecordArray
      @return {Promise} promise
    */
    findAll: null,

    /**
      This method is called when you call `query` on the store.
       Example
       ```app/adapters/application.js
      import DS from 'ember-data';
       export default DS.Adapter.extend({
        query: function(store, type, query) {
          var url = type;
          return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.getJSON(url, query).then(function(data) {
              Ember.run(null, resolve, data);
            }, function(jqXHR) {
              jqXHR.then = null; // tame jQuery's ill mannered promises
              Ember.run(null, reject, jqXHR);
            });
          });
        }
      });
      ```
       @method query
      @param {DS.Store} store
      @param {DS.Model} type
      @param {Object} query
      @param {DS.AdapterPopulatedRecordArray} recordArray
      @return {Promise} promise
    */
    query: null,

    /**
      The `queryRecord()` method is invoked when the store is asked for a single
      record through a query object.
       In response to `queryRecord()` being called, you should always fetch fresh
      data. Once found, you can asynchronously call the store's `push()` method
      to push the record into the store.
       Here is an example `queryRecord` implementation:
       Example
       ```app/adapters/application.js
      import DS from 'ember-data';
      import Ember from 'ember';
       export default DS.Adapter.extend(DS.BuildURLMixin, {
        queryRecord: function(store, type, query) {
          var urlForQueryRecord = this.buildURL(type.modelName, null, null, 'queryRecord', query);
           return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.getJSON(urlForQueryRecord, query).then(function(data) {
              Ember.run(null, resolve, data);
            }, function(jqXHR) {
              jqXHR.then = null; // tame jQuery's ill mannered promises
              Ember.run(null, reject, jqXHR);
            });
          });
        }
      });
      ```
       @method queryRecord
      @param {DS.Store} store
      @param {subclass of DS.Model} type
      @param {Object} query
      @return {Promise} promise
    */
    queryRecord: null,

    /**
      If the globally unique IDs for your records should be generated on the client,
      implement the `generateIdForRecord()` method. This method will be invoked
      each time you create a new record, and the value returned from it will be
      assigned to the record's `primaryKey`.
       Most traditional REST-like HTTP APIs will not use this method. Instead, the ID
      of the record will be set by the server, and your adapter will update the store
      with the new ID when it calls `didCreateRecord()`. Only implement this method if
      you intend to generate record IDs on the client-side.
       The `generateIdForRecord()` method will be invoked with the requesting store as
      the first parameter and the newly created record as the second parameter:
       ```javascript
      generateIdForRecord: function(store, inputProperties) {
        var uuid = App.generateUUIDWithStatisticallyLowOddsOfCollision();
        return uuid;
      }
      ```
       @method generateIdForRecord
      @param {DS.Store} store
      @param {DS.Model} type   the DS.Model class of the record
      @param {Object} inputProperties a hash of properties to set on the
        newly created record.
      @return {(String|Number)} id
    */
    generateIdForRecord: null,

    /**
      Proxies to the serializer's `serialize` method.
       Example
       ```app/adapters/application.js
      import DS from 'ember-data';
       export default DS.Adapter.extend({
        createRecord: function(store, type, snapshot) {
          var data = this.serialize(snapshot, { includeId: true });
          var url = type;
           // ...
        }
      });
      ```
       @method serialize
      @param {DS.Snapshot} snapshot
      @param {Object}   options
      @return {Object} serialized snapshot
    */
    serialize: function serialize(snapshot, options) {
      return get(snapshot.record, 'store').serializerFor(snapshot.modelName).serialize(snapshot, options);
    },

    /**
      Implement this method in a subclass to handle the creation of
      new records.
       Serializes the record and sends it to the server.
       Example
       ```app/adapters/application.js
      import DS from 'ember-data';
       export default DS.Adapter.extend({
        createRecord: function(store, type, snapshot) {
          var data = this.serialize(snapshot, { includeId: true });
          var url = type;
           return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.ajax({
              type: 'POST',
              url: url,
              dataType: 'json',
              data: data
            }).then(function(data) {
              Ember.run(null, resolve, data);
            }, function(jqXHR) {
              jqXHR.then = null; // tame jQuery's ill mannered promises
              Ember.run(null, reject, jqXHR);
            });
          });
        }
      });
      ```
       @method createRecord
      @param {DS.Store} store
      @param {DS.Model} type   the DS.Model class of the record
      @param {DS.Snapshot} snapshot
      @return {Promise} promise
    */
    createRecord: null,

    /**
      Implement this method in a subclass to handle the updating of
      a record.
       Serializes the record update and sends it to the server.
       The updateRecord method is expected to return a promise that will
      resolve with the serialized record. This allows the backend to
      inform the Ember Data store the current state of this record after
      the update. If it is not possible to return a serialized record
      the updateRecord promise can also resolve with `undefined` and the
      Ember Data store will assume all of the updates were successfully
      applied on the backend.
       Example
       ```app/adapters/application.js
      import DS from 'ember-data';
       export default DS.Adapter.extend({
        updateRecord: function(store, type, snapshot) {
          var data = this.serialize(snapshot, { includeId: true });
          var id = snapshot.id;
          var url = [type, id].join('/');
           return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.ajax({
              type: 'PUT',
              url: url,
              dataType: 'json',
              data: data
            }).then(function(data) {
              Ember.run(null, resolve, data);
            }, function(jqXHR) {
              jqXHR.then = null; // tame jQuery's ill mannered promises
              Ember.run(null, reject, jqXHR);
            });
          });
        }
      });
      ```
       @method updateRecord
      @param {DS.Store} store
      @param {DS.Model} type   the DS.Model class of the record
      @param {DS.Snapshot} snapshot
      @return {Promise} promise
    */
    updateRecord: null,

    /**
      Implement this method in a subclass to handle the deletion of
      a record.
       Sends a delete request for the record to the server.
       Example
       ```app/adapters/application.js
      import DS from 'ember-data';
       export default DS.Adapter.extend({
        deleteRecord: function(store, type, snapshot) {
          var data = this.serialize(snapshot, { includeId: true });
          var id = snapshot.id;
          var url = [type, id].join('/');
           return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.ajax({
              type: 'DELETE',
              url: url,
              dataType: 'json',
              data: data
            }).then(function(data) {
              Ember.run(null, resolve, data);
            }, function(jqXHR) {
              jqXHR.then = null; // tame jQuery's ill mannered promises
              Ember.run(null, reject, jqXHR);
            });
          });
        }
      });
      ```
       @method deleteRecord
      @param {DS.Store} store
      @param {DS.Model} type   the DS.Model class of the record
      @param {DS.Snapshot} snapshot
      @return {Promise} promise
    */
    deleteRecord: null,

    /**
      By default the store will try to coalesce all `fetchRecord` calls within the same runloop
      into as few requests as possible by calling groupRecordsForFindMany and passing it into a findMany call.
      You can opt out of this behaviour by either not implementing the findMany hook or by setting
      coalesceFindRequests to false.
       @property coalesceFindRequests
      @type {boolean}
    */
    coalesceFindRequests: true,

    /**
      Find multiple records at once if coalesceFindRequests is true.
       @method findMany
      @param {DS.Store} store
      @param {DS.Model} type   the DS.Model class of the records
      @param {Array}    ids
      @param {Array} snapshots
      @return {Promise} promise
    */
    findMany: null,

    /**
      Organize records into groups, each of which is to be passed to separate
      calls to `findMany`.
       For example, if your api has nested URLs that depend on the parent, you will
      want to group records by their parent.
       The default implementation returns the records as a single group.
       @method groupRecordsForFindMany
      @param {DS.Store} store
      @param {Array} snapshots
      @return {Array}  an array of arrays of records, each of which is to be
                        loaded separately by `findMany`.
    */
    groupRecordsForFindMany: function groupRecordsForFindMany(store, snapshots) {
      return [snapshots];
    },

    /**
      This method is used by the store to determine if the store should
      reload a record from the adapter when a record is requested by
      `store.findRecord`.
       If this method returns true, the store will re-fetch a record from
      the adapter. If this method returns false, the store will resolve
      immediately using the cached record.
       @method shouldReloadRecord
      @param {DS.Store} store
      @param {DS.Snapshot} snapshot
      @return {Boolean}
    */
    shouldReloadRecord: function shouldReloadRecord(store, snapshot) {
      return false;
    },

    /**
      This method is used by the store to determine if the store should
      reload all records from the adapter when records are requested by
      `store.findAll`.
       If this method returns true, the store will re-fetch all records from
      the adapter. If this method returns false, the store will resolve
      immediately using the cached record.
       @method shouldReloadAll
      @param {DS.Store} store
      @param {DS.SnapshotRecordArray} snapshotRecordArray
      @return {Boolean}
    */
    shouldReloadAll: function shouldReloadAll(store, snapshotRecordArray) {
      return !snapshotRecordArray.length;
    },

    /**
      This method is used by the store to determine if the store should
      reload a record after the `store.findRecord` method resolves a
      cached record.
       This method is *only* checked by the store when the store is
      returning a cached record.
       If this method returns true the store will re-fetch a record from
      the adapter.
       @method shouldBackgroundReloadRecord
      @param {DS.Store} store
      @param {DS.Snapshot} snapshot
      @return {Boolean}
    */
    shouldBackgroundReloadRecord: function shouldBackgroundReloadRecord(store, snapshot) {
      return true;
    },

    /**
      This method is used by the store to determine if the store should
      reload a record array after the `store.findAll` method resolves
      with a cached record array.
       This method is *only* checked by the store when the store is
      returning a cached record array.
       If this method returns true the store will re-fetch all records
      from the adapter.
       @method shouldBackgroundReloadAll
      @param {DS.Store} store
      @param {DS.SnapshotRecordArray} snapshotRecordArray
      @return {Boolean}
    */
    shouldBackgroundReloadAll: function shouldBackgroundReloadAll(store, snapshotRecordArray) {
      return true;
    }
  });
});
define('ember-data/adapters/json-api', ['exports', 'ember', 'ember-data/adapters/rest'], function (exports, _ember, _emberDataAdaptersRest) {
  /**
    @module ember-data
  */

  'use strict';

  /**
    @class JSONAPIAdapter
    @constructor
    @namespace DS
    @extends DS.RESTAdapter
  */
  exports['default'] = _emberDataAdaptersRest['default'].extend({
    defaultSerializer: '-json-api',

    /**
      @method ajaxOptions
      @private
      @param {String} url
      @param {String} type The request type GET, POST, PUT, DELETE etc.
      @param {Object} options
      @return {Object}
    */
    ajaxOptions: function ajaxOptions(url, type, options) {
      var hash = this._super.apply(this, arguments);

      if (hash.contentType) {
        hash.contentType = 'application/vnd.api+json';
      }

      var beforeSend = hash.beforeSend;
      hash.beforeSend = function (xhr) {
        xhr.setRequestHeader('Accept', 'application/vnd.api+json');
        if (beforeSend) {
          beforeSend(xhr);
        }
      };

      return hash;
    },

    /**
      By default the JSONAPIAdapter will send each find request coming from a `store.find`
      or from accessing a relationship separately to the server. If your server supports passing
      ids as a query string, you can set coalesceFindRequests to true to coalesce all find requests
      within a single runloop.
       For example, if you have an initial payload of:
       ```javascript
      {
        post: {
          id: 1,
          comments: [1, 2]
        }
      }
      ```
       By default calling `post.get('comments')` will trigger the following requests(assuming the
      comments haven't been loaded before):
       ```
      GET /comments/1
      GET /comments/2
      ```
       If you set coalesceFindRequests to `true` it will instead trigger the following request:
       ```
      GET /comments?filter[id]=1,2
      ```
       Setting coalesceFindRequests to `true` also works for `store.find` requests and `belongsTo`
      relationships accessed within the same runloop. If you set `coalesceFindRequests: true`
       ```javascript
      store.findRecord('comment', 1);
      store.findRecord('comment', 2);
      ```
       will also send a request to: `GET /comments?filter[id]=1,2`
       Note: Requests coalescing rely on URL building strategy. So if you override `buildURL` in your app
      `groupRecordsForFindMany` more likely should be overridden as well in order for coalescing to work.
       @property coalesceFindRequests
      @type {boolean}
    */
    coalesceFindRequests: false,

    /**
      @method findMany
      @param {DS.Store} store
      @param {DS.Model} type
      @param {Array} ids
      @param {Array} snapshots
      @return {Promise} promise
    */
    findMany: function findMany(store, type, ids, snapshots) {
      var url = this.buildURL(type.modelName, ids, snapshots, 'findMany');
      return this.ajax(url, 'GET', { data: { filter: { id: ids.join(',') } } });
    },

    /**
      @method pathForType
      @param {String} modelName
      @return {String} path
    **/
    pathForType: function pathForType(modelName) {
      var dasherized = _ember['default'].String.dasherize(modelName);
      return _ember['default'].String.pluralize(dasherized);
    },

    // TODO: Remove this once we have a better way to override HTTP verbs.
    /**
      @method updateRecord
      @param {DS.Store} store
      @param {DS.Model} type
      @param {DS.Snapshot} snapshot
      @return {Promise} promise
    */
    updateRecord: function updateRecord(store, type, snapshot) {
      var data = {};
      var serializer = store.serializerFor(type.modelName);

      serializer.serializeIntoHash(data, type, snapshot, { includeId: true });

      var id = snapshot.id;
      var url = this.buildURL(type.modelName, id, snapshot, 'updateRecord');

      return this.ajax(url, 'PATCH', { data: data });
    }
  });
});
define('ember-data/adapters/rest', ['exports', 'ember', 'ember-data/adapter', 'ember-data/-private/adapters/errors', 'ember-data/-private/system/empty-object', 'ember-data/-private/adapters/build-url-mixin'], function (exports, _ember, _emberDataAdapter, _emberDataPrivateAdaptersErrors, _emberDataPrivateSystemEmptyObject, _emberDataPrivateAdaptersBuildUrlMixin) {
  /**
    @module ember-data
  */

  'use strict';

  /**
    The REST adapter allows your store to communicate with an HTTP server by
    transmitting JSON via XHR. Most Ember.js apps that consume a JSON API
    should use the REST adapter.
  
    This adapter is designed around the idea that the JSON exchanged with
    the server should be conventional.
  
    ## JSON Structure
  
    The REST adapter expects the JSON returned from your server to follow
    these conventions.
  
    ### Object Root
  
    The JSON payload should be an object that contains the record inside a
    root property. For example, in response to a `GET` request for
    `/posts/1`, the JSON should look like this:
  
    ```js
    {
      "post": {
        "id": 1,
        "title": "I'm Running to Reform the W3C's Tag",
        "author": "Yehuda Katz"
      }
    }
    ```
  
    Similarly, in response to a `GET` request for `/posts`, the JSON should
    look like this:
  
    ```js
    {
      "posts": [
        {
          "id": 1,
          "title": "I'm Running to Reform the W3C's Tag",
          "author": "Yehuda Katz"
        },
        {
          "id": 2,
          "title": "Rails is omakase",
          "author": "D2H"
        }
      ]
    }
    ```
  
    Note that the object root can be pluralized for both a single-object response
    and an array response: the REST adapter is not strict on this. Further, if the
    HTTP server responds to a `GET` request to `/posts/1` (e.g. the response to a
    `findRecord` query) with more than one object in the array, Ember Data will
    only display the object with the matching ID.
  
    ### Conventional Names
  
    Attribute names in your JSON payload should be the camelCased versions of
    the attributes in your Ember.js models.
  
    For example, if you have a `Person` model:
  
    ```app/models/person.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      firstName: DS.attr('string'),
      lastName: DS.attr('string'),
      occupation: DS.attr('string')
    });
    ```
  
    The JSON returned should look like this:
  
    ```js
    {
      "person": {
        "id": 5,
        "firstName": "Barack",
        "lastName": "Obama",
        "occupation": "President"
      }
    }
    ```
  
    ## Customization
  
    ### Endpoint path customization
  
    Endpoint paths can be prefixed with a `namespace` by setting the namespace
    property on the adapter:
  
    ```app/adapters/application.js
    import DS from 'ember-data';
  
    export default DS.RESTAdapter.extend({
      namespace: 'api/1'
    });
    ```
    Requests for the `Person` model would now target `/api/1/people/1`.
  
    ### Host customization
  
    An adapter can target other hosts by setting the `host` property.
  
    ```app/adapters/application.js
    import DS from 'ember-data';
  
    export default DS.RESTAdapter.extend({
      host: 'https://api.example.com'
    });
    ```
  
    ### Headers customization
  
    Some APIs require HTTP headers, e.g. to provide an API key. Arbitrary
    headers can be set as key/value pairs on the `RESTAdapter`'s `headers`
    object and Ember Data will send them along with each ajax request.
  
  
    ```app/adapters/application.js
    import DS from 'ember-data';
  
    export default DS.RESTAdapter.extend({
      headers: {
        "API_KEY": "secret key",
        "ANOTHER_HEADER": "Some header value"
      }
    });
    ```
  
    `headers` can also be used as a computed property to support dynamic
    headers. In the example below, the `session` object has been
    injected into an adapter by Ember's container.
  
    ```app/adapters/application.js
    import DS from 'ember-data';
  
    export default DS.RESTAdapter.extend({
      headers: Ember.computed('session.authToken', function() {
        return {
          "API_KEY": this.get("session.authToken"),
          "ANOTHER_HEADER": "Some header value"
        };
      })
    });
    ```
  
    In some cases, your dynamic headers may require data from some
    object outside of Ember's observer system (for example
    `document.cookie`). You can use the
    [volatile](/api/classes/Ember.ComputedProperty.html#method_volatile)
    function to set the property into a non-cached mode causing the headers to
    be recomputed with every request.
  
    ```app/adapters/application.js
    import DS from 'ember-data';
  
    export default DS.RESTAdapter.extend({
      headers: Ember.computed(function() {
        return {
          "API_KEY": Ember.get(document.cookie.match(/apiKey\=([^;]*)/), "1"),
          "ANOTHER_HEADER": "Some header value"
        };
      }).volatile()
    });
    ```
  
    @class RESTAdapter
    @constructor
    @namespace DS
    @extends DS.Adapter
    @uses DS.BuildURLMixin
  */
  var get = _ember['default'].get;
  var MapWithDefault = _ember['default'].MapWithDefault;exports['default'] = _emberDataAdapter['default'].extend(_emberDataPrivateAdaptersBuildUrlMixin['default'], {
    defaultSerializer: '-rest',

    /**
      By default, the RESTAdapter will send the query params sorted alphabetically to the
      server.
       For example:
       ```js
        store.query('posts', { sort: 'price', category: 'pets' });
      ```
       will generate a requests like this `/posts?category=pets&sort=price`, even if the
      parameters were specified in a different order.
       That way the generated URL will be deterministic and that simplifies caching mechanisms
      in the backend.
       Setting `sortQueryParams` to a falsey value will respect the original order.
       In case you want to sort the query parameters with a different criteria, set
      `sortQueryParams` to your custom sort function.
       ```app/adapters/application.js
      import DS from 'ember-data';
       export default DS.RESTAdapter.extend({
        sortQueryParams: function(params) {
          var sortedKeys = Object.keys(params).sort().reverse();
          var len = sortedKeys.length, newParams = {};
           for (var i = 0; i < len; i++) {
            newParams[sortedKeys[i]] = params[sortedKeys[i]];
          }
          return newParams;
        }
      });
      ```
       @method sortQueryParams
      @param {Object} obj
      @return {Object}
    */
    sortQueryParams: function sortQueryParams(obj) {
      var keys = Object.keys(obj);
      var len = keys.length;
      if (len < 2) {
        return obj;
      }
      var newQueryParams = {};
      var sortedKeys = keys.sort();

      for (var i = 0; i < len; i++) {
        newQueryParams[sortedKeys[i]] = obj[sortedKeys[i]];
      }
      return newQueryParams;
    },

    /**
      By default the RESTAdapter will send each find request coming from a `store.find`
      or from accessing a relationship separately to the server. If your server supports passing
      ids as a query string, you can set coalesceFindRequests to true to coalesce all find requests
      within a single runloop.
       For example, if you have an initial payload of:
       ```javascript
      {
        post: {
          id: 1,
          comments: [1, 2]
        }
      }
      ```
       By default calling `post.get('comments')` will trigger the following requests(assuming the
      comments haven't been loaded before):
       ```
      GET /comments/1
      GET /comments/2
      ```
       If you set coalesceFindRequests to `true` it will instead trigger the following request:
       ```
      GET /comments?ids[]=1&ids[]=2
      ```
       Setting coalesceFindRequests to `true` also works for `store.find` requests and `belongsTo`
      relationships accessed within the same runloop. If you set `coalesceFindRequests: true`
       ```javascript
      store.findRecord('comment', 1);
      store.findRecord('comment', 2);
      ```
       will also send a request to: `GET /comments?ids[]=1&ids[]=2`
       Note: Requests coalescing rely on URL building strategy. So if you override `buildURL` in your app
      `groupRecordsForFindMany` more likely should be overridden as well in order for coalescing to work.
       @property coalesceFindRequests
      @type {boolean}
    */
    coalesceFindRequests: false,

    /**
      Endpoint paths can be prefixed with a `namespace` by setting the namespace
      property on the adapter:
       ```app/adapters/application.js
      import DS from 'ember-data';
       export default DS.RESTAdapter.extend({
        namespace: 'api/1'
      });
      ```
       Requests for the `Post` model would now target `/api/1/post/`.
       @property namespace
      @type {String}
    */

    /**
      An adapter can target other hosts by setting the `host` property.
       ```app/adapters/application.js
      import DS from 'ember-data';
       export default DS.RESTAdapter.extend({
        host: 'https://api.example.com'
      });
      ```
       Requests for the `Post` model would now target `https://api.example.com/post/`.
       @property host
      @type {String}
    */

    /**
      Some APIs require HTTP headers, e.g. to provide an API
      key. Arbitrary headers can be set as key/value pairs on the
      `RESTAdapter`'s `headers` object and Ember Data will send them
      along with each ajax request. For dynamic headers see [headers
      customization](/api/data/classes/DS.RESTAdapter.html#toc_headers-customization).
       ```app/adapters/application.js
      import DS from 'ember-data';
       export default DS.RESTAdapter.extend({
        headers: {
          "API_KEY": "secret key",
          "ANOTHER_HEADER": "Some header value"
        }
      });
      ```
       @property headers
      @type {Object}
     */

    /**
      Called by the store in order to fetch the JSON for a given
      type and ID.
       The `findRecord` method makes an Ajax request to a URL computed by
      `buildURL`, and returns a promise for the resulting payload.
       This method performs an HTTP `GET` request with the id provided as part of the query string.
       @method findRecord
      @param {DS.Store} store
      @param {DS.Model} type
      @param {String} id
      @param {DS.Snapshot} snapshot
      @return {Promise} promise
    */
    findRecord: function findRecord(store, type, id, snapshot) {
      return this.ajax(this.buildURL(type.modelName, id, snapshot, 'findRecord'), 'GET');
    },

    /**
      Called by the store in order to fetch a JSON array for all
      of the records for a given type.
       The `findAll` method makes an Ajax (HTTP GET) request to a URL computed by `buildURL`, and returns a
      promise for the resulting payload.
       @method findAll
      @param {DS.Store} store
      @param {DS.Model} type
      @param {String} sinceToken
      @param {DS.SnapshotRecordArray} snapshotRecordArray
      @return {Promise} promise
    */
    findAll: function findAll(store, type, sinceToken, snapshotRecordArray) {
      var query, url;

      if (sinceToken) {
        query = { since: sinceToken };
      }

      url = this.buildURL(type.modelName, null, null, 'findAll');

      return this.ajax(url, 'GET', { data: query });
    },

    /**
      Called by the store in order to fetch a JSON array for
      the records that match a particular query.
       The `query` method makes an Ajax (HTTP GET) request to a URL
      computed by `buildURL`, and returns a promise for the resulting
      payload.
       The `query` argument is a simple JavaScript object that will be passed directly
      to the server as parameters.
       @method query
      @param {DS.Store} store
      @param {DS.Model} type
      @param {Object} query
      @return {Promise} promise
    */
    query: function query(store, type, _query) {
      var url = this.buildURL(type.modelName, null, null, 'query', _query);

      if (this.sortQueryParams) {
        _query = this.sortQueryParams(_query);
      }

      return this.ajax(url, 'GET', { data: _query });
    },

    /**
      Called by the store in order to fetch a JSON object for
      the record that matches a particular query.
       The `queryRecord` method makes an Ajax (HTTP GET) request to a URL
      computed by `buildURL`, and returns a promise for the resulting
      payload.
       The `query` argument is a simple JavaScript object that will be passed directly
      to the server as parameters.
       @method queryRecord
      @param {DS.Store} store
      @param {DS.Model} type
      @param {Object} query
      @return {Promise} promise
    */
    queryRecord: function queryRecord(store, type, query) {
      var url = this.buildURL(type.modelName, null, null, 'queryRecord', query);

      if (this.sortQueryParams) {
        query = this.sortQueryParams(query);
      }

      return this.ajax(url, 'GET', { data: query });
    },

    /**
      Called by the store in order to fetch several records together if `coalesceFindRequests` is true
       For example, if the original payload looks like:
       ```js
      {
        "id": 1,
        "title": "Rails is omakase",
        "comments": [ 1, 2, 3 ]
      }
      ```
       The IDs will be passed as a URL-encoded Array of IDs, in this form:
       ```
      ids[]=1&ids[]=2&ids[]=3
      ```
       Many servers, such as Rails and PHP, will automatically convert this URL-encoded array
      into an Array for you on the server-side. If you want to encode the
      IDs, differently, just override this (one-line) method.
       The `findMany` method makes an Ajax (HTTP GET) request to a URL computed by `buildURL`, and returns a
      promise for the resulting payload.
       @method findMany
      @param {DS.Store} store
      @param {DS.Model} type
      @param {Array} ids
      @param {Array} snapshots
      @return {Promise} promise
    */
    findMany: function findMany(store, type, ids, snapshots) {
      var url = this.buildURL(type.modelName, ids, snapshots, 'findMany');
      return this.ajax(url, 'GET', { data: { ids: ids } });
    },

    /**
      Called by the store in order to fetch a JSON array for
      the unloaded records in a has-many relationship that were originally
      specified as a URL (inside of `links`).
       For example, if your original payload looks like this:
       ```js
      {
        "post": {
          "id": 1,
          "title": "Rails is omakase",
          "links": { "comments": "/posts/1/comments" }
        }
      }
      ```
       This method will be called with the parent record and `/posts/1/comments`.
       The `findHasMany` method will make an Ajax (HTTP GET) request to the originally specified URL.
       The format of your `links` value will influence the final request URL via the `urlPrefix` method:
       * Links beginning with `//`, `http://`, `https://`, will be used as is, with no further manipulation.
       * Links beginning with a single `/` will have the current adapter's `host` value prepended to it.
       * Links with no beginning `/` will have a parentURL prepended to it, via the current adapter's `buildURL`.
       @method findHasMany
      @param {DS.Store} store
      @param {DS.Snapshot} snapshot
      @param {String} url
      @return {Promise} promise
    */
    findHasMany: function findHasMany(store, snapshot, url, relationship) {
      var id = snapshot.id;
      var type = snapshot.modelName;

      url = this.urlPrefix(url, this.buildURL(type, id, null, 'findHasMany'));

      return this.ajax(url, 'GET');
    },

    /**
      Called by the store in order to fetch a JSON array for
      the unloaded records in a belongs-to relationship that were originally
      specified as a URL (inside of `links`).
       For example, if your original payload looks like this:
       ```js
      {
        "person": {
          "id": 1,
          "name": "Tom Dale",
          "links": { "group": "/people/1/group" }
        }
      }
      ```
       This method will be called with the parent record and `/people/1/group`.
       The `findBelongsTo` method will make an Ajax (HTTP GET) request to the originally specified URL.
       The format of your `links` value will influence the final request URL via the `urlPrefix` method:
       * Links beginning with `//`, `http://`, `https://`, will be used as is, with no further manipulation.
       * Links beginning with a single `/` will have the current adapter's `host` value prepended to it.
       * Links with no beginning `/` will have a parentURL prepended to it, via the current adapter's `buildURL`.
       @method findBelongsTo
      @param {DS.Store} store
      @param {DS.Snapshot} snapshot
      @param {String} url
      @return {Promise} promise
    */
    findBelongsTo: function findBelongsTo(store, snapshot, url, relationship) {
      var id = snapshot.id;
      var type = snapshot.modelName;

      url = this.urlPrefix(url, this.buildURL(type, id, null, 'findBelongsTo'));
      return this.ajax(url, 'GET');
    },

    /**
      Called by the store when a newly created record is
      saved via the `save` method on a model record instance.
       The `createRecord` method serializes the record and makes an Ajax (HTTP POST) request
      to a URL computed by `buildURL`.
       See `serialize` for information on how to customize the serialized form
      of a record.
       @method createRecord
      @param {DS.Store} store
      @param {DS.Model} type
      @param {DS.Snapshot} snapshot
      @return {Promise} promise
    */
    createRecord: function createRecord(store, type, snapshot) {
      var data = {};
      var serializer = store.serializerFor(type.modelName);
      var url = this.buildURL(type.modelName, null, snapshot, 'createRecord');

      serializer.serializeIntoHash(data, type, snapshot, { includeId: true });

      return this.ajax(url, "POST", { data: data });
    },

    /**
      Called by the store when an existing record is saved
      via the `save` method on a model record instance.
       The `updateRecord` method serializes the record and makes an Ajax (HTTP PUT) request
      to a URL computed by `buildURL`.
       See `serialize` for information on how to customize the serialized form
      of a record.
       @method updateRecord
      @param {DS.Store} store
      @param {DS.Model} type
      @param {DS.Snapshot} snapshot
      @return {Promise} promise
    */
    updateRecord: function updateRecord(store, type, snapshot) {
      var data = {};
      var serializer = store.serializerFor(type.modelName);

      serializer.serializeIntoHash(data, type, snapshot);

      var id = snapshot.id;
      var url = this.buildURL(type.modelName, id, snapshot, 'updateRecord');

      return this.ajax(url, "PUT", { data: data });
    },

    /**
      Called by the store when a record is deleted.
       The `deleteRecord` method  makes an Ajax (HTTP DELETE) request to a URL computed by `buildURL`.
       @method deleteRecord
      @param {DS.Store} store
      @param {DS.Model} type
      @param {DS.Snapshot} snapshot
      @return {Promise} promise
    */
    deleteRecord: function deleteRecord(store, type, snapshot) {
      var id = snapshot.id;

      return this.ajax(this.buildURL(type.modelName, id, snapshot, 'deleteRecord'), "DELETE");
    },

    _stripIDFromURL: function _stripIDFromURL(store, snapshot) {
      var url = this.buildURL(snapshot.modelName, snapshot.id, snapshot);

      var expandedURL = url.split('/');
      //Case when the url is of the format ...something/:id
      var lastSegment = expandedURL[expandedURL.length - 1];
      var id = snapshot.id;
      if (lastSegment === id) {
        expandedURL[expandedURL.length - 1] = "";
      } else if (endsWith(lastSegment, '?id=' + id)) {
        //Case when the url is of the format ...something?id=:id
        expandedURL[expandedURL.length - 1] = lastSegment.substring(0, lastSegment.length - id.length - 1);
      }

      return expandedURL.join('/');
    },

    // http://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url-in-different-browsers
    maxURLLength: 2048,

    /**
      Organize records into groups, each of which is to be passed to separate
      calls to `findMany`.
       This implementation groups together records that have the same base URL but
      differing ids. For example `/comments/1` and `/comments/2` will be grouped together
      because we know findMany can coalesce them together as `/comments?ids[]=1&ids[]=2`
       It also supports urls where ids are passed as a query param, such as `/comments?id=1`
      but not those where there is more than 1 query param such as `/comments?id=2&name=David`
      Currently only the query param of `id` is supported. If you need to support others, please
      override this or the `_stripIDFromURL` method.
       It does not group records that have differing base urls, such as for example: `/posts/1/comments/2`
      and `/posts/2/comments/3`
       @method groupRecordsForFindMany
      @param {DS.Store} store
      @param {Array} snapshots
      @return {Array}  an array of arrays of records, each of which is to be
                        loaded separately by `findMany`.
    */
    groupRecordsForFindMany: function groupRecordsForFindMany(store, snapshots) {
      var groups = MapWithDefault.create({ defaultValue: function defaultValue() {
          return [];
        } });
      var adapter = this;
      var maxURLLength = this.maxURLLength;

      snapshots.forEach(function (snapshot) {
        var baseUrl = adapter._stripIDFromURL(store, snapshot);
        groups.get(baseUrl).push(snapshot);
      });

      function splitGroupToFitInUrl(group, maxURLLength, paramNameLength) {
        var baseUrl = adapter._stripIDFromURL(store, group[0]);
        var idsSize = 0;
        var splitGroups = [[]];

        group.forEach(function (snapshot) {
          var additionalLength = encodeURIComponent(snapshot.id).length + paramNameLength;
          if (baseUrl.length + idsSize + additionalLength >= maxURLLength) {
            idsSize = 0;
            splitGroups.push([]);
          }

          idsSize += additionalLength;

          var lastGroupIndex = splitGroups.length - 1;
          splitGroups[lastGroupIndex].push(snapshot);
        });

        return splitGroups;
      }

      var groupsArray = [];
      groups.forEach(function (group, key) {
        var paramNameLength = '&ids%5B%5D='.length;
        var splitGroups = splitGroupToFitInUrl(group, maxURLLength, paramNameLength);

        splitGroups.forEach(function (splitGroup) {
          return groupsArray.push(splitGroup);
        });
      });

      return groupsArray;
    },

    /**
      Takes an ajax response, and returns the json payload or an error.
       By default this hook just returns the json payload passed to it.
      You might want to override it in two cases:
       1. Your API might return useful results in the response headers.
      Response headers are passed in as the second argument.
       2. Your API might return errors as successful responses with status code
      200 and an Errors text or object. You can return a `DS.InvalidError` or a
      `DS.AdapterError` (or a sub class) from this hook and it will automatically
      reject the promise and put your record into the invalid or error state.
       Returning a `DS.InvalidError` from this method will cause the
      record to transition into the `invalid` state and make the
      `errors` object available on the record. When returning an
      `DS.InvalidError` the store will attempt to normalize the error data
      returned from the server using the serializer's `extractErrors`
      method.
       @method handleResponse
      @param  {Number} status
      @param  {Object} headers
      @param  {Object} payload
      @return {Object | DS.AdapterError} response
    */
    handleResponse: function handleResponse(status, headers, payload) {
      if (this.isSuccess(status, headers, payload)) {
        return payload;
      } else if (this.isInvalid(status, headers, payload)) {
        return new _emberDataPrivateAdaptersErrors.InvalidError(payload.errors);
      }

      var errors = this.normalizeErrorResponse(status, headers, payload);

      return new _emberDataPrivateAdaptersErrors.AdapterError(errors);
    },

    /**
      Default `handleResponse` implementation uses this hook to decide if the
      response is a success.
       @method isSuccess
      @param  {Number} status
      @param  {Object} headers
      @param  {Object} payload
      @return {Boolean}
    */
    isSuccess: function isSuccess(status, headers, payload) {
      return status >= 200 && status < 300 || status === 304;
    },

    /**
      Default `handleResponse` implementation uses this hook to decide if the
      response is a an invalid error.
       @method isInvalid
      @param  {Number} status
      @param  {Object} headers
      @param  {Object} payload
      @return {Boolean}
    */
    isInvalid: function isInvalid(status, headers, payload) {
      return status === 422;
    },

    /**
      Takes a URL, an HTTP method and a hash of data, and makes an
      HTTP request.
       When the server responds with a payload, Ember Data will call into `extractSingle`
      or `extractArray` (depending on whether the original query was for one record or
      many records).
       By default, `ajax` method has the following behavior:
       * It sets the response `dataType` to `"json"`
      * If the HTTP method is not `"GET"`, it sets the `Content-Type` to be
        `application/json; charset=utf-8`
      * If the HTTP method is not `"GET"`, it stringifies the data passed in. The
        data is the serialized record in the case of a save.
      * Registers success and failure handlers.
       @method ajax
      @private
      @param {String} url
      @param {String} type The request type GET, POST, PUT, DELETE etc.
      @param {Object} options
      @return {Promise} promise
    */
    ajax: function ajax(url, type, options) {
      var adapter = this;

      return new _ember['default'].RSVP.Promise(function (resolve, reject) {
        var hash = adapter.ajaxOptions(url, type, options);

        hash.success = function (payload, textStatus, jqXHR) {

          var response = adapter.handleResponse(jqXHR.status, parseResponseHeaders(jqXHR.getAllResponseHeaders()), payload);

          if (response instanceof _emberDataPrivateAdaptersErrors.AdapterError) {
            _ember['default'].run.join(null, reject, response);
          } else {
            _ember['default'].run.join(null, resolve, response);
          }
        };

        hash.error = function (jqXHR, textStatus, errorThrown) {
          var error = undefined;

          if (!(error instanceof Error)) {
            if (errorThrown instanceof Error) {
              error = errorThrown;
            } else if (textStatus === 'timeout') {
              error = new _emberDataPrivateAdaptersErrors.TimeoutError();
            } else if (textStatus === 'abort') {
              error = new _emberDataPrivateAdaptersErrors.AbortError();
            } else {
              error = adapter.handleResponse(jqXHR.status, parseResponseHeaders(jqXHR.getAllResponseHeaders()), adapter.parseErrorResponse(jqXHR.responseText) || errorThrown);
            }
          }

          _ember['default'].run.join(null, reject, error);
        };

        _ember['default'].$.ajax(hash);
      }, 'DS: RESTAdapter#ajax ' + type + ' to ' + url);
    },

    /**
      @method ajaxOptions
      @private
      @param {String} url
      @param {String} type The request type GET, POST, PUT, DELETE etc.
      @param {Object} options
      @return {Object}
    */
    ajaxOptions: function ajaxOptions(url, type, options) {
      var hash = options || {};
      hash.url = url;
      hash.type = type;
      hash.dataType = 'json';
      hash.context = this;

      if (hash.data && type !== 'GET') {
        hash.contentType = 'application/json; charset=utf-8';
        hash.data = JSON.stringify(hash.data);
      }

      var headers = get(this, 'headers');
      if (headers !== undefined) {
        hash.beforeSend = function (xhr) {
          Object.keys(headers).forEach(function (key) {
            return xhr.setRequestHeader(key, headers[key]);
          });
        };
      }

      return hash;
    },

    /**
      @method parseErrorResponse
      @private
      @param {String} responseText
      @return {Object}
    */
    parseErrorResponse: function parseErrorResponse(responseText) {
      var json = responseText;

      try {
        json = _ember['default'].$.parseJSON(responseText);
      } catch (e) {}

      return json;
    },

    /**
      @method normalizeErrorResponse
      @private
      @param  {Number} status
      @param  {Object} headers
      @param  {Object} payload
      @return {Object} errors payload
    */
    normalizeErrorResponse: function normalizeErrorResponse(status, headers, payload) {
      if (payload && typeof payload === 'object' && payload.errors) {
        return payload.errors;
      } else {
        return [{
          status: '' + status,
          title: "The backend responded with an error",
          detail: '' + payload
        }];
      }
    }
  });

  function parseResponseHeaders(headerStr) {
    var headers = new _emberDataPrivateSystemEmptyObject['default']();
    if (!headerStr) {
      return headers;
    }

    var headerPairs = headerStr.split('\r\n');
    for (var i = 0; i < headerPairs.length; i++) {
      var headerPair = headerPairs[i];
      // Can't use split() here because it does the wrong thing
      // if the header value has the string ": " in it.
      var index = headerPair.indexOf(': ');
      if (index > 0) {
        var key = headerPair.substring(0, index);
        var val = headerPair.substring(index + 2);
        headers[key] = val;
      }
    }

    return headers;
  }

  //From http://stackoverflow.com/questions/280634/endswith-in-javascript
  function endsWith(string, suffix) {
    if (typeof String.prototype.endsWith !== 'function') {
      return string.indexOf(suffix, string.length - suffix.length) !== -1;
    } else {
      return string.endsWith(suffix);
    }
  }
});
define("ember-data/attr", ["exports", "ember", "ember-data/-private/debug"], function (exports, _ember, _emberDataPrivateDebug) {
  "use strict";

  exports["default"] = attr;

  /**
    @module ember-data
  */

  function getDefaultValue(record, options, key) {
    if (typeof options.defaultValue === "function") {
      return options.defaultValue.apply(null, arguments);
    } else {
      var defaultValue = options.defaultValue;
      (0, _emberDataPrivateDebug.deprecate)("Non primitive defaultValues are deprecated because they are shared between all instances. If you would like to use a complex object as a default value please provide a function that returns the complex object.", typeof defaultValue !== 'object' || defaultValue === null, {
        id: 'ds.defaultValue.complex-object',
        until: '3.0.0'
      });
      return defaultValue;
    }
  }

  function hasValue(record, key) {
    return key in record._attributes || key in record._inFlightAttributes || key in record._data;
  }

  function getValue(record, key) {
    if (key in record._attributes) {
      return record._attributes[key];
    } else if (key in record._inFlightAttributes) {
      return record._inFlightAttributes[key];
    } else {
      return record._data[key];
    }
  }

  /**
    `DS.attr` defines an attribute on a [DS.Model](/api/data/classes/DS.Model.html).
    By default, attributes are passed through as-is, however you can specify an
    optional type to have the value automatically transformed.
    Ember Data ships with four basic transform types: `string`, `number`,
    `boolean` and `date`. You can define your own transforms by subclassing
    [DS.Transform](/api/data/classes/DS.Transform.html).
  
    Note that you cannot use `attr` to define an attribute of `id`.
  
    `DS.attr` takes an optional hash as a second parameter, currently
    supported options are:
  
    - `defaultValue`: Pass a string or a function to be called to set the attribute
                      to a default value if none is supplied.
  
    Example
  
    ```app/models/user.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      username: DS.attr('string'),
      email: DS.attr('string'),
      verified: DS.attr('boolean', { defaultValue: false })
    });
    ```
  
    Default value can also be a function. This is useful it you want to return
    a new object for each attribute.
  
    ```app/models/user.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      username: attr('string'),
      email: attr('string'),
      settings: attr({defaultValue: function() {
        return {};
      }})
    });
    ```
  
    @namespace
    @method attr
    @for DS
    @param {String} type the attribute type
    @param {Object} options a hash of options
    @return {Attribute}
  */
  function attr(type, options) {
    if (typeof type === 'object') {
      options = type;
      type = undefined;
    } else {
      options = options || {};
    }

    var meta = {
      type: type,
      isAttribute: true,
      options: options
    };

    return _ember["default"].computed({
      get: function get(key) {
        var internalModel = this._internalModel;
        if (hasValue(internalModel, key)) {
          return getValue(internalModel, key);
        } else {
          return getDefaultValue(this, options, key);
        }
      },
      set: function set(key, value) {
        var internalModel = this._internalModel;
        var oldValue = getValue(internalModel, key);

        if (value !== oldValue) {
          // Add the new value to the changed attributes hash; it will get deleted by
          // the 'didSetProperty' handler if it is no different from the original value
          internalModel._attributes[key] = value;

          this._internalModel.send('didSetProperty', {
            name: key,
            oldValue: oldValue,
            originalValue: internalModel._data[key],
            value: value
          });
        }

        return value;
      }
    }).meta(meta);
  }
});
define("ember-data/index", ["exports", "ember", "ember-data/-private/debug", "ember-data/-private/core", "ember-data/-private/system/normalize-model-name", "ember-data/-private/system/model/internal-model", "ember-data/-private/system/promise-proxies", "ember-data/-private/system/store", "ember-data/-private/system/model", "ember-data/model", "ember-data/-private/system/snapshot", "ember-data/adapter", "ember-data/-private/system/serializer", "ember-data/-private/system/debug", "ember-data/-private/adapters/errors", "ember-data/-private/system/record-arrays", "ember-data/-private/system/many-array", "ember-data/-private/system/record-array-manager", "ember-data/-private/adapters", "ember-data/-private/adapters/build-url-mixin", "ember-data/-private/serializers", "ember-inflector", "ember-data/-private/serializers/embedded-records-mixin", "ember-data/-private/transforms", "ember-data/relationships", "ember-data/setup-container", "ember-data/-private/instance-initializers/initialize-store-service", "ember-data/-private/system/container-proxy", "ember-data/-private/system/relationships/state/relationship"], function (exports, _ember, _emberDataPrivateDebug, _emberDataPrivateCore, _emberDataPrivateSystemNormalizeModelName, _emberDataPrivateSystemModelInternalModel, _emberDataPrivateSystemPromiseProxies, _emberDataPrivateSystemStore, _emberDataPrivateSystemModel, _emberDataModel, _emberDataPrivateSystemSnapshot, _emberDataAdapter, _emberDataPrivateSystemSerializer, _emberDataPrivateSystemDebug, _emberDataPrivateAdaptersErrors, _emberDataPrivateSystemRecordArrays, _emberDataPrivateSystemManyArray, _emberDataPrivateSystemRecordArrayManager, _emberDataPrivateAdapters, _emberDataPrivateAdaptersBuildUrlMixin, _emberDataPrivateSerializers, _emberInflector, _emberDataPrivateSerializersEmbeddedRecordsMixin, _emberDataPrivateTransforms, _emberDataRelationships, _emberDataSetupContainer, _emberDataPrivateInstanceInitializersInitializeStoreService, _emberDataPrivateSystemContainerProxy, _emberDataPrivateSystemRelationshipsStateRelationship) {
  "use strict";

  if (_ember["default"].VERSION.match(/^1\.([0-9]|1[0-2])\./)) {
    throw new _ember["default"].Error("Ember Data requires at least Ember 1.13.0, but you have " + _ember["default"].VERSION + ". Please upgrade your version of Ember, then upgrade Ember Data.");
  }

  if (_ember["default"].VERSION.match(/^1\.13\./)) {
    (0, _emberDataPrivateDebug.warn)("Use of Ember Data 2+ with Ember 1.13 is unsupported. Please upgrade your version of Ember to 2.0 or higher.", false, {
      id: 'ds.version.ember-1-13'
    });
  }_emberDataPrivateCore["default"].Store = _emberDataPrivateSystemStore.Store;
  _emberDataPrivateCore["default"].PromiseArray = _emberDataPrivateSystemPromiseProxies.PromiseArray;
  _emberDataPrivateCore["default"].PromiseObject = _emberDataPrivateSystemPromiseProxies.PromiseObject;

  _emberDataPrivateCore["default"].PromiseManyArray = _emberDataPrivateSystemPromiseProxies.PromiseManyArray;

  _emberDataPrivateCore["default"].Model = _emberDataModel["default"];
  _emberDataPrivateCore["default"].RootState = _emberDataPrivateSystemModel.RootState;
  _emberDataPrivateCore["default"].attr = _emberDataPrivateSystemModel.attr;
  _emberDataPrivateCore["default"].Errors = _emberDataPrivateSystemModel.Errors;

  _emberDataPrivateCore["default"].InternalModel = _emberDataPrivateSystemModelInternalModel["default"];
  _emberDataPrivateCore["default"].Snapshot = _emberDataPrivateSystemSnapshot["default"];

  _emberDataPrivateCore["default"].Adapter = _emberDataAdapter["default"];

  _emberDataPrivateCore["default"].AdapterError = _emberDataPrivateAdaptersErrors.AdapterError;
  _emberDataPrivateCore["default"].InvalidError = _emberDataPrivateAdaptersErrors.InvalidError;
  _emberDataPrivateCore["default"].TimeoutError = _emberDataPrivateAdaptersErrors.TimeoutError;
  _emberDataPrivateCore["default"].AbortError = _emberDataPrivateAdaptersErrors.AbortError;

  _emberDataPrivateCore["default"].errorsHashToArray = _emberDataPrivateAdaptersErrors.errorsHashToArray;
  _emberDataPrivateCore["default"].errorsArrayToHash = _emberDataPrivateAdaptersErrors.errorsArrayToHash;

  _emberDataPrivateCore["default"].Serializer = _emberDataPrivateSystemSerializer["default"];

  _emberDataPrivateCore["default"].DebugAdapter = _emberDataPrivateSystemDebug["default"];

  _emberDataPrivateCore["default"].RecordArray = _emberDataPrivateSystemRecordArrays.RecordArray;
  _emberDataPrivateCore["default"].FilteredRecordArray = _emberDataPrivateSystemRecordArrays.FilteredRecordArray;
  _emberDataPrivateCore["default"].AdapterPopulatedRecordArray = _emberDataPrivateSystemRecordArrays.AdapterPopulatedRecordArray;
  _emberDataPrivateCore["default"].ManyArray = _emberDataPrivateSystemManyArray["default"];

  _emberDataPrivateCore["default"].RecordArrayManager = _emberDataPrivateSystemRecordArrayManager["default"];

  _emberDataPrivateCore["default"].RESTAdapter = _emberDataPrivateAdapters.RESTAdapter;
  _emberDataPrivateCore["default"].BuildURLMixin = _emberDataPrivateAdaptersBuildUrlMixin["default"];

  _emberDataPrivateCore["default"].RESTSerializer = _emberDataPrivateSerializers.RESTSerializer;
  _emberDataPrivateCore["default"].JSONSerializer = _emberDataPrivateSerializers.JSONSerializer;

  _emberDataPrivateCore["default"].JSONAPIAdapter = _emberDataPrivateAdapters.JSONAPIAdapter;
  _emberDataPrivateCore["default"].JSONAPISerializer = _emberDataPrivateSerializers.JSONAPISerializer;

  _emberDataPrivateCore["default"].Transform = _emberDataPrivateTransforms.Transform;
  _emberDataPrivateCore["default"].DateTransform = _emberDataPrivateTransforms.DateTransform;
  _emberDataPrivateCore["default"].StringTransform = _emberDataPrivateTransforms.StringTransform;
  _emberDataPrivateCore["default"].NumberTransform = _emberDataPrivateTransforms.NumberTransform;
  _emberDataPrivateCore["default"].BooleanTransform = _emberDataPrivateTransforms.BooleanTransform;

  _emberDataPrivateCore["default"].EmbeddedRecordsMixin = _emberDataPrivateSerializersEmbeddedRecordsMixin["default"];

  _emberDataPrivateCore["default"].belongsTo = _emberDataRelationships.belongsTo;
  _emberDataPrivateCore["default"].hasMany = _emberDataRelationships.hasMany;

  _emberDataPrivateCore["default"].Relationship = _emberDataPrivateSystemRelationshipsStateRelationship["default"];

  _emberDataPrivateCore["default"].ContainerProxy = _emberDataPrivateSystemContainerProxy["default"];

  _emberDataPrivateCore["default"]._setupContainer = _emberDataSetupContainer["default"];
  _emberDataPrivateCore["default"]._initializeStoreService = _emberDataPrivateInstanceInitializersInitializeStoreService["default"];

  Object.defineProperty(_emberDataPrivateCore["default"], 'normalizeModelName', {
    enumerable: true,
    writable: false,
    configurable: false,
    value: _emberDataPrivateSystemNormalizeModelName["default"]
  });

  _ember["default"].lookup.DS = _emberDataPrivateCore["default"];

  exports["default"] = _emberDataPrivateCore["default"];
});

/**
  Ember Data
  @module ember-data
  @main ember-data
*/
define("ember-data/model", ["exports", "ember-data/-private/system/model"], function (exports, _emberDataPrivateSystemModel) {
  "use strict";

  exports["default"] = _emberDataPrivateSystemModel["default"];
});
define("ember-data/relationships", ["exports", "ember-data/-private/system/relationships/belongs-to", "ember-data/-private/system/relationships/has-many"], function (exports, _emberDataPrivateSystemRelationshipsBelongsTo, _emberDataPrivateSystemRelationshipsHasMany) {
  /**
    @module ember-data
  */

  "use strict";

  exports.belongsTo = _emberDataPrivateSystemRelationshipsBelongsTo["default"];
  exports.hasMany = _emberDataPrivateSystemRelationshipsHasMany["default"];
});
define('ember-data/serializers/json-api', ['exports', 'ember', 'ember-data/-private/debug', 'ember-data/serializers/json', 'ember-data/-private/system/normalize-model-name', 'ember-inflector'], function (exports, _ember, _emberDataPrivateDebug, _emberDataSerializersJson, _emberDataPrivateSystemNormalizeModelName, _emberInflector) {
  /**
    @module ember-data
  */

  'use strict';

  var dasherize = _ember['default'].String.dasherize;

  /**
    Ember Data 2.0 Serializer:
  
    In Ember Data a Serializer is used to serialize and deserialize
    records when they are transferred in and out of an external source.
    This process involves normalizing property names, transforming
    attribute values and serializing relationships.
  
    `JSONAPISerializer` supports the http://jsonapi.org/ spec and is the
    serializer recommended by Ember Data.
  
    This serializer normalizes a JSON API payload that looks like:
  
    ```js
  
      // models/player.js
      import DS from "ember-data";
  
      export default DS.Model.extend({
        name: DS.attr(),
        skill: DS.attr(),
        gamesPlayed: DS.attr(),
        club: DS.belongsTo('club')
      });
  
      // models/club.js
      import DS from "ember-data";
  
      export default DS.Model.extend({
        name: DS.attr(),
        location: DS.attr(),
        players: DS.hasMany('player')
      });
    ```
  
    ```js
  
      {
        "data": [
          {
            "attributes": {
              "name": "Benfica",
              "location": "Portugal"
            },
            "id": "1",
            "relationships": {
              "players": {
                "data": [
                  {
                    "id": "3",
                    "type": "players"
                  }
                ]
              }
            },
            "type": "clubs"
          }
        ],
        "included": [
          {
            "attributes": {
              "name": "Eusebio Silva Ferreira",
              "skill": "Rocket shot",
              "games-played": 431
            },
            "id": "3",
            "relationships": {
              "club": {
                "data": {
                  "id": "1",
                  "type": "clubs"
                }
              }
            },
            "type": "players"
          }
        ]
      }
    ```
  
    to the format that the Ember Data store expects.
  
    @class JSONAPISerializer
    @namespace DS
    @extends DS.JSONSerializer
  */
  var JSONAPISerializer = _emberDataSerializersJson['default'].extend({

    /**
      @method _normalizeDocumentHelper
      @param {Object} documentHash
      @return {Object}
      @private
    */
    _normalizeDocumentHelper: function _normalizeDocumentHelper(documentHash) {

      if (_ember['default'].typeOf(documentHash.data) === 'object') {
        documentHash.data = this._normalizeResourceHelper(documentHash.data);
      } else if (Array.isArray(documentHash.data)) {
        var ret = new Array(documentHash.data.length);

        for (var i = 0; i < documentHash.data.length; i++) {
          var data = documentHash.data[i];
          ret[i] = this._normalizeResourceHelper(data);
        }

        documentHash.data = ret;
      }

      if (Array.isArray(documentHash.included)) {
        var ret = new Array(documentHash.included.length);

        for (var i = 0; i < documentHash.included.length; i++) {
          var included = documentHash.included[i];
          ret[i] = this._normalizeResourceHelper(included);
        }

        documentHash.included = ret;
      }

      return documentHash;
    },

    /**
      @method _normalizeRelationshipDataHelper
      @param {Object} relationshipDataHash
      @return {Object}
      @private
    */
    _normalizeRelationshipDataHelper: function _normalizeRelationshipDataHelper(relationshipDataHash) {
      var type = this.modelNameFromPayloadKey(relationshipDataHash.type);
      relationshipDataHash.type = type;
      return relationshipDataHash;
    },

    /**
      @method _normalizeResourceHelper
      @param {Object} resourceHash
      @return {Object}
      @private
    */
    _normalizeResourceHelper: function _normalizeResourceHelper(resourceHash) {
      (0, _emberDataPrivateDebug.assert)(this.warnMessageForUndefinedType(), !_ember['default'].isNone(resourceHash.type), {
        id: 'ds.serializer.type-is-undefined'
      });

      var modelName = this.modelNameFromPayloadKey(resourceHash.type);

      if (!this.store._hasModelFor(modelName)) {
        (0, _emberDataPrivateDebug.warn)(this.warnMessageNoModelForType(modelName, resourceHash.type), false, {
          id: 'ds.serializer.model-for-type-missing'
        });
        return null;
      }

      var modelClass = this.store.modelFor(modelName);
      var serializer = this.store.serializerFor(modelName);

      var _serializer$normalize = serializer.normalize(modelClass, resourceHash);

      var data = _serializer$normalize.data;

      return data;
    },

    /**
      @method pushPayload
      @param {DS.Store} store
      @param {Object} payload
    */
    pushPayload: function pushPayload(store, payload) {
      var normalizedPayload = this._normalizeDocumentHelper(payload);
      store.push(normalizedPayload);
    },

    /**
      @method _normalizeResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @param {Boolean} isSingle
      @return {Object} JSON-API Document
      @private
    */
    _normalizeResponse: function _normalizeResponse(store, primaryModelClass, payload, id, requestType, isSingle) {
      var normalizedPayload = this._normalizeDocumentHelper(payload);
      return normalizedPayload;
    },

    /**
      @method extractAttributes
      @param {DS.Model} modelClass
      @param {Object} resourceHash
      @return {Object}
    */
    extractAttributes: function extractAttributes(modelClass, resourceHash) {
      var _this = this;

      var attributes = {};

      if (resourceHash.attributes) {
        modelClass.eachAttribute(function (key) {
          var attributeKey = _this.keyForAttribute(key, 'deserialize');
          if (resourceHash.attributes.hasOwnProperty(attributeKey)) {
            attributes[key] = resourceHash.attributes[attributeKey];
          }
        });
      }

      return attributes;
    },

    /**
      @method extractRelationship
      @param {Object} relationshipHash
      @return {Object}
    */
    extractRelationship: function extractRelationship(relationshipHash) {

      if (_ember['default'].typeOf(relationshipHash.data) === 'object') {
        relationshipHash.data = this._normalizeRelationshipDataHelper(relationshipHash.data);
      }

      if (Array.isArray(relationshipHash.data)) {
        var ret = new Array(relationshipHash.data.length);

        for (var i = 0; i < relationshipHash.data.length; i++) {
          var data = relationshipHash.data[i];
          ret[i] = this._normalizeRelationshipDataHelper(data);
        }

        relationshipHash.data = ret;
      }

      return relationshipHash;
    },

    /**
      @method extractRelationships
      @param {Object} modelClass
      @param {Object} resourceHash
      @return {Object}
    */
    extractRelationships: function extractRelationships(modelClass, resourceHash) {
      var _this2 = this;

      var relationships = {};

      if (resourceHash.relationships) {
        modelClass.eachRelationship(function (key, relationshipMeta) {
          var relationshipKey = _this2.keyForRelationship(key, relationshipMeta.kind, 'deserialize');
          if (resourceHash.relationships.hasOwnProperty(relationshipKey)) {

            var relationshipHash = resourceHash.relationships[relationshipKey];
            relationships[key] = _this2.extractRelationship(relationshipHash);
          }
        });
      }

      return relationships;
    },

    /**
      @method _extractType
      @param {DS.Model} modelClass
      @param {Object} resourceHash
      @return {String}
      @private
    */
    _extractType: function _extractType(modelClass, resourceHash) {
      return this.modelNameFromPayloadKey(resourceHash.type);
    },

    /**
      @method modelNameFromPayloadKey
      @param {String} key
      @return {String} the model's modelName
    */
    modelNameFromPayloadKey: function modelNameFromPayloadKey(key) {
      return (0, _emberInflector.singularize)((0, _emberDataPrivateSystemNormalizeModelName['default'])(key));
    },

    /**
      @method payloadKeyFromModelName
      @param {String} modelName
      @return {String}
    */
    payloadKeyFromModelName: function payloadKeyFromModelName(modelName) {
      return (0, _emberInflector.pluralize)(modelName);
    },

    /**
      @method normalize
      @param {DS.Model} modelClass
      @param {Object} resourceHash the resource hash from the adapter
      @return {Object} the normalized resource hash
    */
    normalize: function normalize(modelClass, resourceHash) {
      if (resourceHash.attributes) {
        this.normalizeUsingDeclaredMapping(modelClass, resourceHash.attributes);
      }

      if (resourceHash.relationships) {
        this.normalizeUsingDeclaredMapping(modelClass, resourceHash.relationships);
      }

      var data = {
        id: this.extractId(modelClass, resourceHash),
        type: this._extractType(modelClass, resourceHash),
        attributes: this.extractAttributes(modelClass, resourceHash),
        relationships: this.extractRelationships(modelClass, resourceHash)
      };

      this.applyTransforms(modelClass, data.attributes);

      return { data: data };
    },

    /**
     `keyForAttribute` can be used to define rules for how to convert an
     attribute name in your model to a key in your JSON.
     By default `JSONAPISerializer` follows the format used on the examples of
     http://jsonapi.org/format and uses dashes as the word separator in the JSON
     attribute keys.
      This behaviour can be easily customized by extending this method.
      Example
      ```app/serializers/application.js
     import DS from 'ember-data';
      export default DS.JSONAPISerializer.extend({
       keyForAttribute: function(attr, method) {
         return Ember.String.dasherize(attr).toUpperCase();
       }
     });
     ```
      @method keyForAttribute
     @param {String} key
     @param {String} method
     @return {String} normalized key
    */
    keyForAttribute: function keyForAttribute(key, method) {
      return dasherize(key);
    },

    /**
     `keyForRelationship` can be used to define a custom key when
     serializing and deserializing relationship properties.
     By default `JSONAPISerializer` follows the format used on the examples of
     http://jsonapi.org/format and uses dashes as word separators in
     relationship properties.
      This behaviour can be easily customized by extending this method.
      Example
       ```app/serializers/post.js
      import DS from 'ember-data';
       export default DS.JSONAPISerializer.extend({
        keyForRelationship: function(key, relationship, method) {
          return Ember.String.underscore(key);
        }
      });
      ```
     @method keyForRelationship
     @param {String} key
     @param {String} typeClass
     @param {String} method
     @return {String} normalized key
    */
    keyForRelationship: function keyForRelationship(key, typeClass, method) {
      return dasherize(key);
    },

    /**
      @method serialize
      @param {DS.Snapshot} snapshot
      @param {Object} options
      @return {Object} json
    */
    serialize: function serialize(snapshot, options) {
      var data = this._super.apply(this, arguments);
      data.type = this.payloadKeyFromModelName(snapshot.modelName);
      return { data: data };
    },

    /**
     @method serializeAttribute
     @param {DS.Snapshot} snapshot
     @param {Object} json
     @param {String} key
     @param {Object} attribute
    */
    serializeAttribute: function serializeAttribute(snapshot, json, key, attribute) {
      var type = attribute.type;

      if (this._canSerialize(key)) {
        json.attributes = json.attributes || {};

        var value = snapshot.attr(key);
        if (type) {
          var transform = this.transformFor(type);
          value = transform.serialize(value);
        }

        var payloadKey = this._getMappedKey(key, snapshot.type);

        if (payloadKey === key) {
          payloadKey = this.keyForAttribute(key, 'serialize');
        }

        json.attributes[payloadKey] = value;
      }
    },

    /**
     @method serializeBelongsTo
     @param {DS.Snapshot} snapshot
     @param {Object} json
     @param {Object} relationship
    */
    serializeBelongsTo: function serializeBelongsTo(snapshot, json, relationship) {
      var key = relationship.key;

      if (this._canSerialize(key)) {
        var belongsTo = snapshot.belongsTo(key);
        if (belongsTo !== undefined) {

          json.relationships = json.relationships || {};

          var payloadKey = this._getMappedKey(key, snapshot.type);
          if (payloadKey === key) {
            payloadKey = this.keyForRelationship(key, 'belongsTo', 'serialize');
          }

          var data = null;
          if (belongsTo) {
            data = {
              type: this.payloadKeyFromModelName(belongsTo.modelName),
              id: belongsTo.id
            };
          }

          json.relationships[payloadKey] = { data: data };
        }
      }
    },

    /**
     @method serializeHasMany
     @param {DS.Snapshot} snapshot
     @param {Object} json
     @param {Object} relationship
    */
    serializeHasMany: function serializeHasMany(snapshot, json, relationship) {
      var key = relationship.key;

      if (this._shouldSerializeHasMany(snapshot, key, relationship)) {
        var hasMany = snapshot.hasMany(key);
        if (hasMany !== undefined) {

          json.relationships = json.relationships || {};

          var payloadKey = this._getMappedKey(key, snapshot.type);
          if (payloadKey === key && this.keyForRelationship) {
            payloadKey = this.keyForRelationship(key, 'hasMany', 'serialize');
          }

          var data = new Array(hasMany.length);

          for (var i = 0; i < hasMany.length; i++) {
            var item = hasMany[i];
            data[i] = {
              type: this.payloadKeyFromModelName(item.modelName),
              id: item.id
            };
          }

          json.relationships[payloadKey] = { data: data };
        }
      }
    }
  });

  (0, _emberDataPrivateDebug.runInDebug)(function () {
    JSONAPISerializer.reopen({
      warnMessageForUndefinedType: function warnMessageForUndefinedType() {
        return 'Encountered a resource object with an undefined type (resolved resource using ' + this.constructor.toString() + ')';
      },
      warnMessageNoModelForType: function warnMessageNoModelForType(modelName, originalType) {
        return 'Encountered a resource object with type "' + originalType + '", but no model was found for model name "' + modelName + '" (resolved model name using ' + this.constructor.toString() + '.modelNameFromPayloadKey("' + originalType + '"))';
      }
    });
  });

  exports['default'] = JSONAPISerializer;
});
define('ember-data/serializers/json', ['exports', 'ember', 'ember-data/-private/debug', 'ember-data/-private/system/serializer', 'ember-data/-private/system/coerce-id', 'ember-data/-private/system/normalize-model-name', 'ember-data/-private/utils', 'ember-data/-private/adapters/errors'], function (exports, _ember, _emberDataPrivateDebug, _emberDataPrivateSystemSerializer, _emberDataPrivateSystemCoerceId, _emberDataPrivateSystemNormalizeModelName, _emberDataPrivateUtils, _emberDataPrivateAdaptersErrors) {
  'use strict';

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var get = _ember['default'].get;
  var isNone = _ember['default'].isNone;
  var merge = _ember['default'].merge;

  /**
    Ember Data 2.0 Serializer:
  
    In Ember Data a Serializer is used to serialize and deserialize
    records when they are transferred in and out of an external source.
    This process involves normalizing property names, transforming
    attribute values and serializing relationships.
  
    By default, Ember Data uses and recommends the `JSONAPISerializer`.
  
    `JSONSerializer` is useful for simpler or legacy backends that may
    not support the http://jsonapi.org/ spec.
  
    For example, given the following `User` model and JSON payload:
  
    ```app/models/user.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      friends: DS.hasMany('user'),
      house: DS.belongsTo('location'),
  
      name: DS.attr('string')
    });
    ```
  
    ```js
    {
      id: 1,
      name: 'Sebastian',
      friends: [3, 4],
      links: {
        house: '/houses/lefkada'
      }
    }
    ```
  
    `JSONSerializer` will normalize the JSON payload to the JSON API format that the
    Ember Data store expects.
  
    You can customize how JSONSerializer processes its payload by passing options in
    the `attrs` hash or by subclassing the `JSONSerializer` and overriding hooks:
  
      - To customize how a single record is normalized, use the `normalize` hook.
      - To customize how `JSONSerializer` normalizes the whole server response, use the
        `normalizeResponse` hook.
      - To customize how `JSONSerializer` normalizes a specific response from the server,
        use one of the many specific `normalizeResponse` hooks.
      - To customize how `JSONSerializer` normalizes your id, attributes or relationships,
        use the `extractId`, `extractAttributes` and `extractRelationships` hooks.
  
    The `JSONSerializer` normalization process follows these steps:
  
      - `normalizeResponse` - entry method to the serializer.
      - `normalizeCreateRecordResponse` - a `normalizeResponse` for a specific operation is called.
      - `normalizeSingleResponse`|`normalizeArrayResponse` - for methods like `createRecord` we expect
        a single record back, while for methods like `findAll` we expect multiple methods back.
      - `normalize` - `normalizeArray` iterates and calls `normalize` for each of its records while `normalizeSingle`
        calls it once. This is the method you most likely want to subclass.
      - `extractId` | `extractAttributes` | `extractRelationships` - `normalize` delegates to these methods to
        turn the record payload into the JSON API format.
  
    @class JSONSerializer
    @namespace DS
    @extends DS.Serializer
  */
  exports['default'] = _emberDataPrivateSystemSerializer['default'].extend({

    /**
      The `primaryKey` is used when serializing and deserializing
      data. Ember Data always uses the `id` property to store the id of
      the record. The external source may not always follow this
      convention. In these cases it is useful to override the
      `primaryKey` property to match the `primaryKey` of your external
      store.
       Example
       ```app/serializers/application.js
      import DS from 'ember-data';
       export default DS.JSONSerializer.extend({
        primaryKey: '_id'
      });
      ```
       @property primaryKey
      @type {String}
      @default 'id'
    */
    primaryKey: 'id',

    /**
      The `attrs` object can be used to declare a simple mapping between
      property names on `DS.Model` records and payload keys in the
      serialized JSON object representing the record. An object with the
      property `key` can also be used to designate the attribute's key on
      the response payload.
       Example
       ```app/models/person.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        firstName: DS.attr('string'),
        lastName: DS.attr('string'),
        occupation: DS.attr('string'),
        admin: DS.attr('boolean')
      });
      ```
       ```app/serializers/person.js
      import DS from 'ember-data';
       export default DS.JSONSerializer.extend({
        attrs: {
          admin: 'is_admin',
          occupation: { key: 'career' }
        }
      });
      ```
       You can also remove attributes by setting the `serialize` key to
      `false` in your mapping object.
       Example
       ```app/serializers/person.js
      import DS from 'ember-data';
       export default DS.JSONSerializer.extend({
        attrs: {
          admin: { serialize: false },
          occupation: { key: 'career' }
        }
      });
      ```
       When serialized:
       ```javascript
      {
        "firstName": "Harry",
        "lastName": "Houdini",
        "career": "magician"
      }
      ```
       Note that the `admin` is now not included in the payload.
       @property attrs
      @type {Object}
    */
    mergedProperties: ['attrs'],

    /**
     Given a subclass of `DS.Model` and a JSON object this method will
     iterate through each attribute of the `DS.Model` and invoke the
     `DS.Transform#deserialize` method on the matching property of the
     JSON object.  This method is typically called after the
     serializer's `normalize` method.
      @method applyTransforms
     @private
     @param {DS.Model} typeClass
     @param {Object} data The data to transform
     @return {Object} data The transformed data object
    */
    applyTransforms: function applyTransforms(typeClass, data) {
      var _this = this;

      typeClass.eachTransformedAttribute(function (key, typeClass) {
        if (!data.hasOwnProperty(key)) {
          return;
        }

        var transform = _this.transformFor(typeClass);
        data[key] = transform.deserialize(data[key]);
      });

      return data;
    },

    /**
      The `normalizeResponse` method is used to normalize a payload from the
      server to a JSON-API Document.
       http://jsonapi.org/format/#document-structure
       This method delegates to a more specific normalize method based on
      the `requestType`.
       To override this method with a custom one, make sure to call
      `return this._super(store, primaryModelClass, payload, id, requestType)` with your
      pre-processed data.
       Here's an example of using `normalizeResponse` manually:
       ```javascript
      socket.on('message', function(message) {
        var data = message.data;
        var modelClass = store.modelFor(data.modelName);
        var serializer = store.serializerFor(data.modelName);
        var json = serializer.normalizeSingleResponse(store, modelClass, data, data.id);
         store.push(normalized);
      });
      ```
       @method normalizeResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @return {Object} JSON-API Document
    */
    normalizeResponse: function normalizeResponse(store, primaryModelClass, payload, id, requestType) {
      switch (requestType) {
        case 'findRecord':
          return this.normalizeFindRecordResponse.apply(this, arguments);
        case 'queryRecord':
          return this.normalizeQueryRecordResponse.apply(this, arguments);
        case 'findAll':
          return this.normalizeFindAllResponse.apply(this, arguments);
        case 'findBelongsTo':
          return this.normalizeFindBelongsToResponse.apply(this, arguments);
        case 'findHasMany':
          return this.normalizeFindHasManyResponse.apply(this, arguments);
        case 'findMany':
          return this.normalizeFindManyResponse.apply(this, arguments);
        case 'query':
          return this.normalizeQueryResponse.apply(this, arguments);
        case 'createRecord':
          return this.normalizeCreateRecordResponse.apply(this, arguments);
        case 'deleteRecord':
          return this.normalizeDeleteRecordResponse.apply(this, arguments);
        case 'updateRecord':
          return this.normalizeUpdateRecordResponse.apply(this, arguments);
      }
    },

    /**
      @method normalizeFindRecordResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @return {Object} JSON-API Document
    */
    normalizeFindRecordResponse: function normalizeFindRecordResponse(store, primaryModelClass, payload, id, requestType) {
      return this.normalizeSingleResponse.apply(this, arguments);
    },

    /**
      @method normalizeQueryRecordResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @return {Object} JSON-API Document
    */
    normalizeQueryRecordResponse: function normalizeQueryRecordResponse(store, primaryModelClass, payload, id, requestType) {
      return this.normalizeSingleResponse.apply(this, arguments);
    },

    /**
      @method normalizeFindAllResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @return {Object} JSON-API Document
    */
    normalizeFindAllResponse: function normalizeFindAllResponse(store, primaryModelClass, payload, id, requestType) {
      return this.normalizeArrayResponse.apply(this, arguments);
    },

    /**
      @method normalizeFindBelongsToResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @return {Object} JSON-API Document
    */
    normalizeFindBelongsToResponse: function normalizeFindBelongsToResponse(store, primaryModelClass, payload, id, requestType) {
      return this.normalizeSingleResponse.apply(this, arguments);
    },

    /**
      @method normalizeFindHasManyResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @return {Object} JSON-API Document
    */
    normalizeFindHasManyResponse: function normalizeFindHasManyResponse(store, primaryModelClass, payload, id, requestType) {
      return this.normalizeArrayResponse.apply(this, arguments);
    },

    /**
      @method normalizeFindManyResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @return {Object} JSON-API Document
    */
    normalizeFindManyResponse: function normalizeFindManyResponse(store, primaryModelClass, payload, id, requestType) {
      return this.normalizeArrayResponse.apply(this, arguments);
    },

    /**
      @method normalizeQueryResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @return {Object} JSON-API Document
    */
    normalizeQueryResponse: function normalizeQueryResponse(store, primaryModelClass, payload, id, requestType) {
      return this.normalizeArrayResponse.apply(this, arguments);
    },

    /**
      @method normalizeCreateRecordResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @return {Object} JSON-API Document
    */
    normalizeCreateRecordResponse: function normalizeCreateRecordResponse(store, primaryModelClass, payload, id, requestType) {
      return this.normalizeSaveResponse.apply(this, arguments);
    },

    /**
      @method normalizeDeleteRecordResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @return {Object} JSON-API Document
    */
    normalizeDeleteRecordResponse: function normalizeDeleteRecordResponse(store, primaryModelClass, payload, id, requestType) {
      return this.normalizeSaveResponse.apply(this, arguments);
    },

    /**
      @method normalizeUpdateRecordResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @return {Object} JSON-API Document
    */
    normalizeUpdateRecordResponse: function normalizeUpdateRecordResponse(store, primaryModelClass, payload, id, requestType) {
      return this.normalizeSaveResponse.apply(this, arguments);
    },

    /**
      @method normalizeSaveResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @return {Object} JSON-API Document
    */
    normalizeSaveResponse: function normalizeSaveResponse(store, primaryModelClass, payload, id, requestType) {
      return this.normalizeSingleResponse.apply(this, arguments);
    },

    /**
      @method normalizeSingleResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @return {Object} JSON-API Document
    */
    normalizeSingleResponse: function normalizeSingleResponse(store, primaryModelClass, payload, id, requestType) {
      return this._normalizeResponse(store, primaryModelClass, payload, id, requestType, true);
    },

    /**
      @method normalizeArrayResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @return {Object} JSON-API Document
    */
    normalizeArrayResponse: function normalizeArrayResponse(store, primaryModelClass, payload, id, requestType) {
      return this._normalizeResponse(store, primaryModelClass, payload, id, requestType, false);
    },

    /**
      @method _normalizeResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @param {Boolean} isSingle
      @return {Object} JSON-API Document
      @private
    */
    _normalizeResponse: function _normalizeResponse(store, primaryModelClass, payload, id, requestType, isSingle) {
      var documentHash = {
        data: null,
        included: []
      };

      var meta = this.extractMeta(store, primaryModelClass, payload);
      if (meta) {
        (0, _emberDataPrivateDebug.assert)('The `meta` returned from `extractMeta` has to be an object, not "' + _ember['default'].typeOf(meta) + '".', _ember['default'].typeOf(meta) === 'object');
        documentHash.meta = meta;
      }

      if (isSingle) {
        var _normalize = this.normalize(primaryModelClass, payload);

        var data = _normalize.data;
        var included = _normalize.included;

        documentHash.data = data;
        if (included) {
          documentHash.included = included;
        }
      } else {
        var ret = new Array(payload.length);
        for (var i = 0, l = payload.length; i < l; i++) {
          var item = payload[i];

          var _normalize2 = this.normalize(primaryModelClass, item);

          var data = _normalize2.data;
          var included = _normalize2.included;

          if (included) {
            var _documentHash$included;

            (_documentHash$included = documentHash.included).push.apply(_documentHash$included, _toConsumableArray(included));
          }
          ret[i] = data;
        }

        documentHash.data = ret;
      }

      return documentHash;
    },

    /**
      Normalizes a part of the JSON payload returned by
      the server. You should override this method, munge the hash
      and call super if you have generic normalization to do.
       It takes the type of the record that is being normalized
      (as a DS.Model class), the property where the hash was
      originally found, and the hash to normalize.
       You can use this method, for example, to normalize underscored keys to camelized
      or other general-purpose normalizations.
       Example
       ```app/serializers/application.js
      import DS from 'ember-data';
       export default DS.JSONSerializer.extend({
        normalize: function(typeClass, hash) {
          var fields = Ember.get(typeClass, 'fields');
          fields.forEach(function(field) {
            var payloadField = Ember.String.underscore(field);
            if (field === payloadField) { return; }
             hash[field] = hash[payloadField];
            delete hash[payloadField];
          });
          return this._super.apply(this, arguments);
        }
      });
      ```
       @method normalize
      @param {DS.Model} typeClass
      @param {Object} hash
      @return {Object}
    */
    normalize: function normalize(modelClass, resourceHash) {
      var data = null;

      if (resourceHash) {
        this.normalizeUsingDeclaredMapping(modelClass, resourceHash);

        data = {
          id: this.extractId(modelClass, resourceHash),
          type: modelClass.modelName,
          attributes: this.extractAttributes(modelClass, resourceHash),
          relationships: this.extractRelationships(modelClass, resourceHash)
        };

        this.applyTransforms(modelClass, data.attributes);
      }

      return { data: data };
    },

    /**
      Returns the resource's ID.
       @method extractId
      @param {Object} modelClass
      @param {Object} resourceHash
      @return {String}
    */
    extractId: function extractId(modelClass, resourceHash) {
      var primaryKey = get(this, 'primaryKey');
      var id = resourceHash[primaryKey];
      return (0, _emberDataPrivateSystemCoerceId['default'])(id);
    },

    /**
      Returns the resource's attributes formatted as a JSON-API "attributes object".
       http://jsonapi.org/format/#document-resource-object-attributes
       @method extractAttributes
      @param {Object} modelClass
      @param {Object} resourceHash
      @return {Object}
    */
    extractAttributes: function extractAttributes(modelClass, resourceHash) {
      var _this2 = this;

      var attributeKey;
      var attributes = {};

      modelClass.eachAttribute(function (key) {
        attributeKey = _this2.keyForAttribute(key, 'deserialize');
        if (resourceHash.hasOwnProperty(attributeKey)) {
          attributes[key] = resourceHash[attributeKey];
        }
      });

      return attributes;
    },

    /**
      Returns a relationship formatted as a JSON-API "relationship object".
       http://jsonapi.org/format/#document-resource-object-relationships
       @method extractRelationship
      @param {Object} relationshipModelName
      @param {Object} relationshipHash
      @return {Object}
    */
    extractRelationship: function extractRelationship(relationshipModelName, relationshipHash) {
      if (_ember['default'].isNone(relationshipHash)) {
        return null;
      }
      /*
        When `relationshipHash` is an object it usually means that the relationship
        is polymorphic. It could however also be embedded resources that the
        EmbeddedRecordsMixin has be able to process.
      */
      if (_ember['default'].typeOf(relationshipHash) === 'object') {
        if (relationshipHash.id) {
          relationshipHash.id = (0, _emberDataPrivateSystemCoerceId['default'])(relationshipHash.id);
        }

        var modelClass = this.store.modelFor(relationshipModelName);
        if (relationshipHash.type && !(0, _emberDataPrivateUtils.modelHasAttributeOrRelationshipNamedType)(modelClass)) {
          relationshipHash.type = this.modelNameFromPayloadKey(relationshipHash.type);
        }
        return relationshipHash;
      }
      return { id: (0, _emberDataPrivateSystemCoerceId['default'])(relationshipHash), type: relationshipModelName };
    },

    /**
      Returns a polymorphic relationship formatted as a JSON-API "relationship object".
       http://jsonapi.org/format/#document-resource-object-relationships
       `relationshipOptions` is a hash which contains more information about the
      polymorphic relationship which should be extracted:
        - `resourceHash` complete hash of the resource the relationship should be
          extracted from
        - `relationshipKey` key under which the value for the relationship is
          extracted from the resourceHash
        - `relationshipMeta` meta information about the relationship
       @method extractPolymorphicRelationship
      @param {Object} relationshipModelName
      @param {Object} relationshipHash
      @param {Object} relationshipOptions
      @return {Object}
    */
    extractPolymorphicRelationship: function extractPolymorphicRelationship(relationshipModelName, relationshipHash, relationshipOptions) {
      return this.extractRelationship(relationshipModelName, relationshipHash);
    },

    /**
      Returns the resource's relationships formatted as a JSON-API "relationships object".
       http://jsonapi.org/format/#document-resource-object-relationships
       @method extractRelationships
      @param {Object} modelClass
      @param {Object} resourceHash
      @return {Object}
    */
    extractRelationships: function extractRelationships(modelClass, resourceHash) {
      var _this3 = this;

      var relationships = {};

      modelClass.eachRelationship(function (key, relationshipMeta) {
        var relationship = null;
        var relationshipKey = _this3.keyForRelationship(key, relationshipMeta.kind, 'deserialize');
        if (resourceHash.hasOwnProperty(relationshipKey)) {
          var data = null;
          var relationshipHash = resourceHash[relationshipKey];
          if (relationshipMeta.kind === 'belongsTo') {
            if (relationshipMeta.options.polymorphic) {
              // extracting a polymorphic belongsTo may need more information
              // than the type and the hash (which might only be an id) for the
              // relationship, hence we pass the key, resource and
              // relationshipMeta too
              data = _this3.extractPolymorphicRelationship(relationshipMeta.type, relationshipHash, { key: key, resourceHash: resourceHash, relationshipMeta: relationshipMeta });
            } else {
              data = _this3.extractRelationship(relationshipMeta.type, relationshipHash);
            }
          } else if (relationshipMeta.kind === 'hasMany') {
            if (!_ember['default'].isNone(relationshipHash)) {
              data = new Array(relationshipHash.length);
              for (var i = 0, l = relationshipHash.length; i < l; i++) {
                var item = relationshipHash[i];
                data[i] = _this3.extractRelationship(relationshipMeta.type, item);
              }
            }
          }
          relationship = { data: data };
        }

        var linkKey = _this3.keyForLink(key, relationshipMeta.kind);
        if (resourceHash.links && resourceHash.links.hasOwnProperty(linkKey)) {
          var related = resourceHash.links[linkKey];
          relationship = relationship || {};
          relationship.links = { related: related };
        }

        if (relationship) {
          relationships[key] = relationship;
        }
      });

      return relationships;
    },

    /**
      @method modelNameFromPayloadKey
      @param {String} key
      @return {String} the model's modelName
    */
    modelNameFromPayloadKey: function modelNameFromPayloadKey(key) {
      return (0, _emberDataPrivateSystemNormalizeModelName['default'])(key);
    },

    /**
      @method normalizeAttributes
      @private
    */
    normalizeAttributes: function normalizeAttributes(typeClass, hash) {
      var _this4 = this;

      var payloadKey;

      if (this.keyForAttribute) {
        typeClass.eachAttribute(function (key) {
          payloadKey = _this4.keyForAttribute(key, 'deserialize');
          if (key === payloadKey) {
            return;
          }
          if (!hash.hasOwnProperty(payloadKey)) {
            return;
          }

          hash[key] = hash[payloadKey];
          delete hash[payloadKey];
        });
      }
    },

    /**
      @method normalizeRelationships
      @private
    */
    normalizeRelationships: function normalizeRelationships(typeClass, hash) {
      var _this5 = this;

      var payloadKey;

      if (this.keyForRelationship) {
        typeClass.eachRelationship(function (key, relationship) {
          payloadKey = _this5.keyForRelationship(key, relationship.kind, 'deserialize');
          if (key === payloadKey) {
            return;
          }
          if (!hash.hasOwnProperty(payloadKey)) {
            return;
          }

          hash[key] = hash[payloadKey];
          delete hash[payloadKey];
        });
      }
    },

    /**
      @method normalizeUsingDeclaredMapping
      @private
    */
    normalizeUsingDeclaredMapping: function normalizeUsingDeclaredMapping(modelClass, hash) {
      var attrs = get(this, 'attrs');
      var normalizedKey, payloadKey, key;

      if (attrs) {
        for (key in attrs) {
          normalizedKey = payloadKey = this._getMappedKey(key, modelClass);

          if (!hash.hasOwnProperty(payloadKey)) {
            continue;
          }

          if (get(modelClass, 'attributes').has(key)) {
            normalizedKey = this.keyForAttribute(key);
          }

          if (get(modelClass, 'relationshipsByName').has(key)) {
            normalizedKey = this.keyForRelationship(key);
          }

          if (payloadKey !== normalizedKey) {
            hash[normalizedKey] = hash[payloadKey];
            delete hash[payloadKey];
          }
        }
      }
    },

    /**
      Looks up the property key that was set by the custom `attr` mapping
      passed to the serializer.
       @method _getMappedKey
      @private
      @param {String} key
      @return {String} key
    */
    _getMappedKey: function _getMappedKey(key, modelClass) {
      (0, _emberDataPrivateDebug.warn)('There is no attribute or relationship with the name `' + key + '` on `' + modelClass.modelName + '`. Check your serializers attrs hash.', get(modelClass, 'attributes').has(key) || get(modelClass, 'relationshipsByName').has(key), {
        id: 'ds.serializer.no-mapped-attrs-key'
      });

      var attrs = get(this, 'attrs');
      var mappedKey;
      if (attrs && attrs[key]) {
        mappedKey = attrs[key];
        //We need to account for both the { title: 'post_title' } and
        //{ title: { key: 'post_title' }} forms
        if (mappedKey.key) {
          mappedKey = mappedKey.key;
        }
        if (typeof mappedKey === 'string') {
          key = mappedKey;
        }
      }

      return key;
    },

    /**
      Check attrs.key.serialize property to inform if the `key`
      can be serialized
       @method _canSerialize
      @private
      @param {String} key
      @return {boolean} true if the key can be serialized
    */
    _canSerialize: function _canSerialize(key) {
      var attrs = get(this, 'attrs');

      return !attrs || !attrs[key] || attrs[key].serialize !== false;
    },

    /**
      When attrs.key.serialize is set to true then
      it takes priority over the other checks and the related
      attribute/relationship will be serialized
       @method _mustSerialize
      @private
      @param {String} key
      @return {boolean} true if the key must be serialized
    */
    _mustSerialize: function _mustSerialize(key) {
      var attrs = get(this, 'attrs');

      return attrs && attrs[key] && attrs[key].serialize === true;
    },

    /**
      Check if the given hasMany relationship should be serialized
       @method _shouldSerializeHasMany
      @private
      @param {DS.Snapshot} snapshot
      @param {String} key
      @param {String} relationshipType
      @return {boolean} true if the hasMany relationship should be serialized
    */
    _shouldSerializeHasMany: function _shouldSerializeHasMany(snapshot, key, relationship) {
      var relationshipType = snapshot.type.determineRelationshipType(relationship, this.store);
      if (this._mustSerialize(key)) {
        return true;
      }
      return this._canSerialize(key) && (relationshipType === 'manyToNone' || relationshipType === 'manyToMany');
    },

    // SERIALIZE
    /**
      Called when a record is saved in order to convert the
      record into JSON.
       By default, it creates a JSON object with a key for
      each attribute and belongsTo relationship.
       For example, consider this model:
       ```app/models/comment.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        title: DS.attr(),
        body: DS.attr(),
         author: DS.belongsTo('user')
      });
      ```
       The default serialization would create a JSON object like:
       ```javascript
      {
        "title": "Rails is unagi",
        "body": "Rails? Omakase? O_O",
        "author": 12
      }
      ```
       By default, attributes are passed through as-is, unless
      you specified an attribute type (`DS.attr('date')`). If
      you specify a transform, the JavaScript value will be
      serialized when inserted into the JSON hash.
       By default, belongs-to relationships are converted into
      IDs when inserted into the JSON hash.
       ## IDs
       `serialize` takes an options hash with a single option:
      `includeId`. If this option is `true`, `serialize` will,
      by default include the ID in the JSON object it builds.
       The adapter passes in `includeId: true` when serializing
      a record for `createRecord`, but not for `updateRecord`.
       ## Customization
       Your server may expect a different JSON format than the
      built-in serialization format.
       In that case, you can implement `serialize` yourself and
      return a JSON hash of your choosing.
       ```app/serializers/post.js
      import DS from 'ember-data';
       export default DS.JSONSerializer.extend({
        serialize: function(snapshot, options) {
          var json = {
            POST_TTL: snapshot.attr('title'),
            POST_BDY: snapshot.attr('body'),
            POST_CMS: snapshot.hasMany('comments', { ids: true })
          }
           if (options.includeId) {
            json.POST_ID_ = snapshot.id;
          }
           return json;
        }
      });
      ```
       ## Customizing an App-Wide Serializer
       If you want to define a serializer for your entire
      application, you'll probably want to use `eachAttribute`
      and `eachRelationship` on the record.
       ```app/serializers/application.js
      import DS from 'ember-data';
       export default DS.JSONSerializer.extend({
        serialize: function(snapshot, options) {
          var json = {};
           snapshot.eachAttribute(function(name) {
            json[serverAttributeName(name)] = snapshot.attr(name);
          })
           snapshot.eachRelationship(function(name, relationship) {
            if (relationship.kind === 'hasMany') {
              json[serverHasManyName(name)] = snapshot.hasMany(name, { ids: true });
            }
          });
           if (options.includeId) {
            json.ID_ = snapshot.id;
          }
           return json;
        }
      });
       function serverAttributeName(attribute) {
        return attribute.underscore().toUpperCase();
      }
       function serverHasManyName(name) {
        return serverAttributeName(name.singularize()) + "_IDS";
      }
      ```
       This serializer will generate JSON that looks like this:
       ```javascript
      {
        "TITLE": "Rails is omakase",
        "BODY": "Yep. Omakase.",
        "COMMENT_IDS": [ 1, 2, 3 ]
      }
      ```
       ## Tweaking the Default JSON
       If you just want to do some small tweaks on the default JSON,
      you can call super first and make the tweaks on the returned
      JSON.
       ```app/serializers/post.js
      import DS from 'ember-data';
       export default DS.JSONSerializer.extend({
        serialize: function(snapshot, options) {
          var json = this._super.apply(this, arguments);
           json.subject = json.title;
          delete json.title;
           return json;
        }
      });
      ```
       @method serialize
      @param {DS.Snapshot} snapshot
      @param {Object} options
      @return {Object} json
    */
    serialize: function serialize(snapshot, options) {
      var _this6 = this;

      var json = {};

      if (options && options.includeId) {
        var id = snapshot.id;

        if (id) {
          json[get(this, 'primaryKey')] = id;
        }
      }

      snapshot.eachAttribute(function (key, attribute) {
        _this6.serializeAttribute(snapshot, json, key, attribute);
      });

      snapshot.eachRelationship(function (key, relationship) {
        if (relationship.kind === 'belongsTo') {
          _this6.serializeBelongsTo(snapshot, json, relationship);
        } else if (relationship.kind === 'hasMany') {
          _this6.serializeHasMany(snapshot, json, relationship);
        }
      });

      return json;
    },

    /**
      You can use this method to customize how a serialized record is added to the complete
      JSON hash to be sent to the server. By default the JSON Serializer does not namespace
      the payload and just sends the raw serialized JSON object.
      If your server expects namespaced keys, you should consider using the RESTSerializer.
      Otherwise you can override this method to customize how the record is added to the hash.
      The hash property should be modified by reference.
       For example, your server may expect underscored root objects.
       ```app/serializers/application.js
      import DS from 'ember-data';
       export default DS.RESTSerializer.extend({
        serializeIntoHash: function(data, type, snapshot, options) {
          var root = Ember.String.decamelize(type.modelName);
          data[root] = this.serialize(snapshot, options);
        }
      });
      ```
       @method serializeIntoHash
      @param {Object} hash
      @param {DS.Model} typeClass
      @param {DS.Snapshot} snapshot
      @param {Object} options
    */
    serializeIntoHash: function serializeIntoHash(hash, typeClass, snapshot, options) {
      merge(hash, this.serialize(snapshot, options));
    },

    /**
     `serializeAttribute` can be used to customize how `DS.attr`
     properties are serialized
      For example if you wanted to ensure all your attributes were always
     serialized as properties on an `attributes` object you could
     write:
      ```app/serializers/application.js
     import DS from 'ember-data';
      export default DS.JSONSerializer.extend({
       serializeAttribute: function(snapshot, json, key, attributes) {
         json.attributes = json.attributes || {};
         this._super(snapshot, json.attributes, key, attributes);
       }
     });
     ```
      @method serializeAttribute
     @param {DS.Snapshot} snapshot
     @param {Object} json
     @param {String} key
     @param {Object} attribute
    */
    serializeAttribute: function serializeAttribute(snapshot, json, key, attribute) {
      var type = attribute.type;

      if (this._canSerialize(key)) {
        var value = snapshot.attr(key);
        if (type) {
          var transform = this.transformFor(type);
          value = transform.serialize(value);
        }

        // if provided, use the mapping provided by `attrs` in
        // the serializer
        var payloadKey = this._getMappedKey(key, snapshot.type);

        if (payloadKey === key && this.keyForAttribute) {
          payloadKey = this.keyForAttribute(key, 'serialize');
        }

        json[payloadKey] = value;
      }
    },

    /**
     `serializeBelongsTo` can be used to customize how `DS.belongsTo`
     properties are serialized.
      Example
      ```app/serializers/post.js
     import DS from 'ember-data';
      export default DS.JSONSerializer.extend({
       serializeBelongsTo: function(snapshot, json, relationship) {
         var key = relationship.key;
          var belongsTo = snapshot.belongsTo(key);
          key = this.keyForRelationship ? this.keyForRelationship(key, "belongsTo", "serialize") : key;
          json[key] = Ember.isNone(belongsTo) ? belongsTo : belongsTo.record.toJSON();
       }
     });
     ```
      @method serializeBelongsTo
     @param {DS.Snapshot} snapshot
     @param {Object} json
     @param {Object} relationship
    */
    serializeBelongsTo: function serializeBelongsTo(snapshot, json, relationship) {
      var key = relationship.key;

      if (this._canSerialize(key)) {
        var belongsToId = snapshot.belongsTo(key, { id: true });

        // if provided, use the mapping provided by `attrs` in
        // the serializer
        var payloadKey = this._getMappedKey(key, snapshot.type);
        if (payloadKey === key && this.keyForRelationship) {
          payloadKey = this.keyForRelationship(key, "belongsTo", "serialize");
        }

        //Need to check whether the id is there for new&async records
        if (isNone(belongsToId)) {
          json[payloadKey] = null;
        } else {
          json[payloadKey] = belongsToId;
        }

        if (relationship.options.polymorphic) {
          this.serializePolymorphicType(snapshot, json, relationship);
        }
      }
    },

    /**
     `serializeHasMany` can be used to customize how `DS.hasMany`
     properties are serialized.
      Example
      ```app/serializers/post.js
     import DS from 'ember-data';
      export default DS.JSONSerializer.extend({
       serializeHasMany: function(snapshot, json, relationship) {
         var key = relationship.key;
         if (key === 'comments') {
           return;
         } else {
           this._super.apply(this, arguments);
         }
       }
     });
     ```
      @method serializeHasMany
     @param {DS.Snapshot} snapshot
     @param {Object} json
     @param {Object} relationship
    */
    serializeHasMany: function serializeHasMany(snapshot, json, relationship) {
      var key = relationship.key;

      if (this._shouldSerializeHasMany(snapshot, key, relationship)) {
        var hasMany = snapshot.hasMany(key, { ids: true });
        if (hasMany !== undefined) {
          // if provided, use the mapping provided by `attrs` in
          // the serializer
          var payloadKey = this._getMappedKey(key, snapshot.type);
          if (payloadKey === key && this.keyForRelationship) {
            payloadKey = this.keyForRelationship(key, "hasMany", "serialize");
          }

          json[payloadKey] = hasMany;
          // TODO support for polymorphic manyToNone and manyToMany relationships
        }
      }
    },

    /**
      You can use this method to customize how polymorphic objects are
      serialized. Objects are considered to be polymorphic if
      `{ polymorphic: true }` is pass as the second argument to the
      `DS.belongsTo` function.
       Example
       ```app/serializers/comment.js
      import DS from 'ember-data';
       export default DS.JSONSerializer.extend({
        serializePolymorphicType: function(snapshot, json, relationship) {
          var key = relationship.key,
              belongsTo = snapshot.belongsTo(key);
          key = this.keyForAttribute ? this.keyForAttribute(key, "serialize") : key;
           if (Ember.isNone(belongsTo)) {
            json[key + "_type"] = null;
          } else {
            json[key + "_type"] = belongsTo.modelName;
          }
        }
      });
      ```
       @method serializePolymorphicType
      @param {DS.Snapshot} snapshot
      @param {Object} json
      @param {Object} relationship
    */
    serializePolymorphicType: _ember['default'].K,

    /**
      `extractMeta` is used to deserialize any meta information in the
      adapter payload. By default Ember Data expects meta information to
      be located on the `meta` property of the payload object.
       Example
       ```app/serializers/post.js
      import DS from 'ember-data';
       export default DS.JSONSerializer.extend({
        extractMeta: function(store, typeClass, payload) {
          if (payload && payload._pagination) {
            store.setMetadataFor(typeClass, payload._pagination);
            delete payload._pagination;
          }
        }
      });
      ```
       @method extractMeta
      @param {DS.Store} store
      @param {DS.Model} modelClass
      @param {Object} payload
    */
    extractMeta: function extractMeta(store, modelClass, payload) {
      if (payload && payload.hasOwnProperty('meta')) {
        var meta = payload.meta;
        delete payload.meta;
        return meta;
      }
    },

    /**
      `extractErrors` is used to extract model errors when a call is made
      to `DS.Model#save` which fails with an `InvalidError`. By default
      Ember Data expects error information to be located on the `errors`
      property of the payload object.
       Example
       ```app/serializers/post.js
      import DS from 'ember-data';
       export default DS.JSONSerializer.extend({
        extractErrors: function(store, typeClass, payload, id) {
          if (payload && typeof payload === 'object' && payload._problems) {
            payload = payload._problems;
            this.normalizeErrors(typeClass, payload);
          }
          return payload;
        }
      });
      ```
       @method extractErrors
      @param {DS.Store} store
      @param {DS.Model} typeClass
      @param {Object} payload
      @param {(String|Number)} id
      @return {Object} json The deserialized errors
    */
    extractErrors: function extractErrors(store, typeClass, payload, id) {
      var _this7 = this;

      if (payload && typeof payload === 'object' && payload.errors) {
        payload = (0, _emberDataPrivateAdaptersErrors.errorsArrayToHash)(payload.errors);

        this.normalizeUsingDeclaredMapping(typeClass, payload);

        typeClass.eachAttribute(function (name) {
          var key = _this7.keyForAttribute(name, 'deserialize');
          if (key !== name && payload.hasOwnProperty(key)) {
            payload[name] = payload[key];
            delete payload[key];
          }
        });

        typeClass.eachRelationship(function (name) {
          var key = _this7.keyForRelationship(name, 'deserialize');
          if (key !== name && payload.hasOwnProperty(key)) {
            payload[name] = payload[key];
            delete payload[key];
          }
        });
      }

      return payload;
    },

    /**
     `keyForAttribute` can be used to define rules for how to convert an
     attribute name in your model to a key in your JSON.
      Example
      ```app/serializers/application.js
     import DS from 'ember-data';
      export default DS.RESTSerializer.extend({
       keyForAttribute: function(attr, method) {
         return Ember.String.underscore(attr).toUpperCase();
       }
     });
     ```
      @method keyForAttribute
     @param {String} key
     @param {String} method
     @return {String} normalized key
    */
    keyForAttribute: function keyForAttribute(key, method) {
      return key;
    },

    /**
     `keyForRelationship` can be used to define a custom key when
     serializing and deserializing relationship properties. By default
     `JSONSerializer` does not provide an implementation of this method.
      Example
       ```app/serializers/post.js
      import DS from 'ember-data';
       export default DS.JSONSerializer.extend({
        keyForRelationship: function(key, relationship, method) {
          return 'rel_' + Ember.String.underscore(key);
        }
      });
      ```
      @method keyForRelationship
     @param {String} key
     @param {String} typeClass
     @param {String} method
     @return {String} normalized key
    */
    keyForRelationship: function keyForRelationship(key, typeClass, method) {
      return key;
    },

    /**
     `keyForLink` can be used to define a custom key when deserializing link
     properties.
      @method keyForLink
     @param {String} key
     @param {String} kind `belongsTo` or `hasMany`
     @return {String} normalized key
    */
    keyForLink: function keyForLink(key, kind) {
      return key;
    },

    // HELPERS

    /**
     @method transformFor
     @private
     @param {String} attributeType
     @param {Boolean} skipAssertion
     @return {DS.Transform} transform
    */
    transformFor: function transformFor(attributeType, skipAssertion) {
      var transform = (0, _emberDataPrivateUtils.getOwner)(this).lookup('transform:' + attributeType);

      (0, _emberDataPrivateDebug.assert)("Unable to find transform for '" + attributeType + "'", skipAssertion || !!transform);

      return transform;
    }
  });
});
define("ember-data/serializers/rest", ["exports", "ember", "ember-data/-private/debug", "ember-data/serializers/json", "ember-data/-private/system/normalize-model-name", "ember-inflector", "ember-data/-private/system/coerce-id", "ember-data/-private/utils"], function (exports, _ember, _emberDataPrivateDebug, _emberDataSerializersJson, _emberDataPrivateSystemNormalizeModelName, _emberInflector, _emberDataPrivateSystemCoerceId, _emberDataPrivateUtils) {
  "use strict";

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
    } else {
      return Array.from(arr);
    }
  }

  /**
    @module ember-data
  */

  var camelize = _ember["default"].String.camelize;

  /**
    Normally, applications will use the `RESTSerializer` by implementing
    the `normalize` method and individual normalizations under
    `normalizeHash`.
  
    This allows you to do whatever kind of munging you need, and is
    especially useful if your server is inconsistent and you need to
    do munging differently for many different kinds of responses.
  
    See the `normalize` documentation for more information.
  
    ## Across the Board Normalization
  
    There are also a number of hooks that you might find useful to define
    across-the-board rules for your payload. These rules will be useful
    if your server is consistent, or if you're building an adapter for
    an infrastructure service, like Parse, and want to encode service
    conventions.
  
    For example, if all of your keys are underscored and all-caps, but
    otherwise consistent with the names you use in your models, you
    can implement across-the-board rules for how to convert an attribute
    name in your model to a key in your JSON.
  
    ```app/serializers/application.js
    import DS from 'ember-data';
  
    export default DS.RESTSerializer.extend({
      keyForAttribute: function(attr, method) {
        return Ember.String.underscore(attr).toUpperCase();
      }
    });
    ```
  
    You can also implement `keyForRelationship`, which takes the name
    of the relationship as the first parameter, the kind of
    relationship (`hasMany` or `belongsTo`) as the second parameter, and
    the method (`serialize` or `deserialize`) as the third parameter.
  
    @class RESTSerializer
    @namespace DS
    @extends DS.JSONSerializer
  */
  var RESTSerializer = _emberDataSerializersJson["default"].extend({

    /**
     `keyForPolymorphicType` can be used to define a custom key when
     serializing and deserializing a polymorphic type. By default, the
     returned key is `${key}Type`.
      Example
       ```app/serializers/post.js
      import DS from 'ember-data';
       export default DS.RESTSerializer.extend({
        keyForPolymorphicType: function(key, relationship) {
          var relationshipKey = this.keyForRelationship(key);
           return 'type-' + relationshipKey;
        }
      });
      ```
      @method keyForPolymorphicType
     @param {String} key
     @param {String} typeClass
     @param {String} method
     @return {String} normalized key
    */
    keyForPolymorphicType: function keyForPolymorphicType(key, typeClass, method) {
      var relationshipKey = this.keyForRelationship(key);

      return relationshipKey + "Type";
    },

    /**
      Normalizes a part of the JSON payload returned by
      the server. You should override this method, munge the hash
      and call super if you have generic normalization to do.
       It takes the type of the record that is being normalized
      (as a DS.Model class), the property where the hash was
      originally found, and the hash to normalize.
       For example, if you have a payload that looks like this:
       ```js
      {
        "post": {
          "id": 1,
          "title": "Rails is omakase",
          "comments": [ 1, 2 ]
        },
        "comments": [{
          "id": 1,
          "body": "FIRST"
        }, {
          "id": 2,
          "body": "Rails is unagi"
        }]
      }
      ```
       The `normalize` method will be called three times:
       * With `App.Post`, `"posts"` and `{ id: 1, title: "Rails is omakase", ... }`
      * With `App.Comment`, `"comments"` and `{ id: 1, body: "FIRST" }`
      * With `App.Comment`, `"comments"` and `{ id: 2, body: "Rails is unagi" }`
       You can use this method, for example, to normalize underscored keys to camelized
      or other general-purpose normalizations.
       If you want to do normalizations specific to some part of the payload, you
      can specify those under `normalizeHash`.
       For example, if the `IDs` under `"comments"` are provided as `_id` instead of
      `id`, you can specify how to normalize just the comments:
       ```app/serializers/post.js
      import DS from 'ember-data';
       export default DS.RESTSerializer.extend({
        normalizeHash: {
          comments: function(hash) {
            hash.id = hash._id;
            delete hash._id;
            return hash;
          }
        }
      });
      ```
       The key under `normalizeHash` is just the original key that was in the original
      payload.
       @method normalize
      @param {DS.Model} modelClass
      @param {Object} resourceHash
      @param {String} prop
      @return {Object}
    */
    normalize: function normalize(modelClass, resourceHash, prop) {
      if (this.normalizeHash && this.normalizeHash[prop]) {
        this.normalizeHash[prop](resourceHash);
      }
      return this._super(modelClass, resourceHash, prop);
    },

    /**
      Normalizes an array of resource payloads and returns a JSON-API Document
      with primary data and, if any, included data as `{ data, included }`.
       @method _normalizeArray
      @param {DS.Store} store
      @param {String} modelName
      @param {Object} arrayHash
      @param {String} prop
      @return {Object}
      @private
    */
    _normalizeArray: function _normalizeArray(store, modelName, arrayHash, prop) {
      var _this = this;

      var documentHash = {
        data: [],
        included: []
      };

      var modelClass = store.modelFor(modelName);
      var serializer = store.serializerFor(modelName);

      /*jshint loopfunc:true*/
      arrayHash.forEach(function (hash) {
        var _normalizePolymorphicRecord2 = _this._normalizePolymorphicRecord(store, hash, prop, modelClass, serializer);

        var data = _normalizePolymorphicRecord2.data;
        var included = _normalizePolymorphicRecord2.included;

        documentHash.data.push(data);
        if (included) {
          var _documentHash$included;

          (_documentHash$included = documentHash.included).push.apply(_documentHash$included, _toConsumableArray(included));
        }
      });

      return documentHash;
    },

    _normalizePolymorphicRecord: function _normalizePolymorphicRecord(store, hash, prop, primaryModelClass, primarySerializer) {
      var serializer = undefined,
          modelClass = undefined;
      var primaryHasTypeAttribute = (0, _emberDataPrivateUtils.modelHasAttributeOrRelationshipNamedType)(primaryModelClass);
      // Support polymorphic records in async relationships
      if (!primaryHasTypeAttribute && hash.type && store._hasModelFor(this.modelNameFromPayloadKey(hash.type))) {
        serializer = store.serializerFor(hash.type);
        modelClass = store.modelFor(hash.type);
      } else {
        serializer = primarySerializer;
        modelClass = primaryModelClass;
      }
      return serializer.normalize(modelClass, hash, prop);
    },

    /*
      @method _normalizeResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @param {Boolean} isSingle
      @return {Object} JSON-API Document
      @private
    */
    _normalizeResponse: function _normalizeResponse(store, primaryModelClass, payload, id, requestType, isSingle) {
      var documentHash = {
        data: null,
        included: []
      };

      var meta = this.extractMeta(store, primaryModelClass, payload);
      if (meta) {
        (0, _emberDataPrivateDebug.assert)('The `meta` returned from `extractMeta` has to be an object, not "' + _ember["default"].typeOf(meta) + '".', _ember["default"].typeOf(meta) === 'object');
        documentHash.meta = meta;
      }

      var keys = Object.keys(payload);

      for (var i = 0, _length = keys.length; i < _length; i++) {
        var prop = keys[i];
        var modelName = prop;
        var forcedSecondary = false;

        /*
          If you want to provide sideloaded records of the same type that the
          primary data you can do that by prefixing the key with `_`.
           Example
           ```
          {
            users: [
              { id: 1, title: 'Tom', manager: 3 },
              { id: 2, title: 'Yehuda', manager: 3 }
            ],
            _users: [
              { id: 3, title: 'Tomster' }
            ]
          }
          ```
           This forces `_users` to be added to `included` instead of `data`.
         */
        if (prop.charAt(0) === '_') {
          forcedSecondary = true;
          modelName = prop.substr(1);
        }

        var typeName = this.modelNameFromPayloadKey(modelName);
        if (!store.modelFactoryFor(typeName)) {
          (0, _emberDataPrivateDebug.warn)(this.warnMessageNoModelForKey(modelName, typeName), false, {
            id: 'ds.serializer.model-for-key-missing'
          });
          continue;
        }

        var isPrimary = !forcedSecondary && this.isPrimaryType(store, typeName, primaryModelClass);
        var value = payload[prop];

        if (value === null) {
          continue;
        }

        /*
          Support primary data as an object instead of an array.
           Example
           ```
          {
            user: { id: 1, title: 'Tom', manager: 3 }
          }
          ```
         */
        if (isPrimary && _ember["default"].typeOf(value) !== 'array') {
          var _normalizePolymorphicRecord3 = this._normalizePolymorphicRecord(store, value, prop, primaryModelClass, this);

          var _data = _normalizePolymorphicRecord3.data;
          var _included = _normalizePolymorphicRecord3.included;

          documentHash.data = _data;
          if (_included) {
            var _documentHash$included2;

            (_documentHash$included2 = documentHash.included).push.apply(_documentHash$included2, _toConsumableArray(_included));
          }
          continue;
        }

        var _normalizeArray2 = this._normalizeArray(store, typeName, value, prop);

        var data = _normalizeArray2.data;
        var included = _normalizeArray2.included;

        if (included) {
          var _documentHash$included3;

          (_documentHash$included3 = documentHash.included).push.apply(_documentHash$included3, _toConsumableArray(included));
        }

        if (isSingle) {
          /*jshint loopfunc:true*/
          data.forEach(function (resource) {

            /*
              Figures out if this is the primary record or not.
               It's either:
               1. The record with the same ID as the original request
              2. If it's a newly created record without an ID, the first record
                 in the array
             */
            var isUpdatedRecord = isPrimary && (0, _emberDataPrivateSystemCoerceId["default"])(resource.id) === id;
            var isFirstCreatedRecord = isPrimary && !id && !documentHash.data;

            if (isFirstCreatedRecord || isUpdatedRecord) {
              documentHash.data = resource;
            } else {
              documentHash.included.push(resource);
            }
          });
        } else {
          if (isPrimary) {
            documentHash.data = data;
          } else {
            if (data) {
              var _documentHash$included4;

              (_documentHash$included4 = documentHash.included).push.apply(_documentHash$included4, _toConsumableArray(data));
            }
          }
        }
      }

      return documentHash;
    },

    isPrimaryType: function isPrimaryType(store, typeName, primaryTypeClass) {
      var typeClass = store.modelFor(typeName);
      return typeClass.modelName === primaryTypeClass.modelName;
    },

    /**
      This method allows you to push a payload containing top-level
      collections of records organized per type.
       ```js
      {
        "posts": [{
          "id": "1",
          "title": "Rails is omakase",
          "author", "1",
          "comments": [ "1" ]
        }],
        "comments": [{
          "id": "1",
          "body": "FIRST"
        }],
        "users": [{
          "id": "1",
          "name": "@d2h"
        }]
      }
      ```
       It will first normalize the payload, so you can use this to push
      in data streaming in from your server structured the same way
      that fetches and saves are structured.
       @method pushPayload
      @param {DS.Store} store
      @param {Object} payload
    */
    pushPayload: function pushPayload(store, payload) {
      var documentHash = {
        data: [],
        included: []
      };

      for (var prop in payload) {
        var modelName = this.modelNameFromPayloadKey(prop);
        if (!store.modelFactoryFor(modelName)) {
          (0, _emberDataPrivateDebug.warn)(this.warnMessageNoModelForKey(prop, modelName), false, {
            id: 'ds.serializer.model-for-key-missing'
          });
          continue;
        }
        var type = store.modelFor(modelName);
        var typeSerializer = store.serializerFor(type.modelName);

        /*jshint loopfunc:true*/
        _ember["default"].makeArray(payload[prop]).forEach(function (hash) {
          var _typeSerializer$normalize = typeSerializer.normalize(type, hash, prop);

          var data = _typeSerializer$normalize.data;
          var included = _typeSerializer$normalize.included;

          documentHash.data.push(data);
          if (included) {
            var _documentHash$included5;

            (_documentHash$included5 = documentHash.included).push.apply(_documentHash$included5, _toConsumableArray(included));
          }
        });
      }

      store.push(documentHash);
    },

    /**
      This method is used to convert each JSON root key in the payload
      into a modelName that it can use to look up the appropriate model for
      that part of the payload.
       For example, your server may send a model name that does not correspond with
      the name of the model in your app. Let's take a look at an example model,
      and an example payload:
       ```app/models/post.js
      import DS from 'ember-data';
       export default DS.Model.extend({
      });
      ```
       ```javascript
        {
          "blog/post": {
            "id": "1
          }
        }
      ```
       Ember Data is going to normalize the payload's root key for the modelName. As a result,
      it will try to look up the "blog/post" model. Since we don't have a model called "blog/post"
      (or a file called app/models/blog/post.js in ember-cli), Ember Data will throw an error
      because it cannot find the "blog/post" model.
       Since we want to remove this namespace, we can define a serializer for the application that will
      remove "blog/" from the payload key whenver it's encountered by Ember Data:
       ```app/serializers/application.js
      import DS from 'ember-data';
       export default DS.RESTSerializer.extend({
        modelNameFromPayloadKey: function(payloadKey) {
          if (payloadKey === 'blog/post') {
            return this._super(payloadKey.replace('blog/', ''));
          } else {
           return this._super(payloadKey);
          }
        }
      });
      ```
       After refreshing, Ember Data will appropriately look up the "post" model.
       By default the modelName for a model is its
      name in dasherized form. This means that a payload key like "blogPost" would be
      normalized to "blog-post" when Ember Data looks up the model. Usually, Ember Data
      can use the correct inflection to do this for you. Most of the time, you won't
      need to override `modelNameFromPayloadKey` for this purpose.
       @method modelNameFromPayloadKey
      @param {String} key
      @return {String} the model's modelName
    */
    modelNameFromPayloadKey: function modelNameFromPayloadKey(key) {
      return (0, _emberInflector.singularize)((0, _emberDataPrivateSystemNormalizeModelName["default"])(key));
    },

    // SERIALIZE

    /**
      Called when a record is saved in order to convert the
      record into JSON.
       By default, it creates a JSON object with a key for
      each attribute and belongsTo relationship.
       For example, consider this model:
       ```app/models/comment.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        title: DS.attr(),
        body: DS.attr(),
         author: DS.belongsTo('user')
      });
      ```
       The default serialization would create a JSON object like:
       ```js
      {
        "title": "Rails is unagi",
        "body": "Rails? Omakase? O_O",
        "author": 12
      }
      ```
       By default, attributes are passed through as-is, unless
      you specified an attribute type (`DS.attr('date')`). If
      you specify a transform, the JavaScript value will be
      serialized when inserted into the JSON hash.
       By default, belongs-to relationships are converted into
      IDs when inserted into the JSON hash.
       ## IDs
       `serialize` takes an options hash with a single option:
      `includeId`. If this option is `true`, `serialize` will,
      by default include the ID in the JSON object it builds.
       The adapter passes in `includeId: true` when serializing
      a record for `createRecord`, but not for `updateRecord`.
       ## Customization
       Your server may expect a different JSON format than the
      built-in serialization format.
       In that case, you can implement `serialize` yourself and
      return a JSON hash of your choosing.
       ```app/serializers/post.js
      import DS from 'ember-data';
       export default DS.RESTSerializer.extend({
        serialize: function(snapshot, options) {
          var json = {
            POST_TTL: snapshot.attr('title'),
            POST_BDY: snapshot.attr('body'),
            POST_CMS: snapshot.hasMany('comments', { ids: true })
          }
           if (options.includeId) {
            json.POST_ID_ = snapshot.id;
          }
           return json;
        }
      });
      ```
       ## Customizing an App-Wide Serializer
       If you want to define a serializer for your entire
      application, you'll probably want to use `eachAttribute`
      and `eachRelationship` on the record.
       ```app/serializers/application.js
      import DS from 'ember-data';
       export default DS.RESTSerializer.extend({
        serialize: function(snapshot, options) {
          var json = {};
           snapshot.eachAttribute(function(name) {
            json[serverAttributeName(name)] = snapshot.attr(name);
          })
           snapshot.eachRelationship(function(name, relationship) {
            if (relationship.kind === 'hasMany') {
              json[serverHasManyName(name)] = snapshot.hasMany(name, { ids: true });
            }
          });
           if (options.includeId) {
            json.ID_ = snapshot.id;
          }
           return json;
        }
      });
       function serverAttributeName(attribute) {
        return attribute.underscore().toUpperCase();
      }
       function serverHasManyName(name) {
        return serverAttributeName(name.singularize()) + "_IDS";
      }
      ```
       This serializer will generate JSON that looks like this:
       ```js
      {
        "TITLE": "Rails is omakase",
        "BODY": "Yep. Omakase.",
        "COMMENT_IDS": [ 1, 2, 3 ]
      }
      ```
       ## Tweaking the Default JSON
       If you just want to do some small tweaks on the default JSON,
      you can call super first and make the tweaks on the returned
      JSON.
       ```app/serializers/post.js
      import DS from 'ember-data';
       export default DS.RESTSerializer.extend({
        serialize: function(snapshot, options) {
          var json = this._super(snapshot, options);
           json.subject = json.title;
          delete json.title;
           return json;
        }
      });
      ```
       @method serialize
      @param {DS.Snapshot} snapshot
      @param {Object} options
      @return {Object} json
    */
    serialize: function serialize(snapshot, options) {
      return this._super.apply(this, arguments);
    },

    /**
      You can use this method to customize the root keys serialized into the JSON.
      The hash property should be modified by reference (possibly using something like _.extend)
      By default the REST Serializer sends the modelName of a model, which is a camelized
      version of the name.
       For example, your server may expect underscored root objects.
       ```app/serializers/application.js
      import DS from 'ember-data';
       export default DS.RESTSerializer.extend({
        serializeIntoHash: function(data, type, record, options) {
          var root = Ember.String.decamelize(type.modelName);
          data[root] = this.serialize(record, options);
        }
      });
      ```
       @method serializeIntoHash
      @param {Object} hash
      @param {DS.Model} typeClass
      @param {DS.Snapshot} snapshot
      @param {Object} options
    */
    serializeIntoHash: function serializeIntoHash(hash, typeClass, snapshot, options) {
      var normalizedRootKey = this.payloadKeyFromModelName(typeClass.modelName);
      hash[normalizedRootKey] = this.serialize(snapshot, options);
    },

    /**
      You can use `payloadKeyFromModelName` to override the root key for an outgoing
      request. By default, the RESTSerializer returns a camelized version of the
      model's name.
       For a model called TacoParty, its `modelName` would be the string `taco-party`. The RESTSerializer
      will send it to the server with `tacoParty` as the root key in the JSON payload:
       ```js
      {
        "tacoParty": {
          "id": "1",
          "location": "Matthew Beale's House"
        }
      }
      ```
       For example, your server may expect dasherized root objects:
       ```app/serializers/application.js
      import DS from 'ember-data';
       export default DS.RESTSerializer.extend({
        payloadKeyFromModelName: function(modelName) {
          return Ember.String.dasherize(modelName);
        }
      });
      ```
       Given a `TacoParty' model, calling `save` on a tacoModel would produce an outgoing
      request like:
       ```js
      {
        "taco-party": {
          "id": "1",
          "location": "Matthew Beale's House"
        }
      }
      ```
       @method payloadKeyFromModelName
      @param {String} modelName
      @return {String}
    */
    payloadKeyFromModelName: function payloadKeyFromModelName(modelName) {
      return camelize(modelName);
    },

    /**
      You can use this method to customize how polymorphic objects are serialized.
      By default the REST Serializer creates the key by appending `Type` to
      the attribute and value from the model's camelcased model name.
       @method serializePolymorphicType
      @param {DS.Snapshot} snapshot
      @param {Object} json
      @param {Object} relationship
    */
    serializePolymorphicType: function serializePolymorphicType(snapshot, json, relationship) {
      var key = relationship.key;
      var belongsTo = snapshot.belongsTo(key);
      var typeKey = this.keyForPolymorphicType(key, relationship.type, 'serialize');

      // old way of getting the key for the polymorphic type
      key = this.keyForAttribute ? this.keyForAttribute(key, "serialize") : key;
      key = key + "Type";

      // The old way of serializing the type of a polymorphic record used
      // `keyForAttribute`, which is not correct. The next code checks if the old
      // way is used and if it differs from the new way of using
      // `keyForPolymorphicType`. If this is the case, a deprecation warning is
      // logged and the old way is restored (so nothing breaks).
      if (key !== typeKey && this.keyForPolymorphicType === RESTSerializer.prototype.keyForPolymorphicType) {
        (0, _emberDataPrivateDebug.deprecate)("The key to serialize the type of a polymorphic record is created via keyForAttribute which has been deprecated. Use the keyForPolymorphicType hook instead.", false, {
          id: 'ds.rest-serializer.deprecated-key-for-polymorphic-type',
          until: '3.0.0'
        });

        typeKey = key;
      }

      if (_ember["default"].isNone(belongsTo)) {
        json[typeKey] = null;
      } else {
        json[typeKey] = camelize(belongsTo.modelName);
      }
    },

    /**
      You can use this method to customize how a polymorphic relationship should
      be extracted.
       @method extractPolymorphicRelationship
      @param {Object} relationshipType
      @param {Object} relationshipHash
      @param {Object} relationshipOptions
      @return {Object}
     */
    extractPolymorphicRelationship: function extractPolymorphicRelationship(relationshipType, relationshipHash, relationshipOptions) {
      var key = relationshipOptions.key;
      var resourceHash = relationshipOptions.resourceHash;
      var relationshipMeta = relationshipOptions.relationshipMeta;

      // A polymorphic belongsTo relationship can be present in the payload
      // either in the form where the `id` and the `type` are given:
      //
      //   {
      //     message: { id: 1, type: 'post' }
      //   }
      //
      // or by the `id` and a `<relationship>Type` attribute:
      //
      //   {
      //     message: 1,
      //     messageType: 'post'
      //   }
      //
      // The next code checks if the latter case is present and returns the
      // corresponding JSON-API representation. The former case is handled within
      // the base class JSONSerializer.
      var isPolymorphic = relationshipMeta.options.polymorphic;
      var typeProperty = this.keyForPolymorphicType(key, relationshipType, 'deserialize');

      if (isPolymorphic && resourceHash.hasOwnProperty(typeProperty) && typeof relationshipHash !== 'object') {
        var type = this.modelNameFromPayloadKey(resourceHash[typeProperty]);
        return {
          id: relationshipHash,
          type: type
        };
      }

      return this._super.apply(this, arguments);
    }
  });

  (0, _emberDataPrivateDebug.runInDebug)(function () {
    RESTSerializer.reopen({
      warnMessageNoModelForKey: function warnMessageNoModelForKey(prop, typeKey) {
        return 'Encountered "' + prop + '" in payload, but no model was found for model name "' + typeKey + '" (resolved model name using ' + this.constructor.toString() + '.modelNameFromPayloadKey("' + prop + '"))';
      }
    });
  });

  exports["default"] = RESTSerializer;
});
define('ember-data/setup-container', ['exports', 'ember-data/-private/initializers/store', 'ember-data/-private/initializers/transforms', 'ember-data/-private/initializers/store-injections', 'ember-data/-private/initializers/data-adapter'], function (exports, _emberDataPrivateInitializersStore, _emberDataPrivateInitializersTransforms, _emberDataPrivateInitializersStoreInjections, _emberDataPrivateInitializersDataAdapter) {
  'use strict';

  exports['default'] = setupContainer;

  function setupContainer(application) {
    (0, _emberDataPrivateInitializersDataAdapter['default'])(application);
    (0, _emberDataPrivateInitializersTransforms['default'])(application);
    (0, _emberDataPrivateInitializersStoreInjections['default'])(application);
    (0, _emberDataPrivateInitializersStore['default'])(application);
  }
});
define("ember-data/store", ["exports", "ember-data/-private/system/store"], function (exports, _emberDataPrivateSystemStore) {
  "use strict";

  exports["default"] = _emberDataPrivateSystemStore["default"];
});
define('ember-data/transform', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  /**
    The `DS.Transform` class is used to serialize and deserialize model
    attributes when they are saved or loaded from an
    adapter. Subclassing `DS.Transform` is useful for creating custom
    attributes. All subclasses of `DS.Transform` must implement a
    `serialize` and a `deserialize` method.
  
    Example
  
    ```app/transforms/temperature.js
    import DS from 'ember-data';
  
    // Converts centigrade in the JSON to fahrenheit in the app
    export default DS.Transform.extend({
      deserialize: function(serialized) {
        return (serialized *  1.8) + 32;
      },
      serialize: function(deserialized) {
        return (deserialized - 32) / 1.8;
      }
    });
    ```
  
    Usage
  
    ```app/models/requirement.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      name: DS.attr('string'),
      temperature: DS.attr('temperature')
    });
    ```
  
    @class Transform
    @namespace DS
   */
  exports['default'] = _ember['default'].Object.extend({
    /**
      When given a deserialized value from a record attribute this
      method must return the serialized value.
       Example
       ```javascript
      serialize: function(deserialized) {
        return Ember.isEmpty(deserialized) ? null : Number(deserialized);
      }
      ```
       @method serialize
      @param deserialized The deserialized value
      @return The serialized value
    */
    serialize: null,

    /**
      When given a serialize value from a JSON object this method must
      return the deserialized value for the record attribute.
       Example
       ```javascript
      deserialize: function(serialized) {
        return empty(serialized) ? null : Number(serialized);
      }
      ```
       @method deserialize
      @param serialized The serialized value
      @return The deserialized value
    */
    deserialize: null
  });
});
define("ember-data/version", ["exports"], function (exports) {
  "use strict";

  exports["default"] = "2.3.3";
});
define('ember-form-master-2000/components/fm-checkbox', ['exports', 'ember', 'ember-form-master-2000/templates/components/ember-form-master-2000/fm-checkbox'], function (exports, _ember, _emberFormMaster2000TemplatesComponentsEmberFormMaster2000FmCheckbox) {
  'use strict';

  exports['default'] = _ember['default'].Component.extend({
    layout: _emberFormMaster2000TemplatesComponentsEmberFormMaster2000FmCheckbox['default'],
    classNameBindings: ['checkboxWrapperClass', 'errorClass'],
    fmConfig: _ember['default'].inject.service('fm-config'),
    checkboxWrapperClass: _ember['default'].computed.reads('fmConfig.checkboxWrapperClass'),
    errorClass: _ember['default'].computed('showErrors', 'fmConfig.errorClass', function () {
      if (this.get('showErrors')) {
        return this.get('fmConfig.errorClass');
      }
    }),

    shouldShowErrors: false,
    showErrors: _ember['default'].computed('shouldShowErrors', 'errors', function () {
      return this.get('shouldShowErrors') && !_ember['default'].isEmpty(this.get('errors'));
    }),

    change: function change() {
      this.send('userInteraction');
    },

    focusOut: function focusOut() {
      this.send('userInteraction');
    },

    actions: {
      userInteraction: function userInteraction() {
        this.set('shouldShowErrors', true);
      }
    }
  });
});
define('ember-form-master-2000/components/fm-errortext', ['exports', 'ember', 'ember-form-master-2000/templates/components/ember-form-master-2000/fm-errortext'], function (exports, _ember, _emberFormMaster2000TemplatesComponentsEmberFormMaster2000FmErrortext) {
  'use strict';

  exports['default'] = _ember['default'].Component.extend({
    layout: _emberFormMaster2000TemplatesComponentsEmberFormMaster2000FmErrortext['default'],
    tagName: 'span',
    classNameBindings: 'errortextClass',
    error: _ember['default'].computed('errors', function () {
      var errors = this.get('errors');
      var error = null;
      if (_ember['default'].isArray(errors) && errors.length > 0) {
        error = errors[0];
      }
      if (errors && typeof errors === 'object' && errors.message) {
        error = errors.message;
      }
      if (typeof errors === 'string') {
        error = errors;
      }
      return error;
    }),
    errortextClass: 'help-block'
  });
});
define('ember-form-master-2000/components/fm-field', ['exports', 'ember', 'ember-form-master-2000/templates/components/ember-form-master-2000/fm-field'], function (exports, _ember, _emberFormMaster2000TemplatesComponentsEmberFormMaster2000FmField) {
  'use strict';

  exports['default'] = _ember['default'].Component.extend({
    layout: _emberFormMaster2000TemplatesComponentsEmberFormMaster2000FmField['default'],
    value: null,

    fmConfig: _ember['default'].inject.service('fm-config'),

    inputClass: _ember['default'].computed.reads('fmConfig.inputClass'),
    labelClass: _ember['default'].computed.reads('fmConfig.labelClass'),
    textareaClass: _ember['default'].computed.reads('fmConfig.textareaClass'),
    wrapperClass: _ember['default'].computed.reads('fmConfig.wrapperClass'),

    init: function init() {
      if (!this.get('optionValuePath')) {
        this.set('optionValuePath', 'content.value');
      }
      if (!this.get('optionLabelPath')) {
        this.set('optionLabelPath', 'content.label');
      }
      var dataAttributes = Object.keys(this.get('attrs')).filter(function (attr) {
        return (/data-/.test(attr)
        );
      });
      this.set('dataAttributes', dataAttributes);

      this._super(arguments);
    },
    placeholder: null,
    label: null,
    classNameBindings: ['wrapperClass', 'errorClass'],
    errorClass: _ember['default'].computed('showErrors', 'fmConfig.errorClass', function () {
      if (this.get('showErrors')) {
        return this.get('fmConfig.errorClass');
      }
    }),
    isSelect: _ember['default'].computed('type', function () {
      return this.get('type') === 'select';
    }),
    isTextarea: _ember['default'].computed('type', function () {
      return this.get('type') === 'textarea';
    }),
    isBasicInput: _ember['default'].computed('type', function () {
      return !this.get('isSelect') && !this.get('isTextarea');
    }),
    forAttribute: _ember['default'].computed('label', 'inputId', function () {
      if (this.get('inputId')) {
        return this.generateSafeId(this.get('inputId'));
      }
      if (this.get('label')) {
        return this.generateSafeId(this.get('label'));
      }
    }),
    generateSafeId: function generateSafeId(id) {
      var tmp = document.createElement("DIV");
      tmp.innerHTML = id;
      id = tmp.textContent || tmp.innerText || "";
      id = id.replace(/[\.,\/#!$%\^&\*;:{}=\`'"~()]/g, "");
      id = id.replace(/\s/g, "-");
      return id;
    },

    actions: {
      selectAction: function selectAction(value) {
        if (this.attrs.action && typeof this.attrs.action === 'function') {
          this.attrs.action(value);
        } else {
          this.set('value', value);
        }
      },

      userInteraction: function userInteraction() {
        this.set('shouldShowErrors', true);
      }
    },
    shouldShowErrors: _ember['default'].computed('fmConfig.showErrorsByDefault', function () {
      return this.get('fmConfig.showErrorsByDefault');
    }),
    showErrors: _ember['default'].computed('shouldShowErrors', 'errors', function () {
      return this.get('shouldShowErrors') && !_ember['default'].isEmpty(this.get('errors'));
    })
  });
});
define('ember-form-master-2000/components/fm-form', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports['default'] = _ember['default'].Component.extend({
    init: function init() {
      this._super();
    },
    classNameBindings: ['formClass'],
    formClass: _ember['default'].computed.reads('fmConfig.formClass'),
    fmConfig: _ember['default'].inject.service('fm-config'),
    tagName: 'form',
    'for': null,
    submit: function submit(e) {
      e.preventDefault();
      this.get('childViews').forEach(function (chieldView) {
        if (chieldView.get('shouldShowErrors') === false) {
          chieldView.set('shouldShowErrors', true);
        }
      });
      this.sendAction('action', this.get('for'));
    }
  });
});
define('ember-form-master-2000/components/fm-helptext', ['exports', 'ember', 'ember-form-master-2000/templates/components/ember-form-master-2000/fm-helptext'], function (exports, _ember, _emberFormMaster2000TemplatesComponentsEmberFormMaster2000FmHelptext) {
  'use strict';

  exports['default'] = _ember['default'].Component.extend({
    layout: _emberFormMaster2000TemplatesComponentsEmberFormMaster2000FmHelptext['default'],
    tagName: 'span',
    classNameBindings: ['helptextClass'],
    fmConfig: _ember['default'].inject.service('fm-config'),
    helptextClass: _ember['default'].computed.reads('fmConfig.helptextClass')
  });
});
define('ember-form-master-2000/components/fm-input', ['exports', 'ember', 'ember-form-master-2000/mixins/data-attribute-support'], function (exports, _ember, _emberFormMaster2000MixinsDataAttributeSupport) {
  'use strict';

  exports['default'] = _ember['default'].TextField.extend(_emberFormMaster2000MixinsDataAttributeSupport['default'], {

    focusOut: function focusOut() {
      this.sendAction('onUserInteraction');
    },

    init: function init() {
      if (this.get('parentView.forAttribute')) {
        this.set('elementId', this.get('parentView.forAttribute'));
      }
      this._super(arguments);
      this.setDataAttributes();
    }

  });
});
define('ember-form-master-2000/components/fm-radio-group', ['exports', 'ember', 'ember-form-master-2000/templates/components/ember-form-master-2000/fm-radio-group'], function (exports, _ember, _emberFormMaster2000TemplatesComponentsEmberFormMaster2000FmRadioGroup) {
  'use strict';

  exports['default'] = _ember['default'].Component.extend({
    layout: _emberFormMaster2000TemplatesComponentsEmberFormMaster2000FmRadioGroup['default'],
    classNameBindings: ['radioGroupWrapperClass', 'errorClass'],
    fmConfig: _ember['default'].inject.service('fm-config'),
    errorClass: _ember['default'].computed('showErrors', 'fmConfig.errorClass', function () {
      if (this.get('showErrors')) {
        return this.get('fmConfig.errorClass');
      }
    }),
    radioGroupWrapperClass: _ember['default'].computed.reads('fmConfig.radioGroupWrapperClass'),
    labelClass: _ember['default'].computed.reads('fmConfig.labelClass'),

    shouldShowErrors: false,
    showErrors: _ember['default'].computed('errors', 'shouldShowErrors', function () {
      return this.get('shouldShowErrors') && !_ember['default'].isEmpty(this.get('errors'));
    }),

    actions: {
      userInteraction: function userInteraction() {
        this.set('shouldShowErrors', true);
      }
    }
  });
});
define('ember-form-master-2000/components/fm-radio', ['exports', 'ember', 'ember-form-master-2000/templates/components/ember-form-master-2000/fm-radio'], function (exports, _ember, _emberFormMaster2000TemplatesComponentsEmberFormMaster2000FmRadio) {
  'use strict';

  exports['default'] = _ember['default'].Component.extend({
    layout: _emberFormMaster2000TemplatesComponentsEmberFormMaster2000FmRadio['default'],
    classNameBindings: ['radioClass'],
    fmConfig: _ember['default'].inject.service('fm-config'),
    radioClass: _ember['default'].computed.reads('fmConfig.radioClass'),
    checked: _ember['default'].computed('parentView.value', function () {
      if (_ember['default'].isEmpty(this.get('content')) || _ember['default'].isEmpty(this.get('optionValuePath'))) {
        return false;
      }

      return this.get('parentView.value') === _ember['default'].get(this.get('content'), this.get('optionValuePath'));
    }),
    change: function change() {
      this.set('parentView.value', _ember['default'].get(this.get('content'), this.get('optionValuePath')));
      this.sendAction('onUserInteraction');
    },
    focusOut: function focusOut() {
      this.sendAction('onUserInteraction');
    },
    optionLabelPath: 'label',
    optionValuePath: 'value'
  });
});
define('ember-form-master-2000/components/fm-select', ['exports', 'ember', 'ember-form-master-2000/templates/components/ember-form-master-2000/fm-select'], function (exports, _ember, _emberFormMaster2000TemplatesComponentsEmberFormMaster2000FmSelect) {
  'use strict';

  exports['default'] = _ember['default'].Component.extend({
    layout: _emberFormMaster2000TemplatesComponentsEmberFormMaster2000FmSelect['default'],
    content: null,
    prompt: null,
    tagName: 'select',
    optionValuePath: 'value',
    optionLabelPath: 'label',
    action: _ember['default'].K,
    fmConfig: _ember['default'].inject.service('fm-config'),
    classNameBindings: ['selectClass'],
    selectClass: _ember['default'].computed.reads('fmConfig.selectClass'),

    // shadow the passed-in `selection` to avoid
    // leaking changes to it via a 2-way binding
    _selection: _ember['default'].computed.reads('selection'),

    init: function init() {
      this._super(arguments);

      if (this.get('parentView.forAttribute')) {
        this.set('elementId', this.get('parentView.forAttribute'));
        // this.set('')
        // console.log('setting id', this.get('elementId'));
      }
      if (!this.get('content')) {
        this.set('content', []);
      }
      if (this.get('value')) {
        this.set('selection', this.get('value'));
      }
    },

    change: function change() {
      this.send('change');
      this.sendAction('onUserInteraction');
      // console.log('changing');
    },

    didInsertElement: function didInsertElement() {
      if (this.get('parentView.forAttribute')) {}
    },

    actions: {
      change: function change() {
        var selectEl = this.$()[0];
        var selectedIndex = selectEl.selectedIndex;
        var content = this.get('content');

        // decrement index by 1 if we have a prompt
        var hasPrompt = !!this.get('prompt');
        var contentIndex = hasPrompt ? selectedIndex - 1 : selectedIndex;

        var selection = content.objectAt(contentIndex);

        // set the local, shadowed selection to avoid leaking
        // changes to `selection` out via 2-way binding
        this.set('_selection', selection);

        var path = this.get('optionValuePath');
        var value = path.length > 0 ? _ember['default'].get(selection, path) : selection;
        this.attrs.action(value);
      }
    },

    focusOut: function focusOut() {
      this.sendAction('onUserInteraction');
    }
  });
});
define('ember-form-master-2000/components/fm-submit', ['exports', 'ember', 'ember-form-master-2000/templates/components/ember-form-master-2000/fm-submit'], function (exports, _ember, _emberFormMaster2000TemplatesComponentsEmberFormMaster2000FmSubmit) {
  'use strict';

  exports['default'] = _ember['default'].Component.extend({
    layout: _emberFormMaster2000TemplatesComponentsEmberFormMaster2000FmSubmit['default'],
    classNameBindings: ['wrapperClass'],
    fmConfig: _ember['default'].inject.service('fm-config'),
    init: function init() {
      this._super(this);
    },
    submitButtonClass: _ember['default'].computed.reads('fmConfig.submitButtonClass'),
    wrapperClass: _ember['default'].computed.reads('fmConfig.wrapperClass'),
    tagName: 'div'
  });
});
define('ember-form-master-2000/components/fm-textarea', ['exports', 'ember', 'ember-form-master-2000/mixins/data-attribute-support'], function (exports, _ember, _emberFormMaster2000MixinsDataAttributeSupport) {
  'use strict';

  exports['default'] = _ember['default'].TextArea.extend(_emberFormMaster2000MixinsDataAttributeSupport['default'], {
    focusOut: function focusOut() {
      this.sendAction('onUserInteraction');
    },

    init: function init() {
      if (this.get('parentView.forAttribute')) {
        this.set('elementId', this.get('parentView.forAttribute'));
      }
      this._super(arguments);
      this.setDataAttributes();
    }

  });
});
define('ember-form-master-2000/helpers/is-equal', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  function isEqualHelper(params) {
    return params[0] === params[1];
  }

  var forExport = null;
  if (typeof _ember['default'].HTMLBars.makeBoundHelper === 'function') {
    forExport = _ember['default'].Helper.helper(isEqualHelper);
  } else {
    forExport = _ember['default'].Handlebars.makeBoundHelper(isEqualHelper);
  }
  exports['default'] = forExport;
});
define('ember-form-master-2000/helpers/is-not', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  function isNotHelper(params) {
    return !params[0];
  }

  var forExport = null;
  if (typeof _ember['default'].HTMLBars.makeBoundHelper === 'function') {
    forExport = _ember['default'].Helper.helper(isNotHelper);
  } else {
    forExport = _ember['default'].Handlebars.makeBoundHelper(isNotHelper);
  }
  exports['default'] = forExport;
});
define('ember-form-master-2000/initializers/ember-form-master-2000', ['exports'], function (exports) {
  'use strict';

  exports.initialize = initialize;

  function initialize() /* container, application */{
    // application.inject('route', 'foo', 'service:foo');
  }

  exports['default'] = {
    name: 'ember-form-master-2000',
    initialize: initialize
  };
});
define('ember-form-master-2000/mixins/data-attribute-support', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports['default'] = _ember['default'].Mixin.create({

    setDataAttributes: _ember['default'].observer('parentView.dataAttributes.[]', function () {
      var _this = this;

      var dataAttributes = this.get('parentView.dataAttributes');
      if (_ember['default'].isArray(dataAttributes)) {
        dataAttributes.forEach(function (attr) {
          _this.get('attributeBindings').push(attr);
          _this.set(attr, _this.get('parentView.' + attr));
        });
      }
    })

  });
});
define('ember-form-master-2000/services/fm-config', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports['default'] = _ember['default'].Service.extend({
    submitButtonClass: 'btn btn-primary',
    errorClass: 'has-error',
    wrapperClass: 'form-group',
    labelClass: 'control-label',
    inputClass: 'form-control',
    textareaClass: 'form-control',
    selectClass: 'form-control',
    formClass: 'form-vertical',
    checkboxWrapperClass: 'form-group',
    radioGroupWrapperClass: 'form-group',
    radioClass: 'radio',
    helptextClass: 'help-block',
    errortextClass: 'help-block',

    /*
    *   If true, always show validation errors. If false, wait until some sort of
    *   user interaction on each field before showing errors.
    */
    showErrorsByDefault: true
  });
});
define("ember-form-master-2000/templates/components/ember-form-master-2000/fm-checkbox", ["exports"], function (exports) {
  "use strict";

  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 13,
              "column": 2
            },
            "end": {
              "line": 15,
              "column": 2
            }
          },
          "moduleName": "modules/ember-form-master-2000/templates/components/ember-form-master-2000/fm-checkbox.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "fm-errortext", [], ["errors", ["subexpr", "@mut", [["get", "errors", ["loc", [null, [14, 26], [14, 32]]]]], [], []]], ["loc", [null, [14, 4], [14, 34]]]]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "triple-curlies"
        },
        "revision": "Ember@2.4.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 18,
            "column": 0
          }
        },
        "moduleName": "modules/ember-form-master-2000/templates/components/ember-form-master-2000/fm-checkbox.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "checkbox");
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("label");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(element1, 1, 1);
        morphs[1] = dom.createMorphAt(element1, 3, 3);
        morphs[2] = dom.createMorphAt(element0, 3, 3);
        return morphs;
      },
      statements: [["inline", "input", [], ["type", "checkbox", "checked", ["subexpr", "@mut", [["get", "checked", ["loc", [null, [6, 14], [6, 21]]]]], [], []], "disabled", ["subexpr", "@mut", [["get", "disabled", ["loc", [null, [7, 15], [7, 23]]]]], [], []], "name", ["subexpr", "@mut", [["get", "name", ["loc", [null, [8, 11], [8, 15]]]]], [], []], "tabindex", ["subexpr", "@mut", [["get", "tabindex", ["loc", [null, [9, 15], [9, 23]]]]], [], []]], ["loc", [null, [4, 4], [9, 25]]]], ["content", "label", ["loc", [null, [10, 4], [10, 13]]]], ["block", "if", [["get", "showErrors", ["loc", [null, [13, 8], [13, 18]]]]], [], 0, null, ["loc", [null, [13, 2], [15, 9]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("ember-form-master-2000/templates/components/ember-form-master-2000/fm-errortext", ["exports"], function (exports) {
  "use strict";

  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type"]
        },
        "revision": "Ember@2.4.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 9
          }
        },
        "moduleName": "modules/ember-form-master-2000/templates/components/ember-form-master-2000/fm-errortext.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["content", "error", ["loc", [null, [1, 0], [1, 9]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("ember-form-master-2000/templates/components/ember-form-master-2000/fm-field", ["exports"], function (exports) {
  "use strict";

  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": {
            "name": "triple-curlies"
          },
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 3,
              "column": 0
            }
          },
          "moduleName": "modules/ember-form-master-2000/templates/components/ember-form-master-2000/fm-field.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("label");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(3);
          morphs[0] = dom.createAttrMorph(element0, 'for');
          morphs[1] = dom.createAttrMorph(element0, 'class');
          morphs[2] = dom.createUnsafeMorphAt(element0, 0, 0);
          return morphs;
        },
        statements: [["attribute", "for", ["concat", [["get", "forAttribute", ["loc", [null, [2, 16], [2, 28]]]]]]], ["attribute", "class", ["concat", [["get", "labelClass", ["loc", [null, [2, 41], [2, 51]]]]]]], ["content", "label", ["loc", [null, [2, 55], [2, 66]]]]],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 0
            },
            "end": {
              "line": 14,
              "column": 0
            }
          },
          "moduleName": "modules/ember-form-master-2000/templates/components/ember-form-master-2000/fm-field.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "fm-input", [], ["type", ["subexpr", "@mut", [["get", "type", ["loc", [null, [7, 9], [7, 13]]]]], [], []], "value", ["subexpr", "@mut", [["get", "value", ["loc", [null, [8, 10], [8, 15]]]]], [], []], "maxlength", ["subexpr", "@mut", [["get", "maxlength", ["loc", [null, [10, 14], [10, 23]]]]], [], []], "placeholder", ["subexpr", "@mut", [["get", "placeholder", ["loc", [null, [11, 16], [11, 27]]]]], [], []], "onUserInteraction", "userInteraction", "class", ["subexpr", "concat", [["subexpr", "if", [["get", "errorClass", []], ["subexpr", "-normalize-class", ["errorClass", ["get", "errorClass", []]], [], []]], [], []], " ", ["subexpr", "if", [["get", "inputClass", []], ["subexpr", "-normalize-class", ["inputClass", ["get", "inputClass", []]], [], []]], [], []], " "], [], []]], ["loc", [null, [6, 2], [13, 4]]]]],
        locals: [],
        templates: []
      };
    })();
    var child2 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 16,
              "column": 0
            },
            "end": {
              "line": 26,
              "column": 0
            }
          },
          "moduleName": "modules/ember-form-master-2000/templates/components/ember-form-master-2000/fm-field.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "fm-select", [], ["content", ["subexpr", "@mut", [["get", "content", ["loc", [null, [18, 12], [18, 19]]]]], [], []], "optionValuePath", ["subexpr", "@mut", [["get", "optionValuePath", ["loc", [null, [19, 20], [19, 35]]]]], [], []], "optionLabelPath", ["subexpr", "@mut", [["get", "optionLabelPath", ["loc", [null, [20, 20], [20, 35]]]]], [], []], "prompt", ["subexpr", "@mut", [["get", "prompt", ["loc", [null, [21, 11], [21, 17]]]]], [], []], "value", ["subexpr", "@mut", [["get", "value", ["loc", [null, [22, 10], [22, 15]]]]], [], []], "action", ["subexpr", "action", ["selectAction"], [], ["loc", [null, [23, 11], [23, 34]]]], "onUserInteraction", "userInteraction"], ["loc", [null, [17, 2], [25, 4]]]]],
        locals: [],
        templates: []
      };
    })();
    var child3 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 28,
              "column": 0
            },
            "end": {
              "line": 40,
              "column": 0
            }
          },
          "moduleName": "modules/ember-form-master-2000/templates/components/ember-form-master-2000/fm-field.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "fm-textarea", [], ["value", ["subexpr", "@mut", [["get", "value", ["loc", [null, [30, 10], [30, 15]]]]], [], []], "placeholder", ["subexpr", "@mut", [["get", "placeholder", ["loc", [null, [32, 16], [32, 27]]]]], [], []], "rows", ["subexpr", "@mut", [["get", "rows", ["loc", [null, [33, 9], [33, 13]]]]], [], []], "cols", ["subexpr", "@mut", [["get", "cols", ["loc", [null, [34, 9], [34, 13]]]]], [], []], "maxlength", ["subexpr", "@mut", [["get", "maxlength", ["loc", [null, [35, 14], [35, 23]]]]], [], []], "spellcheck", ["subexpr", "@mut", [["get", "spellcheck", ["loc", [null, [36, 15], [36, 25]]]]], [], []], "disabled", ["subexpr", "@mut", [["get", "disabled", ["loc", [null, [37, 13], [37, 21]]]]], [], []], "onUserInteraction", "userInteraction", "class", ["subexpr", "concat", [["subexpr", "if", [["get", "errorClass", []], ["subexpr", "-normalize-class", ["errorClass", ["get", "errorClass", []]], [], []]], [], []], " ", ["subexpr", "if", [["get", "textareaClass", []], ["subexpr", "-normalize-class", ["textareaClass", ["get", "textareaClass", []]], [], []]], [], []], " "], [], []]], ["loc", [null, [29, 2], [39, 4]]]]],
        locals: [],
        templates: []
      };
    })();
    var child4 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 42,
              "column": 0
            },
            "end": {
              "line": 44,
              "column": 0
            }
          },
          "moduleName": "modules/ember-form-master-2000/templates/components/ember-form-master-2000/fm-field.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "fm-errortext", [], ["errors", ["subexpr", "@mut", [["get", "errors", ["loc", [null, [43, 24], [43, 30]]]]], [], []]], ["loc", [null, [43, 2], [43, 32]]]]],
        locals: [],
        templates: []
      };
    })();
    var child5 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 46,
              "column": 0
            },
            "end": {
              "line": 48,
              "column": 0
            }
          },
          "moduleName": "modules/ember-form-master-2000/templates/components/ember-form-master-2000/fm-field.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "fm-helptext", [], ["helptext", ["subexpr", "@mut", [["get", "helptext", ["loc", [null, [47, 25], [47, 33]]]]], [], []]], ["loc", [null, [47, 2], [47, 35]]]]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type", "multiple-nodes"]
        },
        "revision": "Ember@2.4.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 49,
            "column": 0
          }
        },
        "moduleName": "modules/ember-form-master-2000/templates/components/ember-form-master-2000/fm-field.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(6);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        morphs[2] = dom.createMorphAt(fragment, 4, 4, contextualElement);
        morphs[3] = dom.createMorphAt(fragment, 6, 6, contextualElement);
        morphs[4] = dom.createMorphAt(fragment, 8, 8, contextualElement);
        morphs[5] = dom.createMorphAt(fragment, 10, 10, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "if", [["get", "label", ["loc", [null, [1, 6], [1, 11]]]]], [], 0, null, ["loc", [null, [1, 0], [3, 7]]]], ["block", "if", [["get", "isBasicInput", ["loc", [null, [5, 6], [5, 18]]]]], [], 1, null, ["loc", [null, [5, 0], [14, 7]]]], ["block", "if", [["get", "isSelect", ["loc", [null, [16, 6], [16, 14]]]]], [], 2, null, ["loc", [null, [16, 0], [26, 7]]]], ["block", "if", [["get", "isTextarea", ["loc", [null, [28, 6], [28, 16]]]]], [], 3, null, ["loc", [null, [28, 0], [40, 7]]]], ["block", "if", [["get", "showErrors", ["loc", [null, [42, 6], [42, 16]]]]], [], 4, null, ["loc", [null, [42, 0], [44, 7]]]], ["block", "if", [["get", "helptext", ["loc", [null, [46, 6], [46, 14]]]]], [], 5, null, ["loc", [null, [46, 0], [48, 7]]]]],
      locals: [],
      templates: [child0, child1, child2, child3, child4, child5]
    };
  })());
});
define("ember-form-master-2000/templates/components/ember-form-master-2000/fm-helptext", ["exports"], function (exports) {
  "use strict";

  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type"]
        },
        "revision": "Ember@2.4.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 12
          }
        },
        "moduleName": "modules/ember-form-master-2000/templates/components/ember-form-master-2000/fm-helptext.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["content", "helptext", ["loc", [null, [1, 0], [1, 12]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("ember-form-master-2000/templates/components/ember-form-master-2000/fm-radio-group", ["exports"], function (exports) {
  "use strict";

  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": {
            "name": "triple-curlies"
          },
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 3,
              "column": 0
            }
          },
          "moduleName": "modules/ember-form-master-2000/templates/components/ember-form-master-2000/fm-radio-group.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("label");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(2);
          morphs[0] = dom.createAttrMorph(element0, 'class');
          morphs[1] = dom.createMorphAt(element0, 0, 0);
          return morphs;
        },
        statements: [["attribute", "class", ["concat", [["get", "labelClass", ["loc", [null, [2, 18], [2, 28]]]]]]], ["content", "label", ["loc", [null, [2, 32], [2, 41]]]]],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 0
            },
            "end": {
              "line": 9,
              "column": 0
            }
          },
          "moduleName": "modules/ember-form-master-2000/templates/components/ember-form-master-2000/fm-radio-group.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "fm-radio", [], ["content", ["subexpr", "@mut", [["get", "option", ["loc", [null, [7, 21], [7, 27]]]]], [], []], "onUserInteraction", "userInteraction", "optionLabelPath", ["subexpr", "@mut", [["get", "optionLabelPath", ["loc", [null, [7, 80], [7, 95]]]]], [], []], "optionValuePath", ["subexpr", "@mut", [["get", "optionValuePath", ["loc", [null, [7, 112], [7, 127]]]]], [], []]], ["loc", [null, [7, 2], [7, 129]]]]],
        locals: ["option"],
        templates: []
      };
    })();
    var child2 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 11,
              "column": 0
            },
            "end": {
              "line": 13,
              "column": 0
            }
          },
          "moduleName": "modules/ember-form-master-2000/templates/components/ember-form-master-2000/fm-radio-group.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "fm-errortext", [], ["errors", ["subexpr", "@mut", [["get", "errors", ["loc", [null, [12, 24], [12, 30]]]]], [], []]], ["loc", [null, [12, 2], [12, 32]]]]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type", "multiple-nodes"]
        },
        "revision": "Ember@2.4.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 14,
            "column": 0
          }
        },
        "moduleName": "modules/ember-form-master-2000/templates/components/ember-form-master-2000/fm-radio-group.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        morphs[2] = dom.createMorphAt(fragment, 4, 4, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "if", [["get", "label", ["loc", [null, [1, 6], [1, 11]]]]], [], 0, null, ["loc", [null, [1, 0], [3, 7]]]], ["block", "each", [["get", "content", ["loc", [null, [5, 8], [5, 15]]]]], [], 1, null, ["loc", [null, [5, 0], [9, 9]]]], ["block", "if", [["get", "showErrors", ["loc", [null, [11, 6], [11, 16]]]]], [], 2, null, ["loc", [null, [11, 0], [13, 7]]]]],
      locals: [],
      templates: [child0, child1, child2]
    };
  })());
});
define("ember-form-master-2000/templates/components/ember-form-master-2000/fm-radio", ["exports"], function (exports) {
  "use strict";

  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": false,
        "revision": "Ember@2.4.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 9,
            "column": 0
          }
        },
        "moduleName": "modules/ember-form-master-2000/templates/components/ember-form-master-2000/fm-radio.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("label");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("input");
        dom.setAttribute(el2, "type", "radio");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1]);
        if (this.cachedFragment) {
          dom.repairClonedNode(element1, [], true);
        }
        var morphs = new Array(5);
        morphs[0] = dom.createAttrMorph(element1, 'name');
        morphs[1] = dom.createAttrMorph(element1, 'value');
        morphs[2] = dom.createAttrMorph(element1, 'checked');
        morphs[3] = dom.createMorphAt(element0, 3, 3);
        morphs[4] = dom.createMorphAt(element0, 5, 5);
        return morphs;
      },
      statements: [["attribute", "name", ["get", "parentView.name", ["loc", [null, [3, 11], [3, 26]]]]], ["attribute", "value", ["subexpr", "get", [["get", "content", ["loc", [null, [4, 16], [4, 23]]]], ["get", "optionValuePath", ["loc", [null, [4, 24], [4, 39]]]]], [], ["loc", [null, [4, 10], [4, 41]]]]], ["attribute", "checked", ["get", "checked", ["loc", [null, [5, 14], [5, 21]]]]], ["inline", "get", [["get", "content", ["loc", [null, [6, 8], [6, 15]]]], ["get", "optionLabelPath", ["loc", [null, [6, 16], [6, 31]]]]], [], ["loc", [null, [6, 2], [6, 33]]]], ["content", "isSelected", ["loc", [null, [7, 2], [7, 16]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("ember-form-master-2000/templates/components/ember-form-master-2000/fm-select", ["exports"], function (exports) {
  "use strict";

  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": {
            "name": "triple-curlies"
          },
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 5,
              "column": 0
            }
          },
          "moduleName": "modules/ember-form-master-2000/templates/components/ember-form-master-2000/fm-select.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("option");
          dom.setAttribute(el1, "disabled", "");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element1 = dom.childAt(fragment, [1]);
          var morphs = new Array(2);
          morphs[0] = dom.createAttrMorph(element1, 'selected');
          morphs[1] = dom.createMorphAt(element1, 1, 1);
          return morphs;
        },
        statements: [["attribute", "selected", ["subexpr", "is-not", [["get", "value", ["loc", [null, [2, 37], [2, 42]]]]], [], ["loc", [null, [2, 28], [2, 44]]]]], ["content", "prompt", ["loc", [null, [3, 4], [3, 14]]]]],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 7,
              "column": 0
            },
            "end": {
              "line": 12,
              "column": 0
            }
          },
          "moduleName": "modules/ember-form-master-2000/templates/components/ember-form-master-2000/fm-select.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("option");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(3);
          morphs[0] = dom.createAttrMorph(element0, 'value');
          morphs[1] = dom.createAttrMorph(element0, 'selected');
          morphs[2] = dom.createMorphAt(element0, 1, 1);
          return morphs;
        },
        statements: [["attribute", "value", ["concat", [["subexpr", "if", [["get", "optionValuePath", ["loc", [null, [8, 22], [8, 37]]]], ["subexpr", "get", [["get", "item", ["loc", [null, [8, 43], [8, 47]]]], ["get", "optionValuePath", ["loc", [null, [8, 48], [8, 63]]]]], [], ["loc", [null, [8, 38], [8, 64]]]], ["get", "item", ["loc", [null, [8, 65], [8, 69]]]]], [], ["loc", [null, [8, 17], [8, 71]]]]]]], ["attribute", "selected", ["subexpr", "is-equal", [["subexpr", "if", [["get", "optionValuePath", ["loc", [null, [9, 34], [9, 49]]]], ["subexpr", "get", [["get", "item", ["loc", [null, [9, 55], [9, 59]]]], ["get", "optionValuePath", ["loc", [null, [9, 60], [9, 75]]]]], [], ["loc", [null, [9, 50], [9, 76]]]], ["get", "item", ["loc", [null, [9, 77], [9, 81]]]]], [], ["loc", [null, [9, 30], [9, 82]]]], ["get", "value", ["loc", [null, [9, 83], [9, 88]]]]], [], ["loc", [null, [9, 19], [9, 90]]]]], ["inline", "get", [["get", "item", ["loc", [null, [10, 10], [10, 14]]]], ["get", "optionLabelPath", ["loc", [null, [10, 15], [10, 30]]]]], [], ["loc", [null, [10, 4], [10, 32]]]]],
        locals: ["item"],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type", "multiple-nodes"]
        },
        "revision": "Ember@2.4.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 13,
            "column": 0
          }
        },
        "moduleName": "modules/ember-form-master-2000/templates/components/ember-form-master-2000/fm-select.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "if", [["get", "prompt", ["loc", [null, [1, 6], [1, 12]]]]], [], 0, null, ["loc", [null, [1, 0], [5, 7]]]], ["block", "each", [["get", "content", ["loc", [null, [7, 8], [7, 15]]]]], ["key", "@identity"], 1, null, ["loc", [null, [7, 0], [12, 9]]]]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("ember-form-master-2000/templates/components/ember-form-master-2000/fm-submit", ["exports"], function (exports) {
  "use strict";

  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 6,
              "column": 2
            },
            "end": {
              "line": 8,
              "column": 2
            }
          },
          "moduleName": "modules/ember-form-master-2000/templates/components/ember-form-master-2000/fm-submit.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["content", "value", ["loc", [null, [7, 4], [7, 13]]]]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "triple-curlies"
        },
        "revision": "Ember@2.4.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 11,
            "column": 0
          }
        },
        "moduleName": "modules/ember-form-master-2000/templates/components/ember-form-master-2000/fm-submit.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("button");
        dom.setAttribute(el1, "type", "submit");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var morphs = new Array(5);
        morphs[0] = dom.createAttrMorph(element0, 'value');
        morphs[1] = dom.createAttrMorph(element0, 'disabled');
        morphs[2] = dom.createAttrMorph(element0, 'class');
        morphs[3] = dom.createMorphAt(element0, 1, 1);
        morphs[4] = dom.createMorphAt(element0, 3, 3);
        return morphs;
      },
      statements: [["attribute", "value", ["get", "value", ["loc", [null, [2, 10], [2, 15]]]]], ["attribute", "disabled", ["get", "disabled", ["loc", [null, [3, 13], [3, 21]]]]], ["attribute", "class", ["concat", [["get", "submitButtonClass", ["loc", [null, [4, 11], [4, 28]]]]]]], ["block", "if", [["get", "value", ["loc", [null, [6, 8], [6, 13]]]]], [], 0, null, ["loc", [null, [6, 2], [8, 9]]]], ["content", "yield", ["loc", [null, [9, 2], [9, 11]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("ember-form-master-2000/templates/components/ember-form-master-2000/fm-textarea", ["exports"], function (exports) {
  "use strict";

  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": {
            "name": "triple-curlies"
          },
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 3,
              "column": 0
            }
          },
          "moduleName": "modules/ember-form-master-2000/templates/components/ember-form-master-2000/fm-textarea.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("label");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(2);
          morphs[0] = dom.createAttrMorph(element0, 'class');
          morphs[1] = dom.createMorphAt(element0, 0, 0);
          return morphs;
        },
        statements: [["attribute", "class", ["concat", [["get", "labelClass", ["loc", [null, [2, 18], [2, 28]]]]]]], ["content", "label", ["loc", [null, [2, 32], [2, 41]]]]],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 0
            },
            "end": {
              "line": 15,
              "column": 0
            }
          },
          "moduleName": "modules/ember-form-master-2000/templates/components/ember-form-master-2000/fm-textarea.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "fm-select", [], ["content", ["subexpr", "@mut", [["get", "content", ["loc", [null, [8, 12], [8, 19]]]]], [], []], "optionValuePath", ["subexpr", "@mut", [["get", "optionValuePath", ["loc", [null, [9, 20], [9, 35]]]]], [], []], "optionLabelPath", ["subexpr", "@mut", [["get", "optionLabelPath", ["loc", [null, [10, 20], [10, 35]]]]], [], []], "prompt", ["subexpr", "@mut", [["get", "prompt", ["loc", [null, [11, 11], [11, 17]]]]], [], []], "value", ["subexpr", "@mut", [["get", "value", ["loc", [null, [12, 10], [12, 15]]]]], [], []]], ["loc", [null, [7, 2], [13, 4]]]]],
        locals: [],
        templates: []
      };
    })();
    var child2 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 18,
              "column": 0
            },
            "end": {
              "line": 20,
              "column": 0
            }
          },
          "moduleName": "modules/ember-form-master-2000/templates/components/ember-form-master-2000/fm-textarea.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child3 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 22,
              "column": 0
            },
            "end": {
              "line": 30,
              "column": 0
            }
          },
          "moduleName": "modules/ember-form-master-2000/templates/components/ember-form-master-2000/fm-textarea.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "input", [], ["type", ["subexpr", "@mut", [["get", "type", ["loc", [null, [25, 9], [25, 13]]]]], [], []], "value", ["subexpr", "@mut", [["get", "value", ["loc", [null, [26, 10], [26, 15]]]]], [], []], "placeholder", ["subexpr", "@mut", [["get", "placeholder", ["loc", [null, [28, 16], [28, 27]]]]], [], []], "class", ["subexpr", "concat", [["subexpr", "if", [["get", "errorClass", []], ["subexpr", "-normalize-class", ["errorClass", ["get", "errorClass", []]], [], []]], [], []], " ", ["subexpr", "if", [["get", "inputClass", []], ["subexpr", "-normalize-class", ["inputClass", ["get", "inputClass", []]], [], []]], [], []], " "], [], []]], ["loc", [null, [24, 2], [28, 29]]]]],
        locals: [],
        templates: []
      };
    })();
    var child4 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 32,
              "column": 0
            },
            "end": {
              "line": 34,
              "column": 0
            }
          },
          "moduleName": "modules/ember-form-master-2000/templates/components/ember-form-master-2000/fm-textarea.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "fm-errortext", [], ["errors", ["subexpr", "@mut", [["get", "errors", ["loc", [null, [33, 24], [33, 30]]]]], [], []]], ["loc", [null, [33, 2], [33, 32]]]]],
        locals: [],
        templates: []
      };
    })();
    var child5 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 36,
              "column": 0
            },
            "end": {
              "line": 38,
              "column": 0
            }
          },
          "moduleName": "modules/ember-form-master-2000/templates/components/ember-form-master-2000/fm-textarea.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "fm-helptext", [], ["helptext", ["subexpr", "@mut", [["get", "helptext", ["loc", [null, [37, 25], [37, 33]]]]], [], []]], ["loc", [null, [37, 2], [37, 35]]]]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type", "multiple-nodes"]
        },
        "revision": "Ember@2.4.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 39,
            "column": 0
          }
        },
        "moduleName": "modules/ember-form-master-2000/templates/components/ember-form-master-2000/fm-textarea.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(6);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        morphs[2] = dom.createMorphAt(fragment, 4, 4, contextualElement);
        morphs[3] = dom.createMorphAt(fragment, 6, 6, contextualElement);
        morphs[4] = dom.createMorphAt(fragment, 8, 8, contextualElement);
        morphs[5] = dom.createMorphAt(fragment, 10, 10, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "if", [["get", "label", ["loc", [null, [1, 6], [1, 11]]]]], [], 0, null, ["loc", [null, [1, 0], [3, 7]]]], ["block", "if", [["get", "isSelect", ["loc", [null, [5, 6], [5, 14]]]]], [], 1, null, ["loc", [null, [5, 0], [15, 7]]]], ["block", "if", [["get", "isTextarea", ["loc", [null, [18, 6], [18, 16]]]]], [], 2, null, ["loc", [null, [18, 0], [20, 7]]]], ["block", "if", [["get", "isBasicInput", ["loc", [null, [22, 6], [22, 18]]]]], [], 3, null, ["loc", [null, [22, 0], [30, 7]]]], ["block", "if", [["get", "errors", ["loc", [null, [32, 6], [32, 12]]]]], [], 4, null, ["loc", [null, [32, 0], [34, 7]]]], ["block", "if", [["get", "helptext", ["loc", [null, [36, 6], [36, 14]]]]], [], 5, null, ["loc", [null, [36, 0], [38, 7]]]]],
      locals: [],
      templates: [child0, child1, child2, child3, child4, child5]
    };
  })());
});
define('ember-getowner-polyfill/fake-owner', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  var _createClass = (function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  })();

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  var CONTAINER = '__' + new Date() + '_container';
  var REGISTRY = '__' + new Date() + '_registry';

  var FakeOwner = (function () {
    function FakeOwner(object) {
      _classCallCheck(this, FakeOwner);

      this[CONTAINER] = object.container;

      if (_ember['default'].Registry) {
        // object.container._registry is used by 1.11
        this[REGISTRY] = object.container.registry || object.container._registry;
      } else {
        // Ember < 1.12
        this[REGISTRY] = object.container;
      }
    }

    // ContainerProxyMixin methods
    //
    // => http://emberjs.com/api/classes/ContainerProxyMixin.html
    //

    _createClass(FakeOwner, [{
      key: 'lookup',
      value: function lookup() {
        var _CONTAINER;

        return (_CONTAINER = this[CONTAINER]).lookup.apply(_CONTAINER, arguments);
      }
    }, {
      key: '_lookupFactory',
      value: function _lookupFactory() {
        var _CONTAINER2;

        return (_CONTAINER2 = this[CONTAINER]).lookupFactory.apply(_CONTAINER2, arguments);
      }

      // RegistryProxyMixin methods
      //
      // => http://emberjs.com/api/classes/RegistryProxyMixin.html
      //
    }, {
      key: 'hasRegistration',
      value: function hasRegistration() {
        var _REGISTRY;

        return (_REGISTRY = this[REGISTRY]).has.apply(_REGISTRY, arguments);
      }
    }, {
      key: 'inject',
      value: function inject() {
        var _REGISTRY2;

        return (_REGISTRY2 = this[REGISTRY]).injection.apply(_REGISTRY2, arguments);
      }
    }, {
      key: 'register',
      value: function register() {
        var _REGISTRY3;

        return (_REGISTRY3 = this[REGISTRY]).register.apply(_REGISTRY3, arguments);
      }
    }, {
      key: 'registerOption',
      value: function registerOption() {
        var _REGISTRY4;

        return (_REGISTRY4 = this[REGISTRY]).option.apply(_REGISTRY4, arguments);
      }
    }, {
      key: 'registerOptions',
      value: function registerOptions() {
        var _REGISTRY5;

        return (_REGISTRY5 = this[REGISTRY]).options.apply(_REGISTRY5, arguments);
      }
    }, {
      key: 'registerOptionsForType',
      value: function registerOptionsForType() {
        var _REGISTRY6;

        return (_REGISTRY6 = this[REGISTRY]).optionsForType.apply(_REGISTRY6, arguments);
      }
    }, {
      key: 'registeredOption',
      value: function registeredOption() {
        var _REGISTRY7;

        return (_REGISTRY7 = this[REGISTRY]).getOption.apply(_REGISTRY7, arguments);
      }
    }, {
      key: 'registeredOptions',
      value: function registeredOptions() {
        var _REGISTRY8;

        return (_REGISTRY8 = this[REGISTRY]).getOptions.apply(_REGISTRY8, arguments);
      }
    }, {
      key: 'registeredOptionsForType',
      value: function registeredOptionsForType(type) {
        if (this[REGISTRY].getOptionsForType) {
          var _REGISTRY9;

          return (_REGISTRY9 = this[REGISTRY]).getOptionsForType.apply(_REGISTRY9, arguments);
        } else {
          // used for Ember 1.10
          return this[REGISTRY]._typeOptions[type];
        }
      }
    }, {
      key: 'resolveRegistration',
      value: function resolveRegistration() {
        var _REGISTRY10;

        return (_REGISTRY10 = this[REGISTRY]).resolve.apply(_REGISTRY10, arguments);
      }
    }, {
      key: 'unregister',
      value: function unregister() {
        var _REGISTRY11;

        return (_REGISTRY11 = this[REGISTRY]).unregister.apply(_REGISTRY11, arguments);
      }
    }]);

    return FakeOwner;
  })();

  exports['default'] = FakeOwner;
});
define('ember-getowner-polyfill/index', ['exports', 'ember', 'ember-getowner-polyfill/fake-owner'], function (exports, _ember, _emberGetownerPolyfillFakeOwner) {
  'use strict';

  var hasGetOwner = !!_ember['default'].getOwner;

  exports['default'] = function (object) {
    var owner = undefined;

    if (hasGetOwner) {
      owner = _ember['default'].getOwner(object);
    }

    if (!owner && object.container) {
      owner = new _emberGetownerPolyfillFakeOwner['default'](object);
    }

    return owner;
  };
});
define("ember-inflector/index", ["exports", "ember", "ember-inflector/lib/system", "ember-inflector/lib/ext/string"], function (exports, _ember, _emberInflectorLibSystem, _emberInflectorLibExtString) {
  /* global define, module */

  "use strict";

  _emberInflectorLibSystem.Inflector.defaultRules = _emberInflectorLibSystem.defaultRules;
  _ember["default"].Inflector = _emberInflectorLibSystem.Inflector;

  _ember["default"].String.pluralize = _emberInflectorLibSystem.pluralize;
  _ember["default"].String.singularize = _emberInflectorLibSystem.singularize;exports["default"] = _emberInflectorLibSystem.Inflector;
  exports.pluralize = _emberInflectorLibSystem.pluralize;
  exports.singularize = _emberInflectorLibSystem.singularize;
  exports.defaultRules = _emberInflectorLibSystem.defaultRules;

  if (typeof define !== 'undefined' && define.amd) {
    define('ember-inflector', ['exports'], function (__exports__) {
      __exports__['default'] = _emberInflectorLibSystem.Inflector;
      return _emberInflectorLibSystem.Inflector;
    });
  } else if (typeof module !== 'undefined' && module['exports']) {
    module['exports'] = _emberInflectorLibSystem.Inflector;
  }
});
define('ember-inflector/lib/ext/string', ['exports', 'ember', 'ember-inflector/lib/system/string'], function (exports, _ember, _emberInflectorLibSystemString) {
  'use strict';

  if (_ember['default'].EXTEND_PROTOTYPES === true || _ember['default'].EXTEND_PROTOTYPES.String) {
    /**
      See {{#crossLink "Ember.String/pluralize"}}{{/crossLink}}
       @method pluralize
      @for String
    */
    String.prototype.pluralize = function () {
      return (0, _emberInflectorLibSystemString.pluralize)(this);
    };

    /**
      See {{#crossLink "Ember.String/singularize"}}{{/crossLink}}
       @method singularize
      @for String
    */
    String.prototype.singularize = function () {
      return (0, _emberInflectorLibSystemString.singularize)(this);
    };
  }
});
define('ember-inflector/lib/helpers/pluralize', ['exports', 'ember-inflector', 'ember-inflector/lib/utils/make-helper'], function (exports, _emberInflector, _emberInflectorLibUtilsMakeHelper) {
  'use strict';

  /**
   *
   * If you have Ember Inflector (such as if Ember Data is present),
   * pluralize a word. For example, turn "ox" into "oxen".
   *
   * Example:
   *
   * {{pluralize count myProperty}}
   * {{pluralize 1 "oxen"}}
   * {{pluralize myProperty}}
   * {{pluralize "ox"}}
   *
   * @for Ember.HTMLBars.helpers
   * @method pluralize
   * @param {Number|Property} [count] count of objects
   * @param {String|Property} word word to pluralize
  */
  exports['default'] = (0, _emberInflectorLibUtilsMakeHelper['default'])(function (params) {
    var count = undefined,
        word = undefined;

    if (params.length === 1) {
      word = params[0];
      return (0, _emberInflector.pluralize)(word);
    } else {
      count = params[0];
      word = params[1];

      if (parseFloat(count) !== 1) {
        word = (0, _emberInflector.pluralize)(word);
      }

      return count + " " + word;
    }
  });
});
define('ember-inflector/lib/helpers/singularize', ['exports', 'ember-inflector', 'ember-inflector/lib/utils/make-helper'], function (exports, _emberInflector, _emberInflectorLibUtilsMakeHelper) {
  'use strict';

  /**
   *
   * If you have Ember Inflector (such as if Ember Data is present),
   * singularize a word. For example, turn "oxen" into "ox".
   *
   * Example:
   *
   * {{singularize myProperty}}
   * {{singularize "oxen"}}
   *
   * @for Ember.HTMLBars.helpers
   * @method singularize
   * @param {String|Property} word word to singularize
  */
  exports['default'] = (0, _emberInflectorLibUtilsMakeHelper['default'])(function (params) {
    return (0, _emberInflector.singularize)(params[0]);
  });
});
define('ember-inflector/lib/system/inflections', ['exports'], function (exports) {
  'use strict';

  exports['default'] = {
    plurals: [[/$/, 's'], [/s$/i, 's'], [/^(ax|test)is$/i, '$1es'], [/(octop|vir)us$/i, '$1i'], [/(octop|vir)i$/i, '$1i'], [/(alias|status)$/i, '$1es'], [/(bu)s$/i, '$1ses'], [/(buffal|tomat)o$/i, '$1oes'], [/([ti])um$/i, '$1a'], [/([ti])a$/i, '$1a'], [/sis$/i, 'ses'], [/(?:([^f])fe|([lr])f)$/i, '$1$2ves'], [/(hive)$/i, '$1s'], [/([^aeiouy]|qu)y$/i, '$1ies'], [/(x|ch|ss|sh)$/i, '$1es'], [/(matr|vert|ind)(?:ix|ex)$/i, '$1ices'], [/^(m|l)ouse$/i, '$1ice'], [/^(m|l)ice$/i, '$1ice'], [/^(ox)$/i, '$1en'], [/^(oxen)$/i, '$1'], [/(quiz)$/i, '$1zes']],

    singular: [[/s$/i, ''], [/(ss)$/i, '$1'], [/(n)ews$/i, '$1ews'], [/([ti])a$/i, '$1um'], [/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)(sis|ses)$/i, '$1sis'], [/(^analy)(sis|ses)$/i, '$1sis'], [/([^f])ves$/i, '$1fe'], [/(hive)s$/i, '$1'], [/(tive)s$/i, '$1'], [/([lr])ves$/i, '$1f'], [/([^aeiouy]|qu)ies$/i, '$1y'], [/(s)eries$/i, '$1eries'], [/(m)ovies$/i, '$1ovie'], [/(x|ch|ss|sh)es$/i, '$1'], [/^(m|l)ice$/i, '$1ouse'], [/(bus)(es)?$/i, '$1'], [/(o)es$/i, '$1'], [/(shoe)s$/i, '$1'], [/(cris|test)(is|es)$/i, '$1is'], [/^(a)x[ie]s$/i, '$1xis'], [/(octop|vir)(us|i)$/i, '$1us'], [/(alias|status)(es)?$/i, '$1'], [/^(ox)en/i, '$1'], [/(vert|ind)ices$/i, '$1ex'], [/(matr)ices$/i, '$1ix'], [/(quiz)zes$/i, '$1'], [/(database)s$/i, '$1']],

    irregularPairs: [['person', 'people'], ['man', 'men'], ['child', 'children'], ['sex', 'sexes'], ['move', 'moves'], ['cow', 'kine'], ['zombie', 'zombies']],

    uncountable: ['equipment', 'information', 'rice', 'money', 'species', 'series', 'fish', 'sheep', 'jeans', 'police']
  };
});
define('ember-inflector/lib/system/inflector', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  var capitalize = _ember['default'].String.capitalize;

  var BLANK_REGEX = /^\s*$/;
  var LAST_WORD_DASHED_REGEX = /([\w/-]+[_/\s-])([a-z\d]+$)/;
  var LAST_WORD_CAMELIZED_REGEX = /([\w/\s-]+)([A-Z][a-z\d]*$)/;
  var CAMELIZED_REGEX = /[A-Z][a-z\d]*$/;

  function loadUncountable(rules, uncountable) {
    for (var i = 0, length = uncountable.length; i < length; i++) {
      rules.uncountable[uncountable[i].toLowerCase()] = true;
    }
  }

  function loadIrregular(rules, irregularPairs) {
    var pair;

    for (var i = 0, length = irregularPairs.length; i < length; i++) {
      pair = irregularPairs[i];

      //pluralizing
      rules.irregular[pair[0].toLowerCase()] = pair[1];
      rules.irregular[pair[1].toLowerCase()] = pair[1];

      //singularizing
      rules.irregularInverse[pair[1].toLowerCase()] = pair[0];
      rules.irregularInverse[pair[0].toLowerCase()] = pair[0];
    }
  }

  /**
    Inflector.Ember provides a mechanism for supplying inflection rules for your
    application. Ember includes a default set of inflection rules, and provides an
    API for providing additional rules.
  
    Examples:
  
    Creating an inflector with no rules.
  
    ```js
    var inflector = new Ember.Inflector();
    ```
  
    Creating an inflector with the default ember ruleset.
  
    ```js
    var inflector = new Ember.Inflector(Ember.Inflector.defaultRules);
  
    inflector.pluralize('cow'); //=> 'kine'
    inflector.singularize('kine'); //=> 'cow'
    ```
  
    Creating an inflector and adding rules later.
  
    ```javascript
    var inflector = Ember.Inflector.inflector;
  
    inflector.pluralize('advice'); // => 'advices'
    inflector.uncountable('advice');
    inflector.pluralize('advice'); // => 'advice'
  
    inflector.pluralize('formula'); // => 'formulas'
    inflector.irregular('formula', 'formulae');
    inflector.pluralize('formula'); // => 'formulae'
  
    // you would not need to add these as they are the default rules
    inflector.plural(/$/, 's');
    inflector.singular(/s$/i, '');
    ```
  
    Creating an inflector with a nondefault ruleset.
  
    ```javascript
    var rules = {
      plurals:  [ /$/, 's' ],
      singular: [ /\s$/, '' ],
      irregularPairs: [
        [ 'cow', 'kine' ]
      ],
      uncountable: [ 'fish' ]
    };
  
    var inflector = new Ember.Inflector(rules);
    ```
  
    @class Inflector
    @namespace Ember
  */
  function Inflector(ruleSet) {
    ruleSet = ruleSet || {};
    ruleSet.uncountable = ruleSet.uncountable || makeDictionary();
    ruleSet.irregularPairs = ruleSet.irregularPairs || makeDictionary();

    var rules = this.rules = {
      plurals: ruleSet.plurals || [],
      singular: ruleSet.singular || [],
      irregular: makeDictionary(),
      irregularInverse: makeDictionary(),
      uncountable: makeDictionary()
    };

    loadUncountable(rules, ruleSet.uncountable);
    loadIrregular(rules, ruleSet.irregularPairs);

    this.enableCache();
  }

  if (!Object.create && !Object.create(null).hasOwnProperty) {
    throw new Error("This browser does not support Object.create(null), please polyfil with es5-sham: http://git.io/yBU2rg");
  }

  function makeDictionary() {
    var cache = Object.create(null);
    cache['_dict'] = null;
    delete cache['_dict'];
    return cache;
  }

  Inflector.prototype = {
    /**
      @public
       As inflections can be costly, and commonly the same subset of words are repeatedly
      inflected an optional cache is provided.
       @method enableCache
    */
    enableCache: function enableCache() {
      this.purgeCache();

      this.singularize = function (word) {
        this._cacheUsed = true;
        return this._sCache[word] || (this._sCache[word] = this._singularize(word));
      };

      this.pluralize = function (word) {
        this._cacheUsed = true;
        return this._pCache[word] || (this._pCache[word] = this._pluralize(word));
      };
    },

    /**
      @public
       @method purgedCache
    */
    purgeCache: function purgeCache() {
      this._cacheUsed = false;
      this._sCache = makeDictionary();
      this._pCache = makeDictionary();
    },

    /**
      @public
      disable caching
       @method disableCache;
    */
    disableCache: function disableCache() {
      this._sCache = null;
      this._pCache = null;
      this.singularize = function (word) {
        return this._singularize(word);
      };

      this.pluralize = function (word) {
        return this._pluralize(word);
      };
    },

    /**
      @method plural
      @param {RegExp} regex
      @param {String} string
    */
    plural: function plural(regex, string) {
      if (this._cacheUsed) {
        this.purgeCache();
      }
      this.rules.plurals.push([regex, string.toLowerCase()]);
    },

    /**
      @method singular
      @param {RegExp} regex
      @param {String} string
    */
    singular: function singular(regex, string) {
      if (this._cacheUsed) {
        this.purgeCache();
      }
      this.rules.singular.push([regex, string.toLowerCase()]);
    },

    /**
      @method uncountable
      @param {String} regex
    */
    uncountable: function uncountable(string) {
      if (this._cacheUsed) {
        this.purgeCache();
      }
      loadUncountable(this.rules, [string.toLowerCase()]);
    },

    /**
      @method irregular
      @param {String} singular
      @param {String} plural
    */
    irregular: function irregular(singular, plural) {
      if (this._cacheUsed) {
        this.purgeCache();
      }
      loadIrregular(this.rules, [[singular, plural]]);
    },

    /**
      @method pluralize
      @param {String} word
    */
    pluralize: function pluralize(word) {
      return this._pluralize(word);
    },

    _pluralize: function _pluralize(word) {
      return this.inflect(word, this.rules.plurals, this.rules.irregular);
    },
    /**
      @method singularize
      @param {String} word
    */
    singularize: function singularize(word) {
      return this._singularize(word);
    },

    _singularize: function _singularize(word) {
      return this.inflect(word, this.rules.singular, this.rules.irregularInverse);
    },

    /**
      @protected
       @method inflect
      @param {String} word
      @param {Object} typeRules
      @param {Object} irregular
    */
    inflect: function inflect(word, typeRules, irregular) {
      var inflection, substitution, result, lowercase, wordSplit, firstPhrase, lastWord, isBlank, isCamelized, rule, isUncountable;

      isBlank = !word || BLANK_REGEX.test(word);

      isCamelized = CAMELIZED_REGEX.test(word);
      firstPhrase = "";

      if (isBlank) {
        return word;
      }

      lowercase = word.toLowerCase();
      wordSplit = LAST_WORD_DASHED_REGEX.exec(word) || LAST_WORD_CAMELIZED_REGEX.exec(word);

      if (wordSplit) {
        firstPhrase = wordSplit[1];
        lastWord = wordSplit[2].toLowerCase();
      }

      isUncountable = this.rules.uncountable[lowercase] || this.rules.uncountable[lastWord];

      if (isUncountable) {
        return word;
      }

      for (rule in this.rules.irregular) {
        if (lowercase.match(rule + "$")) {
          substitution = irregular[rule];

          if (isCamelized && irregular[lastWord]) {
            substitution = capitalize(substitution);
            rule = capitalize(rule);
          }

          return word.replace(rule, substitution);
        }
      }

      for (var i = typeRules.length, min = 0; i > min; i--) {
        inflection = typeRules[i - 1];
        rule = inflection[0];

        if (rule.test(word)) {
          break;
        }
      }

      inflection = inflection || [];

      rule = inflection[0];
      substitution = inflection[1];

      result = word.replace(rule, substitution);

      return result;
    }
  };

  exports['default'] = Inflector;
});
define('ember-inflector/lib/system/string', ['exports', 'ember-inflector/lib/system/inflector'], function (exports, _emberInflectorLibSystemInflector) {
  'use strict';

  function pluralize(word) {
    return _emberInflectorLibSystemInflector['default'].inflector.pluralize(word);
  }

  function singularize(word) {
    return _emberInflectorLibSystemInflector['default'].inflector.singularize(word);
  }

  exports.pluralize = pluralize;
  exports.singularize = singularize;
});
define("ember-inflector/lib/system", ["exports", "ember-inflector/lib/system/inflector", "ember-inflector/lib/system/string", "ember-inflector/lib/system/inflections"], function (exports, _emberInflectorLibSystemInflector, _emberInflectorLibSystemString, _emberInflectorLibSystemInflections) {
  "use strict";

  _emberInflectorLibSystemInflector["default"].inflector = new _emberInflectorLibSystemInflector["default"](_emberInflectorLibSystemInflections["default"]);

  exports.Inflector = _emberInflectorLibSystemInflector["default"];
  exports.singularize = _emberInflectorLibSystemString.singularize;
  exports.pluralize = _emberInflectorLibSystemString.pluralize;
  exports.defaultRules = _emberInflectorLibSystemInflections["default"];
});
define('ember-inflector/lib/utils/make-helper', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports['default'] = makeHelper;

  function makeHelper(helperFunction) {
    if (_ember['default'].Helper) {
      return _ember['default'].Helper.helper(helperFunction);
    }
    if (_ember['default'].HTMLBars) {
      return _ember['default'].HTMLBars.makeBoundHelper(helperFunction);
    }
    return _ember['default'].Handlebars.makeBoundHelper(helperFunction);
  }
});
define('ember-load-initializers/index', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports['default'] = function (app, prefix) {
    var regex = new RegExp('^' + prefix + '\/((?:instance-)?initializers)\/');
    var getKeys = Object.keys || _ember['default'].keys;

    getKeys(requirejs._eak_seen).map(function (moduleName) {
      return {
        moduleName: moduleName,
        matches: regex.exec(moduleName)
      };
    }).filter(function (dep) {
      return dep.matches && dep.matches.length === 2;
    }).forEach(function (dep) {
      var moduleName = dep.moduleName;

      var module = require(moduleName, null, null, true);
      if (!module) {
        throw new Error(moduleName + ' must export an initializer.');
      }

      var initializerType = _ember['default'].String.camelize(dep.matches[1].substring(0, dep.matches[1].length - 1));
      var initializer = module['default'];
      if (!initializer.name) {
        var initializerName = moduleName.match(/[^\/]+\/?$/)[0];
        initializer.name = initializerName;
      }

      if (app[initializerType]) {
        app[initializerType](initializer);
      }
    });
  };
});
define('ember-resize/mixins/resize-aware', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  var Mixin = _ember['default'].Mixin;
  var floor = Math.floor;

  exports['default'] = Mixin.create({
    resizeEventsEnabled: true,
    resizeDebouncedEventsEnabled: true,

    _oldViewWidth: null,
    _oldViewHeight: null,
    _oldViewWidthDebounced: null,
    _oldViewHeightDebounced: null,
    resizeWidthSensitive: true,
    resizeHeightSensitive: false,

    didInsertElement: function didInsertElement() {
      this._super.apply(this, arguments);
      if (this.get('resizeEventsEnabled')) {
        this.get('resizeService').on('didResize', this, this._handleResizeEvent);
      }
      if (this.get('resizeDebouncedEventsEnabled')) {
        this.get('resizeService').on('debouncedDidResize', this, this._handleDebouncedResizeEvent);
      }
    },

    willDestroyElement: function willDestroyElement() {
      this._super.apply(this, arguments);
      if (this.get('resizeEventsEnabled')) {
        this.get('resizeService').off('didResize', this, this._handleResizeEvent);
      }
      if (this.get('resizeDebouncedEventsEnabled')) {
        this.get('resizeService').off('debouncedDidResize', this, this._handleDebouncedResizeEvent);
      }
    },

    didResize: function didResize() /*width, height, evt*/{}, // Overridden in subclass
    debouncedDidResize: function debouncedDidResize() /*width, height, evt*/{}, // Overridden in subclass

    _getComponentSize: function _getComponentSize() {
      return this.$()[0].getClientRects()[0];
    },

    _handleResizeEvent: function _handleResizeEvent(evt) {
      var w = floor(this._getComponentSize().width);
      var h = floor(this._getComponentSize().height);
      if (this.get('resizeWidthSensitive') && this.get('_oldViewWidth') !== w || this.get('resizeHeightSensitive') && this.get('_oldViewHeight') !== h) {
        this.didResize(w, h, evt);
        this.setProperties({
          _oldViewWidth: w,
          _oldViewHeight: h
        });
      }
    },

    _handleDebouncedResizeEvent: function _handleDebouncedResizeEvent(evt) {
      var w = floor(this._getComponentSize().width);
      var h = floor(this._getComponentSize().height);
      if (this.get('resizeWidthSensitive') && this.get('_oldViewWidthDebounced') !== w || this.get('resizeHeightSensitive') && this.get('_oldViewHeightDebounced') !== h) {
        this.debouncedDidResize(w, h, evt);
        this.setProperties({
          _oldViewWidthDebounced: w,
          _oldViewHeightDebounced: h
        });
      }
    }
  });
});
define('ember-resize/services/resize', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  var Base = _ember['default'].Service || _ember['default'].Object;
  var keys = Object.keys || _ember['default'].keys;

  var Evented = _ember['default'].Evented;
  var classify = _ember['default'].String.classify;
  var oneWay = _ember['default'].computed.oneWay;
  var debounce = _ember['default'].run.debounce;

  exports['default'] = Base.extend(Evented, {
    _oldWidth: null,
    _oldHeight: null,
    _oldWidthDebounced: null,
    _oldHeightDebounced: null,

    debounceTimeout: oneWay('defaultDebounceTimeout'),
    widthSensitive: oneWay('defaultWidthSensitive'),
    heightSensitive: oneWay('defaultHeightSensitive'),

    init: function init() {
      var _this = this;

      this._super.apply(this, arguments);
      this._setDefaults();
      this._onResizeHandler = function (evt) {
        _this._fireResizeNotification(evt);
        debounce(_this, _this._fireDebouncedResizeNotification, evt, _this.get('debounceTimeout'));
      };
      this._installResizeListener();
    },

    destroy: function destroy() {
      this._super.apply(this, arguments);
      this._uninstallResizeListener();
    },

    _setDefaults: function _setDefaults() {
      var _this2 = this;

      var defaults = _ember['default'].getWithDefault(this, 'resizeServiceDefaults', {});

      keys(defaults).map(function (key) {
        var classifiedKey = classify(key);
        var defaultKey = 'default' + classifiedKey;
        return _ember['default'].set(_this2, defaultKey, defaults[key]);
      });
    },

    _hasWindowSizeChanged: function _hasWindowSizeChanged(w, h) {
      var debounced = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

      return this.get('widthSensitive') && w !== this.get('_oldWidth' + (debounced ? 'Debounced' : '')) || this.get('heightSensitive') && h !== this.get('_oldHeight' + (debounced ? 'Debounced' : ''));
    },

    _updateCachedWindowSize: function _updateCachedWindowSize(w, h) {
      var debounced = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

      var wKey = '_oldWidth' + (debounced ? 'Debounced' : '');
      var hKey = '_oldHeight' + (debounced ? 'Debounced' : '');
      var props = {};
      props[wKey] = w;
      props[hKey] = h;
      this.setProperties(props);
    },

    _installResizeListener: function _installResizeListener() {
      window.addEventListener('resize', this._onResizeHandler);
    },

    _uninstallResizeListener: function _uninstallResizeListener() {
      window.removeEventListener('resize', this._onResizeHandler);
    },

    _fireResizeNotification: function _fireResizeNotification(evt) {
      var innerWidth = window.innerWidth;
      var innerHeight = window.innerHeight;

      if (this._hasWindowSizeChanged(innerWidth, innerHeight)) {
        this.trigger('didResize', evt);
        this._updateCachedWindowSize(innerWidth, innerHeight);
      }
    },
    _fireDebouncedResizeNotification: function _fireDebouncedResizeNotification(evt) {
      var innerWidth = window.innerWidth;
      var innerHeight = window.innerHeight;

      if (this._hasWindowSizeChanged(innerWidth, innerHeight, true)) {
        this.trigger('debouncedDidResize', evt);
        this._updateCachedWindowSize(innerWidth, innerHeight, true);
      }
    }
  });
});
define('ember-resolver/container-debug-adapter', ['exports', 'ember', 'ember-resolver/utils/module-registry'], function (exports, _ember, _emberResolverUtilsModuleRegistry) {
  'use strict';

  var ContainerDebugAdapter = _ember['default'].ContainerDebugAdapter;

  var ModulesContainerDebugAdapter = null;

  function getPod(type, key, prefix) {
    var match = key.match(new RegExp('^/?' + prefix + '/(.+)/' + type + '$'));
    if (match) {
      return match[1];
    }
  }

  // Support Ember < 1.5-beta.4
  // TODO: Remove this after 1.5.0 is released
  if (typeof ContainerDebugAdapter !== 'undefined') {

    /*
     * This module defines a subclass of Ember.ContainerDebugAdapter that adds two
     * important features:
     *
     *  1) is able provide injections to classes that implement `extend`
     *     (as is typical with Ember).
     */

    ModulesContainerDebugAdapter = ContainerDebugAdapter.extend({
      _moduleRegistry: null,

      init: function init() {
        this._super.apply(this, arguments);

        if (!this._moduleRegistry) {
          this._moduleRegistry = new _emberResolverUtilsModuleRegistry['default']();
        }
      },

      /**
        The container of the application being debugged.
        This property will be injected
        on creation.
         @property container
        @default null
      */

      /**
        The resolver instance of the application
        being debugged. This property will be injected
        on creation.
         @property resolver
        @default null
      */

      /**
        Returns true if it is possible to catalog a list of available
        classes in the resolver for a given type.
         @method canCatalogEntriesByType
        @param {string} type The type. e.g. "model", "controller", "route"
        @return {boolean} whether a list is available for this type.
      */
      canCatalogEntriesByType: function canCatalogEntriesByType() /* type */{
        return true;
      },

      /**
        Returns the available classes a given type.
         @method catalogEntriesByType
        @param {string} type The type. e.g. "model", "controller", "route"
        @return {Array} An array of classes.
      */
      catalogEntriesByType: function catalogEntriesByType(type) {
        var moduleNames = this._moduleRegistry.moduleNames();
        var types = _ember['default'].A();

        var prefix = this.namespace.modulePrefix;

        for (var i = 0, l = moduleNames.length; i < l; i++) {
          var key = moduleNames[i];

          if (key.indexOf(type) !== -1) {
            // Check if it's a pod module
            var name = getPod(type, key, this.namespace.podModulePrefix || prefix);
            if (!name) {
              // Not pod
              name = key.split(type + 's/').pop();

              // Support for different prefix (such as ember-cli addons).
              // Uncomment the code below when
              // https://github.com/ember-cli/ember-resolver/pull/80 is merged.

              //var match = key.match('^/?(.+)/' + type);
              //if (match && match[1] !== prefix) {
              // Different prefix such as an addon
              //name = match[1] + '@' + name;
              //}
            }
            types.addObject(name);
          }
        }
        return types;
      }
    });
  }

  exports['default'] = ModulesContainerDebugAdapter;
});
define('ember-resolver/index', ['exports', 'ember-resolver/resolver'], function (exports, _emberResolverResolver) {
  'use strict';

  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberResolverResolver['default'];
    }
  });
});
define('ember-resolver/resolver', ['exports', 'ember', 'ember-resolver/utils/module-registry', 'ember-resolver/utils/class-factory', 'ember-resolver/utils/make-dictionary'], function (exports, _ember, _emberResolverUtilsModuleRegistry, _emberResolverUtilsClassFactory, _emberResolverUtilsMakeDictionary) {
  /*globals require */

  'use strict';

  /*
   * This module defines a subclass of Ember.DefaultResolver that adds two
   * important features:
   *
   *  1) The resolver makes the container aware of es6 modules via the AMD
   *     output. The loader's _moduleEntries is consulted so that classes can be
   *     resolved directly via the module loader, without needing a manual
   *     `import`.
   *  2) is able to provide injections to classes that implement `extend`
   *     (as is typical with Ember).
   */

  var _Ember$String = _ember['default'].String;
  var underscore = _Ember$String.underscore;
  var classify = _Ember$String.classify;
  var get = _ember['default'].get;
  var DefaultResolver = _ember['default'].DefaultResolver;

  function parseName(fullName) {
    /*jshint validthis:true */

    if (fullName.parsedName === true) {
      return fullName;
    }

    var prefix, type, name;
    var fullNameParts = fullName.split('@');

    // HTMLBars uses helper:@content-helper which collides
    // with ember-cli namespace detection.
    // This will be removed in a future release of HTMLBars.
    if (fullName !== 'helper:@content-helper' && fullNameParts.length === 2) {
      var prefixParts = fullNameParts[0].split(':');

      if (prefixParts.length === 2) {
        prefix = prefixParts[1];
        type = prefixParts[0];
        name = fullNameParts[1];
      } else {
        var nameParts = fullNameParts[1].split(':');

        prefix = fullNameParts[0];
        type = nameParts[0];
        name = nameParts[1];
      }
    } else {
      fullNameParts = fullName.split(':');
      type = fullNameParts[0];
      name = fullNameParts[1];
    }

    var fullNameWithoutType = name;
    var namespace = get(this, 'namespace');
    var root = namespace;

    return {
      parsedName: true,
      fullName: fullName,
      prefix: prefix || this.prefix({ type: type }),
      type: type,
      fullNameWithoutType: fullNameWithoutType,
      name: name,
      root: root,
      resolveMethodName: "resolve" + classify(type)
    };
  }

  function resolveOther(parsedName) {
    /*jshint validthis:true */

    _ember['default'].assert('`modulePrefix` must be defined', this.namespace.modulePrefix);

    var normalizedModuleName = this.findModuleName(parsedName);

    if (normalizedModuleName) {
      var defaultExport = this._extractDefaultExport(normalizedModuleName, parsedName);

      if (defaultExport === undefined) {
        throw new Error(" Expected to find: '" + parsedName.fullName + "' within '" + normalizedModuleName + "' but got 'undefined'. Did you forget to `export default` within '" + normalizedModuleName + "'?");
      }

      if (this.shouldWrapInClassFactory(defaultExport, parsedName)) {
        defaultExport = (0, _emberResolverUtilsClassFactory['default'])(defaultExport);
      }

      return defaultExport;
    } else {
      return this._super(parsedName);
    }
  }

  // Ember.DefaultResolver docs:
  //   https://github.com/emberjs/ember.js/blob/master/packages/ember-application/lib/system/resolver.js
  var Resolver = DefaultResolver.extend({
    resolveOther: resolveOther,
    parseName: parseName,
    resolveTemplate: resolveOther,
    pluralizedTypes: null,
    moduleRegistry: null,

    makeToString: function makeToString(factory, fullName) {
      return '' + this.namespace.modulePrefix + '@' + fullName + ':';
    },

    shouldWrapInClassFactory: function shouldWrapInClassFactory() /* module, parsedName */{
      return false;
    },

    init: function init() {
      this._super();
      this.moduleBasedResolver = true;

      if (!this._moduleRegistry) {
        this._moduleRegistry = new _emberResolverUtilsModuleRegistry['default']();
      }

      this._normalizeCache = (0, _emberResolverUtilsMakeDictionary['default'])();

      this.pluralizedTypes = this.pluralizedTypes || (0, _emberResolverUtilsMakeDictionary['default'])();

      if (!this.pluralizedTypes.config) {
        this.pluralizedTypes.config = 'config';
      }

      this._deprecatedPodModulePrefix = false;
    },

    normalize: function normalize(fullName) {
      return this._normalizeCache[fullName] || (this._normalizeCache[fullName] = this._normalize(fullName));
    },

    _normalize: function _normalize(fullName) {
      // replace `.` with `/` in order to make nested controllers work in the following cases
      // 1. `needs: ['posts/post']`
      // 2. `{{render "posts/post"}}`
      // 3. `this.render('posts/post')` from Route
      var split = fullName.split(':');
      if (split.length > 1) {
        return split[0] + ':' + _ember['default'].String.dasherize(split[1].replace(/\./g, '/'));
      } else {
        return fullName;
      }
    },

    pluralize: function pluralize(type) {
      return this.pluralizedTypes[type] || (this.pluralizedTypes[type] = type + 's');
    },

    podBasedLookupWithPrefix: function podBasedLookupWithPrefix(podPrefix, parsedName) {
      var fullNameWithoutType = parsedName.fullNameWithoutType;

      if (parsedName.type === 'template') {
        fullNameWithoutType = fullNameWithoutType.replace(/^components\//, '');
      }

      return podPrefix + '/' + fullNameWithoutType + '/' + parsedName.type;
    },

    podBasedModuleName: function podBasedModuleName(parsedName) {
      var podPrefix = this.namespace.podModulePrefix || this.namespace.modulePrefix;

      return this.podBasedLookupWithPrefix(podPrefix, parsedName);
    },

    podBasedComponentsInSubdir: function podBasedComponentsInSubdir(parsedName) {
      var podPrefix = this.namespace.podModulePrefix || this.namespace.modulePrefix;
      podPrefix = podPrefix + '/components';

      if (parsedName.type === 'component' || parsedName.fullNameWithoutType.match(/^components/)) {
        return this.podBasedLookupWithPrefix(podPrefix, parsedName);
      }
    },

    mainModuleName: function mainModuleName(parsedName) {
      // if router:main or adapter:main look for a module with just the type first
      var tmpModuleName = parsedName.prefix + '/' + parsedName.type;

      if (parsedName.fullNameWithoutType === 'main') {
        return tmpModuleName;
      }
    },

    defaultModuleName: function defaultModuleName(parsedName) {
      return parsedName.prefix + '/' + this.pluralize(parsedName.type) + '/' + parsedName.fullNameWithoutType;
    },

    prefix: function prefix(parsedName) {
      var tmpPrefix = this.namespace.modulePrefix;

      if (this.namespace[parsedName.type + 'Prefix']) {
        tmpPrefix = this.namespace[parsedName.type + 'Prefix'];
      }

      return tmpPrefix;
    },

    /**
      A listing of functions to test for moduleName's based on the provided
     `parsedName`. This allows easy customization of additional module based
     lookup patterns.
      @property moduleNameLookupPatterns
     @returns {Ember.Array}
     */
    moduleNameLookupPatterns: _ember['default'].computed(function () {
      return [this.podBasedModuleName, this.podBasedComponentsInSubdir, this.mainModuleName, this.defaultModuleName];
    }),

    findModuleName: function findModuleName(parsedName, loggingDisabled) {
      var moduleNameLookupPatterns = this.get('moduleNameLookupPatterns');
      var moduleName;

      for (var index = 0, _length = moduleNameLookupPatterns.length; index < _length; index++) {
        var item = moduleNameLookupPatterns[index];

        var tmpModuleName = item.call(this, parsedName);

        // allow treat all dashed and all underscored as the same thing
        // supports components with dashes and other stuff with underscores.
        if (tmpModuleName) {
          tmpModuleName = this.chooseModuleName(tmpModuleName);
        }

        if (tmpModuleName && this._moduleRegistry.has(tmpModuleName)) {
          moduleName = tmpModuleName;
        }

        if (!loggingDisabled) {
          this._logLookup(moduleName, parsedName, tmpModuleName);
        }

        if (moduleName) {
          return moduleName;
        }
      }
    },

    chooseModuleName: function chooseModuleName(moduleName) {
      var underscoredModuleName = underscore(moduleName);

      if (moduleName !== underscoredModuleName && this._moduleRegistry.has(moduleName) && this._moduleRegistry.has(underscoredModuleName)) {
        throw new TypeError("Ambiguous module names: `" + moduleName + "` and `" + underscoredModuleName + "`");
      }

      if (this._moduleRegistry.has(moduleName)) {
        return moduleName;
      } else if (this._moduleRegistry.has(underscoredModuleName)) {
        return underscoredModuleName;
      } else {
        // workaround for dasherized partials:
        // something/something/-something => something/something/_something
        var partializedModuleName = moduleName.replace(/\/-([^\/]*)$/, '/_$1');

        if (this._moduleRegistry.has(partializedModuleName)) {
          _ember['default'].deprecate('Modules should not contain underscores. ' + 'Attempted to lookup "' + moduleName + '" which ' + 'was not found. Please rename "' + partializedModuleName + '" ' + 'to "' + moduleName + '" instead.', false);

          return partializedModuleName;
        } else {
          return moduleName;
        }
      }
    },

    // used by Ember.DefaultResolver.prototype._logLookup
    lookupDescription: function lookupDescription(fullName) {
      var parsedName = this.parseName(fullName);

      var moduleName = this.findModuleName(parsedName, true);

      return moduleName;
    },

    // only needed until 1.6.0-beta.2 can be required
    _logLookup: function _logLookup(found, parsedName, description) {
      if (!_ember['default'].ENV.LOG_MODULE_RESOLVER && !parsedName.root.LOG_RESOLVER) {
        return;
      }

      var symbol, padding;

      if (found) {
        symbol = '[✓]';
      } else {
        symbol = '[ ]';
      }

      if (parsedName.fullName.length > 60) {
        padding = '.';
      } else {
        padding = new Array(60 - parsedName.fullName.length).join('.');
      }

      if (!description) {
        description = this.lookupDescription(parsedName);
      }

      _ember['default'].Logger.info(symbol, parsedName.fullName, padding, description);
    },

    knownForType: function knownForType(type) {
      var moduleKeys = this._moduleRegistry.moduleNames();

      var items = (0, _emberResolverUtilsMakeDictionary['default'])();
      for (var index = 0, length = moduleKeys.length; index < length; index++) {
        var moduleName = moduleKeys[index];
        var fullname = this.translateToContainerFullname(type, moduleName);

        if (fullname) {
          items[fullname] = true;
        }
      }

      return items;
    },

    translateToContainerFullname: function translateToContainerFullname(type, moduleName) {
      var prefix = this.prefix({ type: type });

      // Note: using string manipulation here rather than regexes for better performance.
      // pod modules
      // '^' + prefix + '/(.+)/' + type + '$'
      var podPrefix = prefix + '/';
      var podSuffix = '/' + type;
      var start = moduleName.indexOf(podPrefix);
      var end = moduleName.indexOf(podSuffix);

      if (start === 0 && end === moduleName.length - podSuffix.length && moduleName.length > podPrefix.length + podSuffix.length) {
        return type + ':' + moduleName.slice(start + podPrefix.length, end);
      }

      // non-pod modules
      // '^' + prefix + '/' + pluralizedType + '/(.+)$'
      var pluralizedType = this.pluralize(type);
      var nonPodPrefix = prefix + '/' + pluralizedType + '/';

      if (moduleName.indexOf(nonPodPrefix) === 0 && moduleName.length > nonPodPrefix.length) {
        return type + ':' + moduleName.slice(nonPodPrefix.length);
      }
    },

    _extractDefaultExport: function _extractDefaultExport(normalizedModuleName) {
      var module = require(normalizedModuleName, null, null, true /* force sync */);

      if (module && module['default']) {
        module = module['default'];
      }

      return module;
    }
  });

  Resolver.reopenClass({
    moduleBasedResolver: true
  });

  exports['default'] = Resolver;
});
define('ember-resolver/utils/class-factory', ['exports'], function (exports) {
  'use strict';

  exports['default'] = classFactory;

  function classFactory(klass) {
    return {
      create: function create(injections) {
        if (typeof klass.extend === 'function') {
          return klass.extend(injections);
        } else {
          return klass;
        }
      }
    };
  }
});
define("ember-resolver/utils/create", ["exports", "ember"], function (exports, _ember) {
  "use strict";

  var create = Object.create || _ember["default"].create;
  if (!(create && !create(null).hasOwnProperty)) {
    throw new Error("This browser does not support Object.create(null), please polyfil with es5-sham: http://git.io/yBU2rg");
  }

  exports["default"] = create;
});
define('ember-resolver/utils/make-dictionary', ['exports', 'ember-resolver/utils/create'], function (exports, _emberResolverUtilsCreate) {
  'use strict';

  exports['default'] = makeDictionary;

  function makeDictionary() {
    var cache = (0, _emberResolverUtilsCreate['default'])(null);
    cache['_dict'] = null;
    delete cache['_dict'];
    return cache;
  }
});
define('ember-resolver/utils/module-registry', ['exports', 'ember'], function (exports, _ember) {
  /*globals requirejs, require */

  'use strict';

  if (typeof requirejs.entries === 'undefined') {
    requirejs.entries = requirejs._eak_seen;
  }

  function ModuleRegistry(entries) {
    this._entries = entries || requirejs.entries;
  }

  ModuleRegistry.prototype.moduleNames = function ModuleRegistry_moduleNames() {
    return (Object.keys || _ember['default'].keys)(this._entries);
  };

  ModuleRegistry.prototype.has = function ModuleRegistry_has(moduleName) {
    return moduleName in this._entries;
  };

  ModuleRegistry.prototype.get = function ModuleRegistry_get(moduleName) {
    var exportName = arguments.length <= 1 || arguments[1] === undefined ? 'default' : arguments[1];

    var module = require(moduleName);
    return module && module[exportName];
  };

  exports['default'] = ModuleRegistry;
});
define('ember-simple-auth/authenticators/base', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  var RSVP = _ember['default'].RSVP;

  /**
    The base class for all authenticators. __This serves as a starting point for
    implementing custom authenticators and must not be used directly.__
  
    The authenticator authenticates the session. The actual mechanism used to do
    this might e.g. be posting a set of credentials to a server and in exchange
    retrieving an access token, initiating authentication against an external
    provider like Facebook etc. and depends on the specific authenticator. Any
    data that the authenticator receives upon successful authentication and
    resolves with from the
    {{#crossLink "BaseAuthenticator/authenticate:method"}}{{/crossLink}}
    method is stored in the session and can be accessed via the session service
    and be used by the authorizer (see
    {{#crossLink "BaseAuthorizer/authorize:method"}}{{/crossLink}}) to e.g.
    authorize outgoing requests.
  
    The authenticator also decides whether a set of data that was restored from
    the session store (see
    {{#crossLink "BaseStore/restore:method"}}{{/crossLink}}) makes up an
    authenticated session or not.
  
    __Authenticators for an application are defined in the `app/authenticators`
    directory__, e.g.:
  
    ```js
    // app/authenticators/oauth2.js
    import OAuth2PasswordGrantAuthenticator from 'ember-simple-auth/authenticators/oauth2-password-grant';
  
    export default OAuth2PasswordGrantAuthenticator.extend({
      ...
    });
    ```
  
    and can then be used with the name Ember CLI automatically registers them
    with in the Ember container:
  
    ```js
    // app/components/login-form.js
    export default Ember.Controller.extend({
      session: Ember.inject.service(),
  
      actions: {
        authenticate: function() {
          this.get('session').authenticate('authenticator:oauth2');
        }
      }
    });
    ```
  
    @class BaseAuthenticator
    @module ember-simple-auth/authenticators/base
    @extends Ember.Object
    @uses Ember.Evented
    @public
  */
  exports['default'] = _ember['default'].Object.extend(_ember['default'].Evented, {
    /**
      __Triggered when the authentication data is updated by the authenticator
      due to an external or scheduled event__. This might happen e.g. if the
      authenticator refreshes an expired token or an event is triggered from an
      external authentication provider that the authenticator uses. The session
      handles that event, passes the updated data back to the authenticator's
      {{#crossLink "BaseAuthenticator/restore:method"}}{{/crossLink}}
      method and handles the result of that invocation accordingly.
       @event sessionDataUpdated
      @param {Object} data The updated session data
      @public
    */

    /**
      __Triggered when the authenciation data is invalidated by the authenticator
      due to an external or scheduled event__. This might happen e.g. if a token
      expires or an event is triggered from an external authentication provider
      that the authenticator uses. The session handles that event and will
      invalidate itself when it is triggered.
       @event sessionDataInvalidated
      @public
    */

    /**
      Restores the session from a session data object. __This method is invoked
      by the session either on application startup if session data is restored
      from the session store__ or when properties in the store change due to
      external events (e.g. in another tab) and the new session data needs to be
      validated for whether it constitutes an authenticated session.
       __This method returns a promise. A resolving promise results in the session
      becoming or remaining authenticated.__ Any data the promise resolves with
      will be saved in and accessible via the session service's
      `data.authenticated` property (see
      {{#crossLink "SessionService/data:property"}}{{/crossLink}}). A rejecting
      promise indicates that `data` does not constitute a valid session and will
      result in the session being invalidated or remaining unauthencicated.
       The `BaseAuthenticator`'s implementation always returns a rejecting
      promise. __This method must be overridden in subclasses.__
       @method restore
      @param {Object} data The data to restore the session from
      @return {Ember.RSVP.Promise} A promise that when it resolves results in the session becoming or remaining authenticated
      @public
    */
    restore: function restore() {
      return RSVP.reject();
    },

    /**
      Authenticates the session with the specified `args`. These options vary
      depending on the actual authentication mechanism the authenticator
      implements (e.g. a set of credentials or a Facebook account id etc.). __The
      session will invoke this method in order to authenticate itself__ (see
      {{#crossLink "SessionService/authenticate:method"}}{{/crossLink}}).
       __This method returns a promise. A resolving promise will result in the
      session becoming authenticated.__ Any data the promise resolves with will
      be saved in and accessible via the session service's `data.authenticated`
      property (see {{#crossLink "SessionService/data:property"}}{{/crossLink}}).
      A rejecting promise indicates that authentication failed and will result in
      the session remaining unauthenticated.
       The `BaseAuthenticator`'s implementation always returns a rejecting promise
      and thus never authenticates the session. __This method must be overridden
      in subclasses__.
       @method authenticate
      @param {Any} [...args] The arguments that the authenticator requires to authenticate the session
      @return {Ember.RSVP.Promise} A promise that when it resolves results in the session becoming authenticated
      @public
    */
    authenticate: function authenticate() {
      return RSVP.reject();
    },

    /**
      This method is invoked as a callback when the session is invalidated. While
      the session will invalidate itself and clear all authenticated session data,
      it might be necessary for some authenticators to perform additional tasks
      (e.g. invalidating an access token on the server side).
       __This method returns a promise. A resolving promise will result in the
      session becoming unauthenticated.__ A rejecting promise will result in
      invalidation being intercepted and the session remaining authenticated.
       The `BaseAuthenticator`'s implementation always returns a resolving promise
      and thus never intercepts session invalidation. __This method doesn't have
      to be overridden in custom authenticators__ if no actions need to be
      performed on session invalidation.
       @method invalidate
      @param {Object} data The current authenticated session data
      @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being invalidated
      @public
    */
    invalidate: function invalidate() {
      return RSVP.resolve();
    }
  });
});
define('ember-simple-auth/authenticators/devise', ['exports', 'ember', 'ember-simple-auth/authenticators/base'], function (exports, _ember, _emberSimpleAuthAuthenticatorsBase) {
  'use strict';

  var Promise = _ember['default'].RSVP.Promise;
  var isEmpty = _ember['default'].isEmpty;
  var run = _ember['default'].run;
  var get = _ember['default'].get;
  var $ = _ember['default'].$;

  /**
    Authenticator that works with the Ruby gem
    [devise](https://github.com/plataformatec/devise).
  
    __As token authentication is not actually part of devise anymore, the server
    needs to implement some customizations__ to work with this authenticator -
    see [this gist](https://gist.github.com/josevalim/fb706b1e933ef01e4fb6).
  
    @class DeviseAuthenticator
    @module ember-simple-auth/authenticators/devise
    @extends BaseAuthenticator
    @public
  */
  exports['default'] = _emberSimpleAuthAuthenticatorsBase['default'].extend({
    /**
      The endpoint on the server that the authentication request is sent to.
       @property serverTokenEndpoint
      @type String
      @default '/users/sign_in'
      @public
    */
    serverTokenEndpoint: '/users/sign_in',

    /**
      The devise resource name. __This will be used in the request and also be
      expected in the server's response.__
       @property resourceName
      @type String
      @default 'user'
      @public
    */
    resourceName: 'user',

    /**
      The token attribute name. __This will be used in the request and also be
      expected in the server's response.__
       @property tokenAttributeName
      @type String
      @default 'token'
      @public
    */
    tokenAttributeName: 'token',

    /**
      The identification attribute name. __This will be used in the request and
      also be expected in the server's response.__
       @property identificationAttributeName
      @type String
      @default 'email'
      @public
    */
    identificationAttributeName: 'email',

    /**
      Restores the session from a session data object; __returns a resolving
      promise when there are non-empty
      {{#crossLink "DeviseAuthenticator/tokenAttributeName:property"}}token{{/crossLink}}
      and
      {{#crossLink "DeviseAuthenticator/identificationAttributeName:property"}}identification{{/crossLink}}
      values in `data`__ and a rejecting promise otherwise.
       @method restore
      @param {Object} data The data to restore the session from
      @return {Ember.RSVP.Promise} A promise that when it resolves results in the session becoming or remaining authenticated
      @public
    */
    restore: function restore(data) {
      var _getProperties = this.getProperties('tokenAttributeName', 'identificationAttributeName');

      var tokenAttributeName = _getProperties.tokenAttributeName;
      var identificationAttributeName = _getProperties.identificationAttributeName;

      var tokenAttribute = get(data, tokenAttributeName);
      var identificationAttribute = get(data, identificationAttributeName);

      if (!isEmpty(tokenAttribute) && !isEmpty(identificationAttribute)) {
        return Promise.resolve(data);
      } else {
        return Promise.reject();
      }
    },

    /**
      Authenticates the session with the specified `identification` and
      `password`; the credentials are `POST`ed to the
      {{#crossLink "DeviseAuthenticator/serverTokenEndpoint:property"}}server{{/crossLink}}.
      If the credentials are valid the server will responds with a
      {{#crossLink "DeviseAuthenticator/tokenAttributeName:property"}}token{{/crossLink}}
      and
      {{#crossLink "DeviseAuthenticator/identificationAttributeName:property"}}identification{{/crossLink}}.
      __If the credentials are valid and authentication succeeds, a promise that
      resolves with the server's response is returned__, otherwise a promise that
      rejects with the server error is returned.
       @method authenticate
      @param {String} identification The user's identification
      @param {String} password The user's password
      @return {Ember.RSVP.Promise} A promise that when it resolves results in the session becoming authenticated
      @public
    */
    authenticate: function authenticate(identification, password) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var _getProperties2 = _this.getProperties('resourceName', 'identificationAttributeName');

        var resourceName = _getProperties2.resourceName;
        var identificationAttributeName = _getProperties2.identificationAttributeName;

        var data = {};
        data[resourceName] = { password: password };
        data[resourceName][identificationAttributeName] = identification;

        return _this.makeRequest(data).then(function (response) {
          return run(null, resolve, response);
        }, function (xhr) {
          return run(null, reject, xhr.responseJSON || xhr.responseText);
        });
      });
    },

    /**
      Does nothing
       @method invalidate
      @return {Ember.RSVP.Promise} A resolving promise
      @public
    */
    invalidate: function invalidate() {
      return Promise.resolve();
    },

    /**
      Makes a request to the devise server.
       @method makeRequest
      @param {Object} data The request data
      @param {Object} options Ajax configuration object merged into argument of `$.ajax`
      @return {jQuery.Deferred} A promise like jQuery.Deferred as returned by `$.ajax`
      @protected
    */
    makeRequest: function makeRequest(data, options) {
      var serverTokenEndpoint = this.get('serverTokenEndpoint');
      var requestOptions = $.extend({}, {
        url: serverTokenEndpoint,
        type: 'POST',
        dataType: 'json',
        data: data,
        beforeSend: function beforeSend(xhr, settings) {
          xhr.setRequestHeader('Accept', settings.accepts.json);
        }
      }, options || {});

      return $.ajax(requestOptions);
    }
  });
});
define('ember-simple-auth/authenticators/oauth2-password-grant', ['exports', 'ember', 'ember-simple-auth/authenticators/base'], function (exports, _ember, _emberSimpleAuthAuthenticatorsBase) {
  /* jscs:disable requireDotNotation */
  'use strict';

  var RSVP = _ember['default'].RSVP;
  var isEmpty = _ember['default'].isEmpty;
  var run = _ember['default'].run;
  var computed = _ember['default'].computed;

  /**
    Authenticator that conforms to OAuth 2
    ([RFC 6749](http://tools.ietf.org/html/rfc6749)), specifically the _"Resource
    Owner Password Credentials Grant Type"_.
  
    This authenticator also automatically refreshes access tokens (see
    [RFC 6749, section 6](http://tools.ietf.org/html/rfc6749#section-6)) if the
    server supports it.
  
    @class OAuth2PasswordGrantAuthenticator
    @module ember-simple-auth/authenticators/oauth2-password-grant
    @extends BaseAuthenticator
    @public
  */
  exports['default'] = _emberSimpleAuthAuthenticatorsBase['default'].extend({
    /**
      Triggered when the authenticator refreshed the access token (see
      [RFC 6749, section 6](http://tools.ietf.org/html/rfc6749#section-6)).
       @event sessionDataUpdated
      @param {Object} data The updated session data
      @public
    */

    /**
      The client_id to be sent to the authentication server (see
      https://tools.ietf.org/html/rfc6749#appendix-A.1). __This should only be
      used for statistics or logging etc. as it cannot actually be trusted since
      it could have been manipulated on the client!__
       @property clientId
      @type String
      @default null
      @public
    */
    clientId: null,

    /**
      The endpoint on the server that authentication and token refresh requests
      are sent to.
       @property serverTokenEndpoint
      @type String
      @default '/token'
      @public
    */
    serverTokenEndpoint: '/token',

    /**
      The endpoint on the server that token revocation requests are sent to. Only
      set this if the server actually supports token revokation. If this is
      `null`, the authenticator will not revoke tokens on session invalidation.
       __If token revocation is enabled but fails, session invalidation will be
      intercepted and the session will remain authenticated (see
      {{#crossLink "OAuth2PasswordGrantAuthenticator/invalidate:method"}}{{/crossLink}}).__
       @property serverTokenRevocationEndpoint
      @type String
      @default null
      @public
    */
    serverTokenRevocationEndpoint: null,

    /**
      Sets whether the authenticator automatically refreshes access tokens if the
      server supports it.
       @property refreshAccessTokens
      @type Boolean
      @default true
      @public
    */
    refreshAccessTokens: true,

    _refreshTokenTimeout: null,

    _clientIdHeader: computed('clientId', function () {
      var clientId = this.get('clientId');

      if (!isEmpty(clientId)) {
        var base64ClientId = window.btoa(clientId.concat(':'));
        return { Authorization: 'Basic ' + base64ClientId };
      }
    }),

    /**
      Restores the session from a session data object; __will return a resolving
      promise when there is a non-empty `access_token` in the session data__ and
      a rejecting promise otherwise.
       If the server issues
      [expiring access tokens](https://tools.ietf.org/html/rfc6749#section-5.1)
      and there is an expired access token in the session data along with a
      refresh token, the authenticator will try to refresh the access token and
      return a promise that resolves with the new access token if the refresh was
      successful. If there is no refresh token or the token refresh is not
      successful, a rejecting promise will be returned.
       @method restore
      @param {Object} data The data to restore the session from
      @return {Ember.RSVP.Promise} A promise that when it resolves results in the session becoming or remaining authenticated
      @public
    */
    restore: function restore(data) {
      var _this = this;

      return new RSVP.Promise(function (resolve, reject) {
        var now = new Date().getTime();
        var refreshAccessTokens = _this.get('refreshAccessTokens');
        if (!isEmpty(data['expires_at']) && data['expires_at'] < now) {
          if (refreshAccessTokens) {
            _this._refreshAccessToken(data['expires_in'], data['refresh_token']).then(resolve, reject);
          } else {
            reject();
          }
        } else {
          if (isEmpty(data['access_token'])) {
            reject();
          } else {
            _this._scheduleAccessTokenRefresh(data['expires_in'], data['expires_at'], data['refresh_token']);
            resolve(data);
          }
        }
      });
    },

    /**
      Authenticates the session with the specified `identification`, `password`
      and optional `scope`; issues a `POST` request to the
      {{#crossLink "OAuth2PasswordGrantAuthenticator/serverTokenEndpoint:property"}}{{/crossLink}}
      and receives the access token in response (see
      http://tools.ietf.org/html/rfc6749#section-4.3).
       __If the credentials are valid (and the optionally requested scope is
      granted) and thus authentication succeeds, a promise that resolves with the
      server's response is returned__, otherwise a promise that rejects with the
      error as returned by the server is returned.
       __If the
      [server supports it](https://tools.ietf.org/html/rfc6749#section-5.1), this
      method also schedules refresh requests for the access token before it
      expires.__
       @method authenticate
      @param {String} identification The resource owner username
      @param {String} password The resource owner password
      @param {String|Array} scope The scope of the access request (see [RFC 6749, section 3.3](http://tools.ietf.org/html/rfc6749#section-3.3))
      @return {Ember.RSVP.Promise} A promise that when it resolves results in the session becoming authenticated
      @public
    */
    authenticate: function authenticate(identification, password) {
      var _this2 = this;

      var scope = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

      return new RSVP.Promise(function (resolve, reject) {
        var data = { 'grant_type': 'password', username: identification, password: password };
        var serverTokenEndpoint = _this2.get('serverTokenEndpoint');
        var scopesString = _ember['default'].makeArray(scope).join(' ');
        if (!_ember['default'].isEmpty(scopesString)) {
          data.scope = scopesString;
        }
        _this2.makeRequest(serverTokenEndpoint, data).then(function (response) {
          run(function () {
            var expiresAt = _this2._absolutizeExpirationTime(response['expires_in']);
            _this2._scheduleAccessTokenRefresh(response['expires_in'], expiresAt, response['refresh_token']);
            if (!isEmpty(expiresAt)) {
              response = _ember['default'].merge(response, { 'expires_at': expiresAt });
            }
            resolve(response);
          });
        }, function (xhr) {
          run(null, reject, xhr.responseJSON || xhr.responseText);
        });
      });
    },

    /**
      If token revocation is enabled, this will revoke the access token (and the
      refresh token if present). If token revocation succeeds, this method
      returns a resolving promise, otherwise it will return a rejecting promise,
      thus intercepting session invalidation.
       If token revocation is not enabled this method simply returns a resolving
      promise.
       @method invalidate
      @param {Object} data The current authenticated session data
      @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being invalidated
      @public
    */
    invalidate: function invalidate(data) {
      var _this3 = this;

      var serverTokenRevocationEndpoint = this.get('serverTokenRevocationEndpoint');
      function success(resolve) {
        run.cancel(this._refreshTokenTimeout);
        delete this._refreshTokenTimeout;
        resolve();
      }
      return new RSVP.Promise(function (resolve) {
        if (isEmpty(serverTokenRevocationEndpoint)) {
          success.apply(_this3, [resolve]);
        } else {
          (function () {
            var requests = [];
            _ember['default'].A(['access_token', 'refresh_token']).forEach(function (tokenType) {
              var token = data[tokenType];
              if (!isEmpty(token)) {
                requests.push(_this3.makeRequest(serverTokenRevocationEndpoint, {
                  'token_type_hint': tokenType, token: token
                }));
              }
            });
            var succeed = function succeed() {
              success.apply(_this3, [resolve]);
            };
            RSVP.all(requests).then(succeed, succeed);
          })();
        }
      });
    },

    /**
      Makes a request to the OAuth 2.0 server.
       @method makeRequest
      @param {String} url The request URL
      @param {Object} data The request data
      @return {jQuery.Deferred} A promise like jQuery.Deferred as returned by `$.ajax`
      @protected
    */
    makeRequest: function makeRequest(url, data) {
      var options = {
        url: url,
        data: data,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded'
      };

      var clientIdHeader = this.get('_clientIdHeader');
      if (!isEmpty(clientIdHeader)) {
        options.headers = clientIdHeader;
      }

      return _ember['default'].$.ajax(options);
    },

    _scheduleAccessTokenRefresh: function _scheduleAccessTokenRefresh(expiresIn, expiresAt, refreshToken) {
      var refreshAccessTokens = this.get('refreshAccessTokens');
      if (refreshAccessTokens) {
        var now = new Date().getTime();
        if (isEmpty(expiresAt) && !isEmpty(expiresIn)) {
          expiresAt = new Date(now + expiresIn * 1000).getTime();
        }
        var offset = (Math.floor(Math.random() * 5) + 5) * 1000;
        if (!isEmpty(refreshToken) && !isEmpty(expiresAt) && expiresAt > now - offset) {
          run.cancel(this._refreshTokenTimeout);
          delete this._refreshTokenTimeout;
          if (!_ember['default'].testing) {
            this._refreshTokenTimeout = run.later(this, this._refreshAccessToken, expiresIn, refreshToken, expiresAt - now - offset);
          }
        }
      }
    },

    _refreshAccessToken: function _refreshAccessToken(expiresIn, refreshToken) {
      var _this4 = this;

      var data = { 'grant_type': 'refresh_token', 'refresh_token': refreshToken };
      var serverTokenEndpoint = this.get('serverTokenEndpoint');
      return new RSVP.Promise(function (resolve, reject) {
        _this4.makeRequest(serverTokenEndpoint, data).then(function (response) {
          run(function () {
            expiresIn = response['expires_in'] || expiresIn;
            refreshToken = response['refresh_token'] || refreshToken;
            var expiresAt = _this4._absolutizeExpirationTime(expiresIn);
            var data = _ember['default'].merge(response, { 'expires_in': expiresIn, 'expires_at': expiresAt, 'refresh_token': refreshToken });
            _this4._scheduleAccessTokenRefresh(expiresIn, null, refreshToken);
            _this4.trigger('sessionDataUpdated', data);
            resolve(data);
          });
        }, function (xhr, status, error) {
          _ember['default'].Logger.warn('Access token could not be refreshed - server responded with ' + error + '.');
          reject();
        });
      });
    },

    _absolutizeExpirationTime: function _absolutizeExpirationTime(expiresIn) {
      if (!isEmpty(expiresIn)) {
        return new Date(new Date().getTime() + expiresIn * 1000).getTime();
      }
    }
  });
});
define('ember-simple-auth/authenticators/test', ['exports', 'ember', 'ember-simple-auth/authenticators/base'], function (exports, _ember, _emberSimpleAuthAuthenticatorsBase) {
  'use strict';

  var RSVP = _ember['default'].RSVP;

  exports['default'] = _emberSimpleAuthAuthenticatorsBase['default'].extend({
    restore: function restore(data) {
      return RSVP.resolve(data);
    },

    authenticate: function authenticate(data) {
      return RSVP.resolve(data);
    },

    invalidate: function invalidate() {
      return RSVP.resolve();
    }
  });
});
define('ember-simple-auth/authenticators/torii', ['exports', 'ember', 'ember-simple-auth/authenticators/base'], function (exports, _ember, _emberSimpleAuthAuthenticatorsBase) {
  'use strict';

  var RSVP = _ember['default'].RSVP;
  var isEmpty = _ember['default'].isEmpty;

  /**
    Authenticator that wraps the
    [Torii library](https://github.com/Vestorly/torii) and thus allows to connect
    any external authentication provider that torii defines a provider for.
  
    In order to use this authenticator, __the application needs to have the
    [torii addon](https://github.com/Vestorly/torii) installed and must inject
    the torii service into the authenticator__:
  
    ```js
    // app/authenticators/torii.js
    import ToriiAuthenticator from 'ember-simple-auth/authenticators/torii';
  
    export default ToriiAuthenticator.extend(
      torii: Ember.inject.service()
    )
    ```
  
    @class ToriiAuthenticator
    @module ember-simple-auth/authenticators/torii
    @extends BaseAuthenticator
    @public
  */
  exports['default'] = _emberSimpleAuthAuthenticatorsBase['default'].extend({
    _provider: null,

    /**
      Restores the session by calling the torii provider's `fetch` method.
       __Many torii providers do not implement the `fetch` method__. If the
      provider in use does not implement the method simply add it as follows:
       ```js
      // app/torii-providers/facebook.js
      import FacebookOauth2Provider from 'torii/providers/facebook-oauth2';
       export default FacebookOauth2Provider.extend({
        fetch(data) {
          return data;
        }
      });
      ```
       @method restore
      @param {Object} data The data to restore the session from
      @return {Ember.RSVP.Promise} A promise that when it resolves results in the session becoming or remaining authenticated
      @public
    */
    restore: function restore(data) {
      var _this = this;

      this._assertToriiIsPresent();

      data = data || {};
      if (!isEmpty(data.provider)) {
        var _ret = (function () {
          var _data = data;
          var provider = _data.provider;

          return {
            v: _this.get('torii').fetch(data.provider, data).then(function (data) {
              _this._authenticateWithProvider(provider, data);
              return data;
            }, function () {
              return delete _this._provider;
            })
          };
        })();

        if (typeof _ret === 'object') return _ret.v;
      } else {
        delete this._provider;
        return RSVP.reject();
      }
    },

    /**
      Authenticates the session by opening the specified torii provider. For more
      documentation on torii and its providers abstraction, see the
      [project's README](https://github.com/Vestorly/torii#readme), specifically
      the
      [section on providers](https://github.com/Vestorly/torii#configuring-a-torii-provider).
       @method authenticate
      @param {String} provider The torii provider to authenticate the session with
      @param {Object} options The options to pass to the torii provider
      @return {Ember.RSVP.Promise} A promise that when it resolves results in the session becoming authenticated
      @public
    */
    authenticate: function authenticate(provider, options) {
      var _this2 = this;

      this._assertToriiIsPresent();

      return this.get('torii').open(provider, options || {}).then(function (data) {
        _this2._authenticateWithProvider(provider, data);
        return data;
      });
    },

    /**
      Closes the torii provider. If the provider is successfully closed, this
      method returns a resolving promise, otherwise it will return a rejecting
      promise, thus intercepting session invalidation.
       @method invalidate
      @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being invalidated
      @public
    */
    invalidate: function invalidate(data) {
      var _this3 = this;

      return this.get('torii').close(this._provider, data).then(function () {
        delete _this3._provider;
      });
    },

    _authenticateWithProvider: function _authenticateWithProvider(provider, data) {
      data.provider = provider;
      this._provider = data.provider;
    },

    _assertToriiIsPresent: function _assertToriiIsPresent() {
      var torii = this.get('torii');
      _ember['default'].assert('You are trying to use the torii authenticator but torii is not available. Inject torii into the authenticator with "torii: Ember.inject.service()".', _ember['default'].isPresent(torii));
    }
  });
});
define('ember-simple-auth/authorizers/base', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  /**
    The base class for all authorizers. __This serves as a starting point for
    implementing custom authorizers and must not be used directly.__
  
    Authorizers use the session data aqcuired by an authenticator when
    authenticating the session to construct authrorization data that can e.g. be
    injected into outgoing network requests etc. Depending on the authorization
    mechanism the authorizer implements, that authorization data might be an HTTP
    header, query string parameters, a cookie etc.
  
    __The authorizer has to fit the authenticator__ (see
    {{#crossLink "BaseAuthenticator"}}{{/crossLink}})
    as it can only use data that the authenticator acquires when authenticating
    the session.
  
    @class BaseAuthorizer
    @module ember-simple-auth/authorizers/base
    @extends Ember.Object
    @public
  */
  exports['default'] = _ember['default'].Object.extend({
    /**
      Authorizes a block of code. This method will be invoked by the session
      service's {{#crossLink "SessionService/authorize:method"}}{{/crossLink}}
      method which will pass the current authenticated session data (see
      {{#crossLink "SessionService/data:property"}}{{/crossLink}}) and a block.
      Depending on the mechanism it implements, the authorizer transforms the
      session data into authorization data and invokes the block with that data.
       `BaseAuthorizer`'s implementation does nothing. __This method must be
      overridden in custom authorizers.__
       @method authorize
      @param {Object} data The current authenticated session data
      @param {Function} block The callback to call with the authorization data
      @public
    */
    authorize: function authorize() {}
  });
});
define('ember-simple-auth/authorizers/devise', ['exports', 'ember', 'ember-simple-auth/authorizers/base'], function (exports, _ember, _emberSimpleAuthAuthorizersBase) {
  'use strict';

  var isEmpty = _ember['default'].isEmpty;

  /**
    Authorizer that works with the Ruby gem
    [devise](https://github.com/plataformatec/devise); includes the user's token
    and identification from the session data in the `Authorization` HTTP header,
    e.g.:
  
    ```
    Authorization: token="234rtgjneroigne4" email="user@domain.tld"
    ```
  
    __As token authentication is not actually part of devise anymore, the server
    needs to implement some customizations__ to work with this authenticator -
    see [this gist](https://gist.github.com/josevalim/fb706b1e933ef01e4fb6).
  
    @class DeviseAuthorizer
    @module ember-simple-auth/authorizers/devise
    @extends BaseAuthorizer
    @public
  */
  exports['default'] = _emberSimpleAuthAuthorizersBase['default'].extend({
    /**
      The token attribute name.
       @property tokenAttributeName
      @type String
      @default 'token'
      @public
    */
    tokenAttributeName: 'token',

    /**
      The identification attribute name.
       @property identificationAttributeName
      @type String
      @default 'email'
      @public
    */
    identificationAttributeName: 'email',

    /**
      Includes the user's token (see
      {{#crossLink "DeviseAuthenticator/tokenAttributeName:property"}}{{/crossLink}})
      and identification (see
      {{#crossLink "DeviseAuthenticator/identificationAttributeName:property"}}{{/crossLink}})
      in the `Authorization` header.
       @method authorize
      @param {Object} data The data that the session currently holds
      @param {Function} block(headerName,headerContent) The callback to call with the authorization data; will receive the header name and header content as arguments
      @public
    */
    authorize: function authorize(data, block) {
      var _getProperties = this.getProperties('tokenAttributeName', 'identificationAttributeName');

      var tokenAttributeName = _getProperties.tokenAttributeName;
      var identificationAttributeName = _getProperties.identificationAttributeName;

      var userToken = data[tokenAttributeName];
      var userIdentification = data[identificationAttributeName];

      if (!isEmpty(userToken) && !isEmpty(userIdentification)) {
        var authData = tokenAttributeName + '="' + userToken + '", ' + identificationAttributeName + '="' + userIdentification + '"';
        block('Authorization', 'Token ' + authData);
      }
    }
  });
});
define('ember-simple-auth/authorizers/oauth2-bearer', ['exports', 'ember', 'ember-simple-auth/authorizers/base'], function (exports, _ember, _emberSimpleAuthAuthorizersBase) {
  /* jscs:disable requireDotNotation */
  'use strict';

  var isEmpty = _ember['default'].isEmpty;

  /**
    Authorizer that conforms to OAuth 2
    ([RFC 6749](http://tools.ietf.org/html/rfc6749)); includes the access token
    from the session data as a bearer token
    ([RFC 6750](http://tools.ietf.org/html/rfc6750)) in the `Authorization`
    header, e.g.:
  
    ```
    Authorization: Bearer 234rtgjneroigne4
    ```
  
    @class OAuth2BearerAuthorizer
    @module ember-simple-auth/authorizers/oauth2-bearer
    @extends BaseAuthorizer
    @public
  */
  exports['default'] = _emberSimpleAuthAuthorizersBase['default'].extend({
    /**
      Includes the access token from the session data into the `Authorization`
      header as a Bearer token, e.g.:
       ```
      Authorization: Bearer 234rtgjneroigne4
      ```
       @method authorize
      @param {Object} data The data that the session currently holds
      @param {Function} block(headerName,headerContent) The callback to call with the authorization data; will receive the header name and header content as arguments
      @public
    */
    authorize: function authorize(data, block) {
      var accessToken = data['access_token'];

      if (!isEmpty(accessToken)) {
        block('Authorization', 'Bearer ' + accessToken);
      }
    }
  });
});
define('ember-simple-auth/configuration', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  var getWithDefault = _ember['default'].getWithDefault;

  var DEFAULTS = {
    baseURL: '',
    authenticationRoute: 'login',
    routeAfterAuthentication: 'index',
    routeIfAlreadyAuthenticated: 'index'
  };

  /**
    Ember Simple Auth's configuration object.
  
    To change any of these values, set them on the application's environment
    object, e.g.:
  
    ```js
    // config/environment.js
    ENV['ember-simple-auth'] = {
      authenticationRoute: 'sign-in'
    };
    ```
  
    @class Configuration
    @extends Object
    @module ember-simple-auth/configuration
    @public
  */
  exports['default'] = {
    /**
      The base URL of the application as configured in `config/environment.js`.
       @property baseURL
      @readOnly
      @static
      @type String
      @default ''
      @public
    */
    baseURL: DEFAULTS.baseURL,

    /**
      The route to transition to for authentication. The
      {{#crossLink "AuthenticatedRouteMixin"}}{{/crossLink}} will transition to
      this route when a route that implements the mixin is accessed when the
      route is not authenticated.
       @property authenticationRoute
      @readOnly
      @static
      @type String
      @default 'login'
      @public
    */
    authenticationRoute: DEFAULTS.authenticationRoute,

    /**
      The route to transition to after successful authentication.
       @property routeAfterAuthentication
      @readOnly
      @static
      @type String
      @default 'index'
      @public
    */
    routeAfterAuthentication: DEFAULTS.routeAfterAuthentication,

    /**
      The route to transition to if a route that implements the
      {{#crossLink "UnauthenticatedRouteMixin"}}{{/crossLink}} is accessed when
      the session is authenticated.
       @property routeIfAlreadyAuthenticated
      @readOnly
      @static
      @type String
      @default 'index'
      @public
    */
    routeIfAlreadyAuthenticated: DEFAULTS.routeIfAlreadyAuthenticated,

    load: function load(config) {
      for (var property in this) {
        if (this.hasOwnProperty(property) && _ember['default'].typeOf(this[property]) !== 'function') {
          this[property] = getWithDefault(config, property, DEFAULTS[property]);
        }
      }
    }
  };
});
define('ember-simple-auth/initializers/setup-session-service', ['exports', 'ember-simple-auth/utils/inject'], function (exports, _emberSimpleAuthUtilsInject) {
  'use strict';

  exports['default'] = setupSessionStore;

  function setupSessionStore(registry) {
    (0, _emberSimpleAuthUtilsInject['default'])(registry, 'service:session', 'session', 'session:main');
  }
});
define('ember-simple-auth/initializers/setup-session', ['exports', 'ember', 'ember-simple-auth/internal-session', 'ember-simple-auth/session-stores/ephemeral', 'ember-simple-auth/utils/inject'], function (exports, _ember, _emberSimpleAuthInternalSession, _emberSimpleAuthSessionStoresEphemeral, _emberSimpleAuthUtilsInject) {
  'use strict';

  exports['default'] = setupSession;

  function setupSession(registry) {
    registry.register('session:main', _emberSimpleAuthInternalSession['default']);

    var store = 'session-store:application';
    if (_ember['default'].testing) {
      store = 'session-store:test';
      registry.register(store, _emberSimpleAuthSessionStoresEphemeral['default']);
    }
    (0, _emberSimpleAuthUtilsInject['default'])(registry, 'session:main', 'store', store);
  }
});
define('ember-simple-auth/instance-initializers/setup-session-restoration', ['exports', 'ember-simple-auth/utils/lookup'], function (exports, _emberSimpleAuthUtilsLookup) {
  'use strict';

  exports['default'] = setupSessionRestoration;

  function setupSessionRestoration(instance) {
    var applicationRoute = (0, _emberSimpleAuthUtilsLookup['default'])(instance, 'route:application');
    var session = (0, _emberSimpleAuthUtilsLookup['default'])(instance, 'session:main');
    var originalBeforeModel = applicationRoute.beforeModel;
    var applyOriginalBeforeModel = function applyOriginalBeforeModel() {
      return originalBeforeModel.apply(applicationRoute, arguments);
    };
    applicationRoute.reopen({
      beforeModel: function beforeModel() {
        var _arguments = arguments;

        return session.restore().then(function () {
          return applyOriginalBeforeModel.apply(undefined, _arguments);
        }, function () {
          return applyOriginalBeforeModel.apply(undefined, _arguments);
        });
      }
    });
  }
});
define('ember-simple-auth/internal-session', ['exports', 'ember', 'ember-getowner-polyfill'], function (exports, _ember, _emberGetownerPolyfill) {
  'use strict';

  var RSVP = _ember['default'].RSVP;
  var on = _ember['default'].on;
  var isNone = _ember['default'].isNone;
  var isEmpty = _ember['default'].isEmpty;

  exports['default'] = _ember['default'].ObjectProxy.extend(_ember['default'].Evented, {
    authenticator: null,
    store: null,
    isAuthenticated: false,
    attemptedTransition: null,

    init: function init() {
      this._super.apply(this, arguments);
      this.set('content', { authenticated: {} });
    },

    authenticate: function authenticate(authenticatorFactory) {
      var _this = this;

      _ember['default'].assert('Session#authenticate requires the authenticator to be specified, was "' + authenticatorFactory + '"!', !isEmpty(authenticatorFactory));
      var authenticator = this._lookupAuthenticator(authenticatorFactory);
      _ember['default'].assert('No authenticator for factory "' + authenticatorFactory + '" could be found!', !isNone(authenticator));

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return authenticator.authenticate.apply(authenticator, args).then(function (content) {
        return _this._setup(authenticatorFactory, content, true);
      }, function (error) {
        var rejectWithError = function rejectWithError() {
          return RSVP.Promise.reject(error);
        };

        return _this._clear().then(rejectWithError, rejectWithError);
      });
    },

    invalidate: function invalidate() {
      var _this2 = this;

      _ember['default'].assert('Session#invalidate requires the session to be authenticated!', this.get('isAuthenticated'));

      var authenticator = this._lookupAuthenticator(this.authenticator);
      return authenticator.invalidate(this.content.authenticated).then(function () {
        authenticator.off('sessionDataUpdated');
        return _this2._clear(true);
      }, function (error) {
        _this2.trigger('sessionInvalidationFailed', error);
        return RSVP.Promise.reject(error);
      });
    },

    restore: function restore() {
      var _this3 = this;

      var reject = function reject() {
        return RSVP.Promise.reject();
      };

      return this._callStoreAsync('restore').then(function (restoredContent) {
        var _ref = restoredContent.authenticated || {};

        var authenticatorFactory = _ref.authenticator;

        if (!!authenticatorFactory) {
          delete restoredContent.authenticated.authenticator;
          var authenticator = _this3._lookupAuthenticator(authenticatorFactory);
          return authenticator.restore(restoredContent.authenticated).then(function (content) {
            _this3.set('content', restoredContent);
            return _this3._setup(authenticatorFactory, content);
          }, function (err) {
            _ember['default'].Logger.debug('The authenticator "' + authenticatorFactory + '" rejected to restore the session - invalidating…');
            if (err) {
              _ember['default'].Logger.debug(err);
            }
            return _this3._clearWithContent(restoredContent).then(reject, reject);
          });
        } else {
          delete (restoredContent || {}).authenticated;
          return _this3._clearWithContent(restoredContent).then(reject, reject);
        }
      }, function () {
        return _this3._clear().then(reject, reject);
      });
    },

    _callStoreAsync: function _callStoreAsync(method) {
      var _store;

      for (var _len2 = arguments.length, params = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        params[_key2 - 1] = arguments[_key2];
      }

      var result = (_store = this.store)[method].apply(_store, params);

      if (typeof result === 'undefined' || typeof result.then === 'undefined') {
        _ember['default'].deprecate('Ember Simple Auth: Synchronous stores have been deprecated. Make sure your custom store\'s ' + method + ' method returns a promise.', false, {
          id: 'ember-simple-auth.session-store.synchronous-' + method,
          until: '2.0.0'
        });
        return RSVP.Promise.resolve(result);
      } else {
        return result;
      }
    },

    _setup: function _setup(authenticator, authenticatedContent, trigger) {
      var _this4 = this;

      trigger = !!trigger && !this.get('isAuthenticated');
      this.beginPropertyChanges();
      this.setProperties({
        isAuthenticated: true,
        authenticator: authenticator
      });
      _ember['default'].set(this.content, 'authenticated', authenticatedContent);
      this._bindToAuthenticatorEvents();

      return this._updateStore().then(function () {
        _this4.endPropertyChanges();
        if (trigger) {
          _this4.trigger('authenticationSucceeded');
        }
      }, function () {
        _this4.setProperties({
          isAuthenticated: false,
          authenticator: null
        });
        _ember['default'].set(_this4.content, 'authenticated', {});
        _this4.endPropertyChanges();
      });
    },

    _clear: function _clear(trigger) {
      var _this5 = this;

      trigger = !!trigger && this.get('isAuthenticated');
      this.beginPropertyChanges();
      this.setProperties({
        isAuthenticated: false,
        authenticator: null
      });
      _ember['default'].set(this.content, 'authenticated', {});

      return this._updateStore().then(function () {
        _this5.endPropertyChanges();
        if (trigger) {
          _this5.trigger('invalidationSucceeded');
        }
      }, function () {
        return _this5.endPropertyChanges();
      });
    },

    _clearWithContent: function _clearWithContent(content, trigger) {
      this.set('content', content);
      return this._clear(trigger);
    },

    setUnknownProperty: function setUnknownProperty(key, value) {
      _ember['default'].assert('"authenticated" is a reserved key used by Ember Simple Auth!', key !== 'authenticated');
      var result = this._super(key, value);
      this._updateStore();
      return result;
    },

    _updateStore: function _updateStore() {
      var data = this.content;
      if (!_ember['default'].isEmpty(this.authenticator)) {
        _ember['default'].set(data, 'authenticated', _ember['default'].merge({ authenticator: this.authenticator }, data.authenticated || {}));
      }
      return this._callStoreAsync('persist', data);
    },

    _bindToAuthenticatorEvents: function _bindToAuthenticatorEvents() {
      var _this6 = this;

      var authenticator = this._lookupAuthenticator(this.authenticator);
      authenticator.off('sessionDataUpdated');
      authenticator.off('sessionDataInvalidated');
      authenticator.on('sessionDataUpdated', function (content) {
        _this6._setup(_this6.authenticator, content);
      });
      authenticator.on('sessionDataInvalidated', function () {
        _this6._clear(true);
      });
    },

    _bindToStoreEvents: on('init', function () {
      var _this7 = this;

      this.store.on('sessionDataUpdated', function (content) {
        var _ref2 = content.authenticated || {};

        var authenticatorFactory = _ref2.authenticator;

        if (!!authenticatorFactory) {
          delete content.authenticated.authenticator;
          var authenticator = _this7._lookupAuthenticator(authenticatorFactory);
          authenticator.restore(content.authenticated).then(function (authenticatedContent) {
            _this7.set('content', content);
            _this7._setup(authenticatorFactory, authenticatedContent, true);
          }, function (err) {
            _ember['default'].Logger.debug('The authenticator "' + authenticatorFactory + '" rejected to restore the session - invalidating…');
            if (err) {
              _ember['default'].Logger.debug(err);
            }
            _this7._clearWithContent(content, true);
          });
        } else {
          _this7._clearWithContent(content, true);
        }
      });
    }),

    _lookupAuthenticator: function _lookupAuthenticator(authenticator) {
      return (0, _emberGetownerPolyfill['default'])(this).lookup(authenticator);
    }
  });
});
define('ember-simple-auth/mixins/application-route-mixin', ['exports', 'ember', 'ember-simple-auth/configuration'], function (exports, _ember, _emberSimpleAuthConfiguration) {
  'use strict';

  var _slicedToArray = (function () {
    function sliceIterator(arr, i) {
      var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;_e = err;
      } finally {
        try {
          if (!_n && _i['return']) _i['return']();
        } finally {
          if (_d) throw _e;
        }
      }return _arr;
    }return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError('Invalid attempt to destructure non-iterable instance');
      }
    };
  })();

  var inject = _ember['default'].inject;
  var on = _ember['default'].on;

  /**
    The mixin for the application route; __defines methods that are called when
    the session was successfully authenticated (see
    {{#crossLink "SessionService/authenticationSucceeded:event"}}{{/crossLink}})
    or invalidated__ (see
    {{#crossLink "SessionService/invalidationSucceeded:event"}}{{/crossLink}}).
  
    __Using this mixin is optional.__ The session events can also be handled
    manually, e.g. in an instance initializer:
  
    ```js
    // app/instance-initializers/session-events.js
    export function initialize(instance) {
      const applicationRoute = instance.container.lookup('route:application');
      const session          = instance.container.lookup('service:session');
      session.on('authenticationSucceeded', function() {
        applicationRoute.transitionTo('index');
      });
      session.on('invalidationSucceeded', function() {
        window.location.reload();
      });
    };
  
    export default {
      initialize,
      name:  'session-events',
      after: 'ember-simple-auth'
    };
    ```
  
    __When using the `ApplicationRouteMixin` you need to specify
    `needs: ['service:session']` in the application route's unit test.__
  
    @class ApplicationRouteMixin
    @module ember-simple-auth/mixins/application-route-mixin
    @extends Ember.Mixin
    @public
  */
  exports['default'] = _ember['default'].Mixin.create({
    /**
      The session service.
       @property session
      @readOnly
      @type SessionService
      @public
    */
    session: inject.service('session'),

    _subscribeToSessionEvents: on('init', function () {
      var _this = this,
          _arguments = arguments;

      _ember['default'].A([['authenticationSucceeded', 'sessionAuthenticated'], ['invalidationSucceeded', 'sessionInvalidated']]).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var event = _ref2[0];
        var method = _ref2[1];

        _this.get('session').on(event, _ember['default'].run.bind(_this, function () {
          _this[method].apply(_this, _arguments);
        }));
      });
    }),

    /**
      This method handles the session's
      {{#crossLink "SessionService/authenticationSucceeded:event"}}{{/crossLink}}
      event. If there is a transition that was previously intercepted by
      {{#crossLink "AuthenticatedRouteMixin/beforeModel:method"}}the
      AuthenticatedRouteMixin's `beforeModel` method{{/crossLink}} it will retry
      it. If there is no such transition, this action transitions to the
      {{#crossLink "Configuration/routeAfterAuthentication:property"}}{{/crossLink}}.
       @method sessionAuthenticated
      @public
    */
    sessionAuthenticated: function sessionAuthenticated() {
      var attemptedTransition = this.get('session.attemptedTransition');

      if (attemptedTransition) {
        attemptedTransition.retry();
        this.set('session.attemptedTransition', null);
      } else {
        this.transitionTo(_emberSimpleAuthConfiguration['default'].routeAfterAuthentication);
      }
    },

    /**
      This method handles the session's
      {{#crossLink "SessionService/invalidationSucceeded:event"}}{{/crossLink}}
      event. __It reloads the Ember.js application__ by redirecting the browser
      to the application's root URL so that all in-memory data (such as Ember
      Data stores etc.) gets cleared.
       If the Ember.js application will be used in an environment where the users
      don't have direct access to any data stored on the client (e.g.
      [cordova](http://cordova.apache.org)) this action can be overridden to e.g.
      simply transition to the index route.
       @method sessionInvalidated
      @public
    */
    sessionInvalidated: function sessionInvalidated() {
      if (!_ember['default'].testing) {
        window.location.replace(_emberSimpleAuthConfiguration['default'].baseURL);
      }
    }
  });
});
define('ember-simple-auth/mixins/authenticated-route-mixin', ['exports', 'ember', 'ember-simple-auth/configuration'], function (exports, _ember, _emberSimpleAuthConfiguration) {
  'use strict';

  var service = _ember['default'].inject.service;

  /**
    __This mixin is used to make routes accessible only if the session is
    authenticated.__ It defines a `beforeModel` method that aborts the current
    transition and instead transitions to the
    {{#crossLink "Configuration/authenticationRoute:property"}}{{/crossLink}} if
    the session is not authenticated.
  
    ```js
    // app/routes/protected.js
    import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
  
    export default Ember.Route.extend(AuthenticatedRouteMixin);
    ```
  
    @class AuthenticatedRouteMixin
    @module ember-simple-auth/mixins/authenticated-route-mixin
    @extends Ember.Mixin
    @public
  */
  exports['default'] = _ember['default'].Mixin.create({
    /**
      The session service.
       @property session
      @readOnly
      @type SessionService
      @public
    */
    session: service('session'),

    /**
      Checks whether the session is authenticated and if it is not aborts the
      current transition and instead transitions to the
      {{#crossLink "Configuration/authenticationRoute:property"}}{{/crossLink}}.
      If the current transition is aborted, this method will save it in the
      session service's
      {{#crossLink "SessionService/attemptedTransition:property"}}{{/crossLink}}
      property so that  it can be retried after the session was authenticated
      (see
      {{#crossLink "ApplicationRouteMixin/sessionAuthenticated:method"}}{{/crossLink}}.
       __If `beforeModel` is overridden in a route that uses this mixin, the route's
     implementation must call `this._super(...arguments)`__ so that the mixin's
     `beforeModel` method is actually executed.
       @method beforeModel
      @param {Transition} transition The transition that lead to this route
      @public
    */
    beforeModel: function beforeModel(transition) {
      if (!this.get('session.isAuthenticated')) {
        _ember['default'].assert('The route configured as Configuration.authenticationRoute cannot implement the AuthenticatedRouteMixin mixin as that leads to an infinite transitioning loop!', this.get('routeName') !== _emberSimpleAuthConfiguration['default'].authenticationRoute);

        transition.abort();
        this.set('session.attemptedTransition', transition);
        this.transitionTo(_emberSimpleAuthConfiguration['default'].authenticationRoute);
      } else {
        return this._super.apply(this, arguments);
      }
    }
  });
});
define('ember-simple-auth/mixins/data-adapter-mixin', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  var service = _ember['default'].inject.service;

  /**
    __This mixin can be used to make Ember Data adapters authorize all outgoing
    API requests by injecting a header.__ It works with all authorizers that call
    the authorization callback (see
    {{#crossLink "BaseAuthorizer/authorize:method"}}{{/crossLink}}) with header
    name and header content arguments.
  
    __The `DataAdapterMixin` will also invalidate the session whenever it
    receives a 401 response for an API request.__
  
    ```js
    // app/adapters/application.js
    import DS from 'ember-data';
    import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
  
    export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
      authorizer: 'authorizer:application'
    });
    ```
  
    __The `DataAdapterMixin` requires Ember Data 1.13 or later.__
  
    @class DataAdapterMixin
    @module ember-simple-auth/mixins/data-adapter-mixin
    @extends Ember.Mixin
    @public
  */

  exports['default'] = _ember['default'].Mixin.create({
    /**
      The session service.
       @property session
      @readOnly
      @type SessionService
      @public
    */
    session: service('session'),

    /**
      The authorizer that is used to authorize API requests. The authorizer has
      to call the authorization callback (see
      {{#crossLink "BaseAuthorizer/authorize:method"}}{{/crossLink}}) with header
      name and header content arguments. __This property must be overridden in
      adapters using this mixin.__
       @property authorizer
      @type String
      @default null
      @public
    */
    authorizer: null,

    /**
      Defines a `beforeSend` hook (see http://api.jquery.com/jQuery.ajax/) that
      injects a request header containing the authorization data as constructed
      by the {{#crossLink "DataAdapterMixin/authorizer:property"}}{{/crossLink}}
      (see
      {{#crossLink "SessionService/authorize:method"}}{{/crossLink}}). The
      specific header name and contents depend on the actual auhorizer that is
      used.
       @method ajaxOptions
      @protected
    */
    ajaxOptions: function ajaxOptions() {
      var _this = this;

      var authorizer = this.get('authorizer');
      _ember['default'].assert("You're using the DataAdapterMixin without specifying an authorizer. Please add `authorizer: 'authorizer:application'` to your adapter.", _ember['default'].isPresent(authorizer));

      var hash = this._super.apply(this, arguments);
      var beforeSend = hash.beforeSend;

      hash.beforeSend = function (xhr) {
        _this.get('session').authorize(authorizer, function (headerName, headerValue) {
          xhr.setRequestHeader(headerName, headerValue);
        });
        if (beforeSend) {
          beforeSend(xhr);
        }
      };
      return hash;
    },

    /**
      This method is called for every response that the adapter receives from the
      API. If the response has a 401 status code it invalidates the session (see
      {{#crossLink "SessionService/invalidate:method"}}{{/crossLink}}).
       @method handleResponse
      @param {Number} status The response status as received from the API
      @protected
    */
    handleResponse: function handleResponse(status) {
      if (status === 401) {
        if (this.get('session.isAuthenticated')) {
          this.get('session').invalidate();
        }
        return true;
      } else {
        return this._super.apply(this, arguments);
      }
    }
  });
});
define('ember-simple-auth/mixins/unauthenticated-route-mixin', ['exports', 'ember', 'ember-simple-auth/configuration'], function (exports, _ember, _emberSimpleAuthConfiguration) {
  'use strict';

  var service = _ember['default'].inject.service;

  /**
    __This mixin is used to make routes accessible only if the session is
    not authenticated__ (e.g. login and registration routes). It defines a
    `beforeModel` method that aborts the current transition and instead
    transitions to the
    {{#crossLink "Configuration/routeIfAlreadyAuthenticated:property"}}{{/crossLink}}
    if the session is authenticated.
  
    ```js
    // app/routes/login.js
    import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
  
    export default Ember.Route.extend(UnauthenticatedRouteMixin);
    ```
  
    @class UnauthenticatedRouteMixin
    @module ember-simple-auth/mixins/unauthenticated-route-mixin
    @extends Ember.Mixin
    @public
  */
  exports['default'] = _ember['default'].Mixin.create({
    /**
      The session service.
       @property session
      @readOnly
      @type SessionService
      @public
    */
    session: service('session'),

    /**
      Checks whether the session is authenticated and if it is aborts the current
      transition and instead transitions to the
      {{#crossLink "Configuration/routeIfAlreadyAuthenticated:property"}}{{/crossLink}}.
       __If `beforeModel` is overridden in a route that uses this mixin, the route's
     implementation must call `this._super(...arguments)`__ so that the mixin's
     `beforeModel` method is actually executed.
       @method beforeModel
      @param {Transition} transition The transition that lead to this route
      @public
    */
    beforeModel: function beforeModel(transition) {
      if (this.get('session').get('isAuthenticated')) {
        transition.abort();
        _ember['default'].assert('The route configured as Configuration.routeIfAlreadyAuthenticated cannot implement the UnauthenticatedRouteMixin mixin as that leads to an infinite transitioning loop!', this.get('routeName') !== _emberSimpleAuthConfiguration['default'].routeIfAlreadyAuthenticated);
        this.transitionTo(_emberSimpleAuthConfiguration['default'].routeIfAlreadyAuthenticated);
      } else {
        return this._super.apply(this, arguments);
      }
    }
  });
});
define('ember-simple-auth/services/session', ['exports', 'ember', 'ember-getowner-polyfill'], function (exports, _ember, _emberGetownerPolyfill) {
  'use strict';

  var _slice = Array.prototype.slice;

  var SESSION_DATA_KEY_PREFIX = /^data\./;

  var computed = _ember['default'].computed;
  var on = _ember['default'].on;

  /**
    __The session service provides access to the current session as well as
    methods to authenticate and invalidate it__ etc. It is the main interface for
    the application to Ember Simple Auth's functionality. It can be injected via
  
    ```js
    // app/components/login-form.js
    import Ember from 'ember';
  
    export default Ember.Component.extend({
      session: Ember.inject.service('session')
    });
    ```
  
    @class SessionService
    @module ember-simple-auth/services/session
    @extends Ember.Service
    @uses Ember.Evented
    @public
  */
  exports['default'] = _ember['default'].Service.extend(_ember['default'].Evented, {
    /**
      Triggered whenever the session is successfully authenticated. This happens
      when the session gets authenticated via
      {{#crossLink "SessionService/authenticate:method"}}{{/crossLink}} but also
      when the session is authenticated in another tab or window of the same
      application and the session state gets synchronized across tabs or windows
      via the store (see
      {{#crossLink "BaseStore/sessionDataUpdated:event"}}{{/crossLink}}).
       When using the {{#crossLink "ApplicationRouteMixin"}}{{/crossLink}} this
      event will automatically get handled (see
      {{#crossLink "ApplicationRouteMixin/sessionAuthenticated:method"}}{{/crossLink}}).
       @event authenticationSucceeded
      @public
    */

    /**
      Triggered whenever the session is successfully invalidated. This happens
      when the session gets invalidated via
      {{#crossLink "SessionService/invalidate:method"}}{{/crossLink}} but also
      when the session is invalidated in another tab or window of the same
      application and the session state gets synchronized across tabs or windows
      via the store (see
      {{#crossLink "BaseStore/sessionDataUpdated:event"}}{{/crossLink}}).
       When using the {{#crossLink "ApplicationRouteMixin"}}{{/crossLink}} this
      event will automatically get handled (see
      {{#crossLink "ApplicationRouteMixin/sessionInvalidated:method"}}{{/crossLink}}).
       @event invalidationSucceeded
      @public
    */

    /**
      Returns whether the session is currently authenticated.
       @property isAuthenticated
      @type Boolean
      @readOnly
      @default false
      @public
    */
    isAuthenticated: computed.oneWay('session.isAuthenticated'),

    /**
      The current session data as a plain object. The
      `authenticated` key holds the session data that the authenticator resolved
      with when the session was authenticated (see
      {{#crossLink "BaseAuthenticator/authenticate:method"}}{{/crossLink}}) and
      that will be cleared when the session is invalidated. This data cannot be
      written. All other session data is writable and will not be cleared when
      the session is invalidated.
       @property data
      @type Object
      @readOnly
      @default { authenticated: {} }
      @public
    */
    data: computed.oneWay('session.content'),

    /**
      The session store.
       @property store
      @type BaseStore
      @readOnly
      @default null
      @public
    */
    store: computed.oneWay('session.store'),

    /**
      A previously attempted but intercepted transition (e.g. by the
      {{#crossLink "AuthenticatedRouteMixin"}}{{/crossLink}}). If an attempted
      transition is present, the
      {{#crossLink "ApplicationRouteMixin"}}{{/crossLink}} will retry it when the
      session becomes authenticated (see
      {{#crossLink "ApplicationRouteMixin/sessionAuthenticated:method"}}{{/crossLink}}).
       @property attemptedTransition
      @type Transition
      @default null
      @public
    */
    attemptedTransition: computed.alias('session.attemptedTransition'),

    set: function set(key, value) {
      var setsSessionData = SESSION_DATA_KEY_PREFIX.test(key);
      if (setsSessionData) {
        var sessionDataKey = 'session.' + key.replace(SESSION_DATA_KEY_PREFIX, '');
        return this._super(sessionDataKey, value);
      } else {
        return this._super.apply(this, arguments);
      }
    },

    _forwardSessionEvents: on('init', function () {
      var _this = this,
          _arguments = arguments;

      _ember['default'].A(['authenticationSucceeded', 'invalidationSucceeded']).forEach(function (event) {
        var session = _this.get('session');
        // the internal session won't be available in route unit tests
        if (session) {
          session.on(event, function () {
            _this.trigger.apply(_this, [event].concat(_slice.call(_arguments)));
          });
        }
      });
    }),

    /**
      __Authenticates the session with an `authenticator`__ and appropriate
      arguments. The authenticator implements the actual steps necessary to
      authenticate the session (see
      {{#crossLink "BaseAuthenticator/authenticate:method"}}{{/crossLink}}) and
      returns a promise after doing so. The session handles the returned promise
      and when it resolves becomes authenticated, otherwise remains
      unauthenticated. All data the authenticator resolves with will be
      accessible via the
      {{#crossLink "SessionService/data:property"}}session data's{{/crossLink}}
      `authenticated` property.
       __This method returns a promise. A resolving promise indicates that the
      session was successfully authenticated__ while a rejecting promise
      indicates that authentication failed and the session remains
      unauthenticated. The promise does not resolve with a value; instead, the
      data returned from the authenticator is available via the
      {{#crossLink "SessionService/data:property"}}{{/crossLink}} property.
       When authentication succeeds this will trigger the
      {{#crossLink "SessionService/authenticationSucceeded:event"}}{{/crossLink}}
      event.
       @method authenticate
      @param {String} authenticator The authenticator to use to authenticate the session
      @param {Any} [...args] The arguments to pass to the authenticator; depending on the type of authenticator these might be a set of credentials, a Facebook OAuth Token, etc.
      @return {Ember.RSVP.Promise} A promise that resolves when the session was authenticated successfully and rejects otherwise
      @public
    */
    authenticate: function authenticate() {
      var session = this.get('session');

      return session.authenticate.apply(session, arguments);
    },

    /**
      __Invalidates the session with the authenticator it is currently
      authenticated with__ (see
      {{#crossLink "SessionService/authenticate:method"}}{{/crossLink}}). This
      invokes the authenticator's
      {{#crossLink "BaseAuthenticator/invalidate:method"}}{{/crossLink}} method
      and handles the returned promise accordingly.
       This method returns a promise. A resolving promise indicates that the
      session was successfully invalidated while a rejecting promise indicates
      that invalidation failed and the session remains authenticated. Once the
      session is successfully invalidated it clears all of its authenticated data
      (see {{#crossLink "SessionService/data:property"}}{{/crossLink}}).
       When invalidation succeeds this will trigger the
      {{#crossLink "SessionService/invalidationSucceeded:event"}}{{/crossLink}}
      event.
       @method invalidate
      @return {Ember.RSVP.Promise} A promise that resolves when the session was invalidated successfully and rejects otherwise
      @public
    */
    invalidate: function invalidate() {
      var session = this.get('session');

      return session.invalidate.apply(session, arguments);
    },

    /**
      Authorizes a block of code with an authorizer (see
      {{#crossLink "BaseAuthorizer/authorize:method"}}{{/crossLink}}) if the
      session is authenticated. If the session is not currently authenticated
      this method does nothing.
       ```js
      this.get('session').authorize('authorizer:oauth2-bearer', (headerName, headerValue) => {
        xhr.setRequestHeader(headerName, headerValue);
      });
      ```
       @method authorize
      @param {String} authorizer The authorizer to authorize the block with
      @param {Function} block The block of code to call with the authorization data generated by the authorizer
      @public
    */
    authorize: function authorize(authorizerFactory, block) {
      if (this.get('isAuthenticated')) {
        var authorizer = (0, _emberGetownerPolyfill['default'])(this).lookup(authorizerFactory);
        var sessionData = this.get('data.authenticated');
        authorizer.authorize(sessionData, block);
      }
    }
  });
});
define('ember-simple-auth/session-stores/adaptive', ['exports', 'ember', 'ember-simple-auth/session-stores/base', 'ember-simple-auth/session-stores/local-storage', 'ember-simple-auth/session-stores/cookie'], function (exports, _ember, _emberSimpleAuthSessionStoresBase, _emberSimpleAuthSessionStoresLocalStorage, _emberSimpleAuthSessionStoresCookie) {
  /* global localStorage */
  'use strict';

  var computed = _ember['default'].computed;

  var LOCAL_STORAGE_TEST_KEY = '_ember_simple_auth_test_key';

  /**
    Session store that persists data in the browser's `localStorage` (see
    {{#crossLink "LocalStorageStore"}}{{/crossLink}}) if that is available or in
    a cookie (see {{#crossLink "CookieStore"}}{{/crossLink}}) if it is not.
  
    __This is the default store that Ember Simple Auth will use when the
    application doesn't define a custom store.__
  
    @class AdaptiveStore
    @module ember-simple-auth/session-stores/adaptive
    @extends BaseStore
    @public
  */
  exports['default'] = _emberSimpleAuthSessionStoresBase['default'].extend({
    /**
      The `localStorage` key the store persists data in if `localStorage` is
      available.
       @property localStorageKey
      @type String
      @default 'ember_simple_auth:session'
      @public
    */
    localStorageKey: 'ember_simple_auth:session',

    /**
      The domain to use for the cookie if `localStorage` is not available, e.g.,
      "example.com", ".example.com" (which includes all subdomains) or
      "subdomain.example.com". If not explicitly set, the cookie domain defaults
      to the domain the session was authneticated on.
       @property cookieDomain
      @type String
      @default null
      @public
    */
    cookieDomain: null,

    /**
      The name of the cookie to use if `localStorage` is not available.
       @property cookieName
      @type String
      @default ember_simple_auth:session
      @public
    */
    cookieName: 'ember_simple_auth:session',

    /**
      The expiration time for the cookie in seconds if `localStorage` is not
      available. A value of `null` will make the cookie a session cookie that
      expires and gets deleted when the browser is closed.
       @property cookieExpirationTime
      @default null
      @type Integer
      @public
    */
    cookieExpirationTime: null,

    _isLocalStorageAvailable: computed(function () {
      try {
        localStorage.setItem(LOCAL_STORAGE_TEST_KEY, true);
        localStorage.removeItem(LOCAL_STORAGE_TEST_KEY);
        return true;
      } catch (e) {
        return false;
      }
    }),

    init: function init() {
      this._super.apply(this, arguments);

      var store = undefined;
      if (this.get('_isLocalStorageAvailable')) {
        var options = { key: this.get('localStorageKey') };
        store = this._createStore(_emberSimpleAuthSessionStoresLocalStorage['default'], options);
      } else {
        var options = this.getProperties('cookieDomain', 'cookieName', 'cookieExpirationTime');
        store = this._createStore(_emberSimpleAuthSessionStoresCookie['default'], options);
      }
      this.set('_store', store);
    },

    _createStore: function _createStore(storeType, options) {
      var _this = this;

      var store = storeType.create(options);

      store.on('sessionDataUpdated', function (data) {
        _this.trigger('sessionDataUpdated', data);
      });
      return store;
    },

    /**
      Persists the `data` in the `localStorage` if it is available or in a cookie
      if it is not.
       @method persist
      @param {Object} data The data to persist
      @return {Ember.RSVP.Promise} A promise that resolves when the data has successfully been persisted and rejects otherwise.
      @public
    */
    persist: function persist() {
      var _get;

      return (_get = this.get('_store')).persist.apply(_get, arguments);
    },

    /**
      Returns all data currently stored in the `localStorage` if that is
      available - or if it is not, in the cookie - as a plain object.
       @method restore
      @return {Ember.RSVP.Promise} A promise that resolves with the data currently persisted in the store when the data has been restored successfully and rejects otherwise.
      @public
    */
    restore: function restore() {
      return this.get('_store').restore();
    },

    /**
      Clears the store by deleting the
      {{#crossLink "LocalStorageStore/key:property"}}{{/crossLink}} from
      `localStorage` if that is available or by deleting the cookie if it is not.
       @method clear
      @return {Ember.RSVP.Promise} A promise that resolves when the store has been cleared successfully and rejects otherwise.
      @public
    */
    clear: function clear() {
      return this.get('_store').clear();
    }
  });
});
define('ember-simple-auth/session-stores/base', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  var RSVP = _ember['default'].RSVP;

  /**
    The base class for all session stores. __This serves as a starting point for
    implementing custom session stores and must not be used directly.__
  
    Session Stores persist the session's state so that it survives a page reload
    and is synchronized across multiple tabs or windows of the same application.
  
    @class BaseStore
    @module ember-simple-auth/session-stores/base
    @extends Ember.Object
    @uses Ember.Evented
    @public
  */
  exports['default'] = _ember['default'].Object.extend(_ember['default'].Evented, {
    /**
      Triggered when the session store's data changes due to an external event,
      e.g. from another tab or window of the same application. The session
      handles that event, passes the updated data to its authenticator's
      {{#crossLink "BaseAuthenticator/restore:method"}}{{/crossLink}} method and
      handles the result of that invocation accordingly.
       @event sessionDataUpdated
      @param {Object} data The updated session data
      @public
    */

    /**
      Persists the `data`. This replaces all currently stored data.
       `BaseStores`'s implementation always returns a rejecting promise. __This
      method must be overridden in subclasses__.
       @method persist
      @param {Object} data The data to persist
      @return {Ember.RSVP.Promise} A promise that resolves when the data has successfully been persisted and rejects otherwise.
      @public
    */
    persist: function persist() {
      return RSVP.reject();
    },

    /**
      Returns all data currently stored as a plain object.
       `BaseStores`'s implementation always returns a rejecting promise. __This
      method must be overridden in subclasses__.
       @method restore
      @return {Ember.RSVP.Promise} A promise that resolves with the data currently persisted in the store when the data has been restored successfully and rejects otherwise.
      @public
    */
    restore: function restore() {
      return RSVP.reject();
    },

    /**
      Clears the store.
       `BaseStores`'s implementation always returns a rejecting promise. __This
      method must be overridden in subclasses__.
       @method clear
      @return {Ember.RSVP.Promise} A promise that resolves when the store has been cleared successfully and rejects otherwise.
      @public
    */
    clear: function clear() {
      return RSVP.reject();
    }
  });
});
define('ember-simple-auth/session-stores/cookie', ['exports', 'ember', 'ember-simple-auth/session-stores/base', 'ember-simple-auth/utils/objects-are-equal'], function (exports, _ember, _emberSimpleAuthSessionStoresBase, _emberSimpleAuthUtilsObjectsAreEqual) {
  'use strict';

  var RSVP = _ember['default'].RSVP;
  var computed = _ember['default'].computed;
  var on = _ember['default'].on;

  /**
    Session store that persists data in a cookie.
  
    By default the cookie session store uses a session cookie that expires and is
    deleted when the browser is closed. The cookie expiration period can be
    configured by setting the
    {{#crossLink "CookieStore/cookieExpirationTime:property"}}{{/crossLink}}
    property. This can be used to implement "remember me" functionality that will
    either store the session persistently or in a session cookie depending on
    whether the user opted in or not:
  
    ```js
    // app/controllers/login.js
    export default Ember.Controller.extend({
      rememberMe: false,
  
      _rememberMeChanged: Ember.observer('rememberMe', function() {
        const expirationTime = this.get('rememberMe') ? (14 * 24 * 60 * 60) : null;
        this.set('session.store.cookieExpirationTime', expirationTime);
      }
    });
    ```
  
    __In order to keep multiple tabs/windows of an application in sync, this
    store has to periodically (every 500ms) check the cookie for changes__ as
    there are no events for cookie changes that the store could subscribe to. If
    the application does not need to make sure all session data is deleted when
    the browser is closed, the
    {{#crossLink "LocalStorageStore"}}`localStorage` session store{{/crossLink}}
    should be used.
  
    @class CookieStore
    @module ember-simple-auth/session-stores/cookie
    @extends BaseStore
    @public
  */
  exports['default'] = _emberSimpleAuthSessionStoresBase['default'].extend({
    /**
      The domain to use for the cookie, e.g., "example.com", ".example.com"
      (which includes all subdomains) or "subdomain.example.com". If not
      explicitly set, the cookie domain defaults to the domain the session was
      authneticated on.
       @property cookieDomain
      @type String
      @default null
      @public
    */
    cookieDomain: null,

    /**
      The name of the cookie.
       @property cookieName
      @type String
      @default ember_simple_auth:session
      @public
    */
    cookieName: 'ember_simple_auth:session',

    /**
      The expiration time for the cookie in seconds. A value of `null` will make
      the cookie a session cookie that expires and gets deleted when the browser
      is closed.
       @property cookieExpirationTime
      @default null
      @type Integer
      @public
    */
    cookieExpirationTime: null,

    _secureCookies: window.location.protocol === 'https:',

    _syncDataTimeout: null,

    _renewExpirationTimeout: null,

    _isPageVisible: computed(function () {
      var visibilityState = document.visibilityState || 'visible';
      return visibilityState === 'visible';
    }).volatile(),

    _setup: on('init', function () {
      var _this = this;

      this._syncData().then(function () {
        _this._renewExpiration();
      });
    }),

    /**
      Persists the `data` in the cookie.
       @method persist
      @param {Object} data The data to persist
      @return {Ember.RSVP.Promise} A promise that resolves when the data has successfully been persisted and rejects otherwise.
      @public
    */
    persist: function persist(data) {
      this._lastData = data;
      data = JSON.stringify(data || {});
      var expiration = this._calculateExpirationTime();
      this._write(data, expiration);
      return RSVP.resolve();
    },

    /**
      Returns all data currently stored in the cookie as a plain object.
       @method restore
      @return {Ember.RSVP.Promise} A promise that resolves with the data currently persisted in the store when the data has been restored successfully and rejects otherwise.
      @public
    */
    restore: function restore() {
      var data = this._read(this.cookieName);
      if (_ember['default'].isEmpty(data)) {
        return RSVP.resolve({});
      } else {
        return RSVP.resolve(JSON.parse(data));
      }
    },

    /**
      Clears the store by deleting the cookie.
       @method clear
      @return {Ember.RSVP.Promise} A promise that resolves when the store has been cleared successfully and rejects otherwise.
      @public
    */
    clear: function clear() {
      this._write(null, 0);
      this._lastData = {};
      return RSVP.resolve();
    },

    _read: function _read(name) {
      var value = document.cookie.match(new RegExp(name + '=([^;]+)')) || [];
      return decodeURIComponent(value[1] || '');
    },

    _calculateExpirationTime: function _calculateExpirationTime() {
      var cachedExpirationTime = this._read(this.cookieName + ':expiration_time');
      cachedExpirationTime = !!cachedExpirationTime ? new Date().getTime() + cachedExpirationTime * 1000 : null;
      return !!this.cookieExpirationTime ? new Date().getTime() + this.cookieExpirationTime * 1000 : cachedExpirationTime;
    },

    _write: function _write(value, expiration) {
      var path = '; path=/';
      var domain = _ember['default'].isEmpty(this.cookieDomain) ? '' : '; domain=' + this.cookieDomain;
      var expires = _ember['default'].isEmpty(expiration) ? '' : '; expires=' + new Date(expiration).toUTCString();
      var secure = !!this._secureCookies ? ';secure' : '';
      document.cookie = this.cookieName + '=' + encodeURIComponent(value) + domain + path + expires + secure;
      if (expiration !== null) {
        var cachedExpirationTime = this._read(this.cookieName + ':expiration_time');
        document.cookie = this.cookieName + ':expiration_time=' + encodeURIComponent(this.cookieExpirationTime || cachedExpirationTime) + domain + path + expires + secure;
      }
    },

    _syncData: function _syncData() {
      var _this2 = this;

      return this.restore().then(function (data) {
        if (!(0, _emberSimpleAuthUtilsObjectsAreEqual['default'])(data, _this2._lastData)) {
          _this2._lastData = data;
          _this2.trigger('sessionDataUpdated', data);
        }
        if (!_ember['default'].testing) {
          _ember['default'].run.cancel(_this2._syncDataTimeout);
          _this2._syncDataTimeout = _ember['default'].run.later(_this2, _this2._syncData, 500);
        }
      });
    },

    _renew: function _renew() {
      var _this3 = this;

      return this.restore().then(function (data) {
        if (!_ember['default'].isEmpty(data) && data !== {}) {
          data = _ember['default'].typeOf(data) === 'string' ? data : JSON.stringify(data || {});
          var expiration = _this3._calculateExpirationTime();
          _this3._write(data, expiration);
        }
      });
    },

    _renewExpiration: function _renewExpiration() {
      if (!_ember['default'].testing) {
        _ember['default'].run.cancel(this._renewExpirationTimeout);
        this._renewExpirationTimeout = _ember['default'].run.later(this, this._renewExpiration, 60000);
      }
      if (this.get('_isPageVisible')) {
        return this._renew();
      } else {
        return RSVP.resolve();
      }
    }
  });
});
define('ember-simple-auth/session-stores/ephemeral', ['exports', 'ember', 'ember-simple-auth/session-stores/base'], function (exports, _ember, _emberSimpleAuthSessionStoresBase) {
  'use strict';

  var RSVP = _ember['default'].RSVP;
  var on = _ember['default'].on;

  /**
    Session store that __persists data in memory and thus is not actually
    persistent__. It does also not synchronize the session's state across
    multiple tabs or windows as those cannot share memory. __This store is mainly
    useful for testing and will automatically be used when running tests.__
  
    @class EphemeralStore
    @module ember-simple-auth/session-stores/ephemeral
    @extends BaseStore
    @public
  */
  exports['default'] = _emberSimpleAuthSessionStoresBase['default'].extend({
    _setup: on('init', function () {
      this.clear();
    }),

    /**
      Persists the `data`. This replaces all currently stored data.
       @method persist
      @param {Object} data The data to persist
      @return {Ember.RSVP.Promise} A promise that resolves when the data has successfully been persisted and rejects otherwise.
      @public
    */
    persist: function persist(data) {
      this._data = JSON.stringify(data || {});

      return RSVP.resolve();
    },

    /**
      Returns all data currently stored as a plain object.
       @method restore
      @return {Ember.RSVP.Promise} A promise that resolves with the data currently persisted in the store when the data has been restored successfully and rejects otherwise.
      @public
    */
    restore: function restore() {
      var data = JSON.parse(this._data) || {};

      return RSVP.resolve(data);
    },

    /**
      Clears the store.
       @method clear
      @return {Ember.RSVP.Promise} A promise that resolves when the store has been cleared successfully and rejects otherwise.
      @public
    */
    clear: function clear() {
      delete this._data;
      this._data = '{}';

      return RSVP.resolve();
    }
  });
});
define('ember-simple-auth/session-stores/local-storage', ['exports', 'ember', 'ember-simple-auth/session-stores/base', 'ember-simple-auth/utils/objects-are-equal'], function (exports, _ember, _emberSimpleAuthSessionStoresBase, _emberSimpleAuthUtilsObjectsAreEqual) {
  /* global localStorage */
  'use strict';

  var RSVP = _ember['default'].RSVP;

  /**
    Session store that persists data in the browser's `localStorage`.
  
    __`localStorage` is not available in Safari when running in private mode. In
    general it is better to use the
    {{#crossLink "AdaptiveStore"}}{{/crossLink}} that automatically falls back to
    the {{#crossLink "CookieStore"}}{{/crossLink}} when `localStorage` is not
    available.__
  
    @class LocalStorageStore
    @module ember-simple-auth/session-stores/local-storage
    @extends BaseStore
    @public
  */
  exports['default'] = _emberSimpleAuthSessionStoresBase['default'].extend({
    /**
      The `localStorage` key the store persists data in.
       @property key
      @type String
      @default 'ember_simple_auth:session'
      @public
    */
    key: 'ember_simple_auth:session',

    init: function init() {
      this._super.apply(this, arguments);

      this._bindToStorageEvents();
    },

    /**
      Persists the `data` in the `localStorage`.
       @method persist
      @param {Object} data The data to persist
      @return {Ember.RSVP.Promise} A promise that resolves when the data has successfully been persisted and rejects otherwise.
      @public
    */
    persist: function persist(data) {
      this._lastData = data;
      data = JSON.stringify(data || {});
      localStorage.setItem(this.key, data);

      return RSVP.resolve();
    },

    /**
      Returns all data currently stored in the `localStorage` as a plain object.
       @method restore
      @return {Ember.RSVP.Promise} A promise that resolves with the data currently persisted in the store when the data has been restored successfully and rejects otherwise.
      @public
    */
    restore: function restore() {
      var data = localStorage.getItem(this.key);

      return RSVP.resolve(JSON.parse(data) || {});
    },

    /**
      Clears the store by deleting the
      {{#crossLink "LocalStorageStore/key:property"}}{{/crossLink}} from
      `localStorage`.
       @method clear
      @return {Ember.RSVP.Promise} A promise that resolves when the store has been cleared successfully and rejects otherwise.
      @public
    */
    clear: function clear() {
      localStorage.removeItem(this.key);
      this._lastData = {};

      return RSVP.resolve();
    },

    _bindToStorageEvents: function _bindToStorageEvents() {
      var _this = this;

      _ember['default'].$(window).bind('storage', function () {
        _this.restore().then(function (data) {
          if (!(0, _emberSimpleAuthUtilsObjectsAreEqual['default'])(data, _this._lastData)) {
            _this._lastData = data;
            _this.trigger('sessionDataUpdated', data);
          }
        });
      });
    }
  });
});
define("ember-simple-auth/utils/inject", ["exports"], function (exports) {
  "use strict";

  exports["default"] = function (registry, factoryNameOrType, property, injectionName) {
    var inject = registry.inject || registry.injection;
    inject.call(registry, factoryNameOrType, property, injectionName);
  };
});
define("ember-simple-auth/utils/lookup", ["exports"], function (exports) {
  "use strict";

  exports["default"] = function (instance, factoryName) {
    if (instance.lookup) {
      return instance.lookup(factoryName);
    } else {
      return instance.container.lookup(factoryName);
    }
  };
});
define('ember-simple-auth/utils/objects-are-equal', ['exports'], function (exports) {
  'use strict';

  exports['default'] = objectsAreEqual;

  function objectsAreEqual(a, b) {
    function compare(x, y) {
      var property = undefined;
      if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
        return true;
      }

      if (x === y) {
        return true;
      }

      if (!(x instanceof Object && y instanceof Object)) {
        return false;
      }

      for (property in y) {
        if (y.hasOwnProperty(property) !== x.hasOwnProperty(property)) {
          return false;
        } else if (typeof y[property] !== typeof x[property]) {
          return false;
        }
      }

      for (property in x) {
        if (y.hasOwnProperty(property) !== x.hasOwnProperty(property)) {
          return false;
        } else if (typeof y[property] !== typeof x[property]) {
          return false;
        }

        switch (typeof x[property]) {
          case 'object':
            if (!compare(x[property], y[property])) {
              return false;
            }
            break;
          default:
            if (x[property] !== y[property]) {
              return false;
            }
            break;
        }
      }

      return true;
    }

    return compare(a, b);
  }
});
define('ember-validations/errors', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  var get = _ember['default'].get;
  var set = _ember['default'].set;

  exports['default'] = _ember['default'].Object.extend({
    unknownProperty: function unknownProperty(property) {
      set(this, property, _ember['default'].A());
      return get(this, property);
    }
  });
});
define('ember-validations/index', ['exports', 'ember-validations/mixin'], function (exports, _emberValidationsMixin) {
  'use strict';

  exports.validator = validator;
  exports['default'] = _emberValidationsMixin['default'];

  function validator(callback) {
    return { callback: callback };
  }
});
define('ember-validations/messages', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports['default'] = {
    render: function render(attribute, context) {
      if (_ember['default'].I18n) {
        return _ember['default'].I18n.t('errors.' + attribute, context);
      } else {
        var regex = new RegExp("{{(.*?)}}"),
            attributeName = "";
        if (regex.test(this.defaults[attribute])) {
          attributeName = regex.exec(this.defaults[attribute])[1];
        }
        return this.defaults[attribute].replace(regex, context[attributeName]);
      }
    },
    defaults: {
      inclusion: "is not included in the list",
      exclusion: "is reserved",
      invalid: "is invalid",
      confirmation: "doesn't match {{attribute}}",
      accepted: "must be accepted",
      empty: "can't be empty",
      blank: "can't be blank",
      present: "must be blank",
      tooLong: "is too long (maximum is {{count}} characters)",
      tooShort: "is too short (minimum is {{count}} characters)",
      wrongLength: "is the wrong length (should be {{count}} characters)",
      notANumber: "is not a number",
      notAnInteger: "must be an integer",
      greaterThan: "must be greater than {{count}}",
      greaterThanOrEqualTo: "must be greater than or equal to {{count}}",
      equalTo: "must be equal to {{count}}",
      lessThan: "must be less than {{count}}",
      lessThanOrEqualTo: "must be less than or equal to {{count}}",
      otherThan: "must be other than {{count}}",
      odd: "must be odd",
      even: "must be even",
      url: "is not a valid URL"
    }
  };
});
define('ember-validations/mixin', ['exports', 'ember', 'ember-validations/errors', 'ember-validations/validators/base'], function (exports, _ember, _emberValidationsErrors, _emberValidationsValidatorsBase) {
  'use strict';

  var get = _ember['default'].get;
  var set = _ember['default'].set;

  var setValidityMixin = _ember['default'].Mixin.create({
    isValid: _ember['default'].computed('validators.@each.isValid', function () {
      var compactValidators = get(this, 'validators').compact();
      var filteredValidators = compactValidators.filter(function (validator) {
        return !get(validator, 'isValid');
      });

      return get(filteredValidators, 'length') === 0;
    }),
    isInvalid: _ember['default'].computed.not('isValid')
  });

  var pushValidatableObject = function pushValidatableObject(model, property) {
    var content = get(model, property);

    model.removeObserver(property, pushValidatableObject);
    if (_ember['default'].isArray(content)) {
      model.validators.pushObject(ArrayValidatorProxy.create({ model: model, property: property, contentBinding: 'model.' + property }));
    } else {
      model.validators.pushObject(content);
    }
  };

  var lookupValidator = function lookupValidator(validatorName) {
    var container = get(this, 'container');
    var service = container.lookup('service:validations');
    var validators = [];
    var cache;

    if (service) {
      cache = get(service, 'cache');
    } else {
      cache = {};
    }

    if (cache[validatorName]) {
      validators = validators.concat(cache[validatorName]);
    } else {
      var local = container.lookupFactory('validator:local/' + validatorName);
      var remote = container.lookupFactory('validator:remote/' + validatorName);

      if (local || remote) {
        validators = validators.concat([local, remote]);
      } else {
        var base = container.lookupFactory('validator:' + validatorName);

        if (base) {
          validators = validators.concat([base]);
        } else {
          local = container.lookupFactory('ember-validations@validator:local/' + validatorName);
          remote = container.lookupFactory('ember-validations@validator:remote/' + validatorName);

          if (local || remote) {
            validators = validators.concat([local, remote]);
          }
        }
      }

      cache[validatorName] = validators;
    }

    if (_ember['default'].isEmpty(validators)) {
      _ember['default'].warn('Could not find the "' + validatorName + '" validator.');
    }

    return validators;
  };

  var ArrayValidatorProxy = _ember['default'].ArrayProxy.extend(setValidityMixin, {
    validate: function validate() {
      return this._validate();
    },
    _validate: _ember['default'].on('init', function () {
      var promises = get(this, 'content').invoke('_validate').without(undefined);
      return _ember['default'].RSVP.all(promises);
    }),
    validators: _ember['default'].computed.alias('content')
  });

  exports['default'] = _ember['default'].Mixin.create(setValidityMixin, {
    init: function init() {
      this._super();
      this.errors = _emberValidationsErrors['default'].create();
      this.dependentValidationKeys = {};
      this.validators = _ember['default'].A();
      if (get(this, 'validations') === undefined) {
        this.validations = {};
      }
      this.buildValidators();
      this.validators.forEach(function (validator) {
        validator.addObserver('errors.[]', this, function (sender) {
          var errors = _ember['default'].A();
          this.validators.forEach(function (validator) {
            if (validator.property === sender.property) {
              errors.addObjects(validator.errors);
            }
          }, this);
          set(this, 'errors.' + sender.property, errors);
        });
      }, this);
    },
    buildValidators: function buildValidators() {
      var property;

      for (property in this.validations) {
        if (this.validations[property].constructor === Object) {
          this.buildRuleValidator(property);
        } else {
          this.buildObjectValidator(property);
        }
      }
    },
    buildRuleValidator: function buildRuleValidator(property) {
      var pushValidator = function pushValidator(validator) {
        if (validator) {
          this.validators.pushObject(validator.create({ model: this, property: property, options: this.validations[property][validatorName] }));
        }
      };

      if (this.validations[property].callback) {
        this.validations[property] = { inline: this.validations[property] };
      }

      var createInlineClass = function createInlineClass(callback) {
        return _emberValidationsValidatorsBase['default'].extend({
          call: function call() {
            var errorMessage = this.callback.call(this);

            if (errorMessage) {
              this.errors.pushObject(errorMessage);
            }
          },
          callback: callback
        });
      };

      for (var validatorName in this.validations[property]) {
        if (validatorName === 'inline') {
          pushValidator.call(this, createInlineClass(this.validations[property][validatorName].callback));
        } else if (this.validations[property].hasOwnProperty(validatorName)) {
          lookupValidator.call(this, validatorName).forEach(pushValidator, this);
        }
      }
    },
    buildObjectValidator: function buildObjectValidator(property) {
      if (_ember['default'].isNone(get(this, property))) {
        this.addObserver(property, this, pushValidatableObject);
      } else {
        pushValidatableObject(this, property);
      }
    },
    validate: function validate() {
      var self = this;
      return this._validate().then(function (vals) {
        var errors = get(self, 'errors');
        if (vals.indexOf(false) > -1) {
          return _ember['default'].RSVP.reject(errors);
        }
        return errors;
      });
    },
    _validate: _ember['default'].on('init', function () {
      var promises = this.validators.invoke('_validate').without(undefined);
      return _ember['default'].RSVP.all(promises);
    })
  });
});
define('ember-validations/patterns', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports['default'] = _ember['default'].Namespace.create({
    numericality: /^(-|\+)?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d*)?$/,
    blank: /^\s*$/
  });
});
define('ember-validations/validators/base', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  var get = _ember['default'].get;
  var set = _ember['default'].set;

  exports['default'] = _ember['default'].Object.extend({
    init: function init() {
      set(this, 'errors', _ember['default'].A());
      this.dependentValidationKeys = _ember['default'].A();
      this.conditionals = {
        'if': get(this, 'options.if'),
        unless: get(this, 'options.unless')
      };
      this.model.addObserver(this.property, this, this._validate);
    },
    addObserversForDependentValidationKeys: _ember['default'].on('init', function () {
      this.dependentValidationKeys.forEach(function (key) {
        this.model.addObserver(key, this, this._validate);
      }, this);
    }),
    pushDependentValidationKeyToModel: _ember['default'].on('init', function () {
      var model = get(this, 'model');
      if (model.dependentValidationKeys[this.property] === undefined) {
        model.dependentValidationKeys[this.property] = _ember['default'].A();
      }
      model.dependentValidationKeys[this.property].addObjects(this.dependentValidationKeys);
    }),
    call: function call() {
      throw 'Not implemented!';
    },
    unknownProperty: function unknownProperty(key) {
      var model = get(this, 'model');
      if (model) {
        return get(model, key);
      }
    },
    isValid: _ember['default'].computed.empty('errors.[]'),
    isInvalid: _ember['default'].computed.not('isValid'),
    validate: function validate() {
      var self = this;
      return this._validate().then(function (success) {
        // Convert validation failures to rejects.
        var errors = get(self, 'model.errors');
        if (success) {
          return errors;
        } else {
          return _ember['default'].RSVP.reject(errors);
        }
      });
    },
    _validate: _ember['default'].on('init', function () {
      this.errors.clear();
      if (this.canValidate()) {
        this.call();
      }
      if (get(this, 'isValid')) {
        return _ember['default'].RSVP.resolve(true);
      } else {
        return _ember['default'].RSVP.resolve(false);
      }
    }),
    canValidate: function canValidate() {
      if (typeof this.conditionals === 'object') {
        if (this.conditionals['if']) {
          if (typeof this.conditionals['if'] === 'function') {
            return this.conditionals['if'](this.model, this.property);
          } else if (typeof this.conditionals['if'] === 'string') {
            if (typeof this.model[this.conditionals['if']] === 'function') {
              return this.model[this.conditionals['if']]();
            } else {
              return get(this.model, this.conditionals['if']);
            }
          }
        } else if (this.conditionals.unless) {
          if (typeof this.conditionals.unless === 'function') {
            return !this.conditionals.unless(this.model, this.property);
          } else if (typeof this.conditionals.unless === 'string') {
            if (typeof this.model[this.conditionals.unless] === 'function') {
              return !this.model[this.conditionals.unless]();
            } else {
              return !get(this.model, this.conditionals.unless);
            }
          }
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    compare: function compare(a, b, operator) {
      switch (operator) {
        case '==':
          return a == b; // jshint ignore:line
        case '===':
          return a === b;
        case '>=':
          return a >= b;
        case '<=':
          return a <= b;
        case '>':
          return a > b;
        case '<':
          return a < b;
        default:
          return false;
      }
    }
  });
});
define('ember-validations/validators/local/absence', ['exports', 'ember', 'ember-validations/validators/base', 'ember-validations/messages'], function (exports, _ember, _emberValidationsValidatorsBase, _emberValidationsMessages) {
  'use strict';

  var get = _ember['default'].get;
  var set = _ember['default'].set;

  exports['default'] = _emberValidationsValidatorsBase['default'].extend({
    init: function init() {
      this._super();
      /*jshint expr:true*/
      if (this.options === true) {
        set(this, 'options', {});
      }

      if (this.options.message === undefined) {
        set(this, 'options.message', _emberValidationsMessages['default'].render('present', this.options));
      }
    },
    call: function call() {
      if (!_ember['default'].isEmpty(get(this.model, this.property))) {
        this.errors.pushObject(this.options.message);
      }
    }
  });
});
define('ember-validations/validators/local/acceptance', ['exports', 'ember', 'ember-validations/validators/base', 'ember-validations/messages'], function (exports, _ember, _emberValidationsValidatorsBase, _emberValidationsMessages) {
  'use strict';

  var get = _ember['default'].get;
  var set = _ember['default'].set;

  exports['default'] = _emberValidationsValidatorsBase['default'].extend({
    init: function init() {
      this._super();
      /*jshint expr:true*/
      if (this.options === true) {
        set(this, 'options', {});
      }

      if (this.options.message === undefined) {
        set(this, 'options.message', _emberValidationsMessages['default'].render('accepted', this.options));
      }
    },
    call: function call() {
      if (this.options.accept) {
        if (get(this.model, this.property) !== this.options.accept) {
          this.errors.pushObject(this.options.message);
        }
      } else if (get(this.model, this.property) !== '1' && get(this.model, this.property) !== 1 && get(this.model, this.property) !== true) {
        this.errors.pushObject(this.options.message);
      }
    }
  });
});
define('ember-validations/validators/local/confirmation', ['exports', 'ember', 'ember-validations/validators/base', 'ember-validations/messages'], function (exports, _ember, _emberValidationsValidatorsBase, _emberValidationsMessages) {
  'use strict';

  var get = _ember['default'].get;
  var set = _ember['default'].set;

  exports['default'] = _emberValidationsValidatorsBase['default'].extend({
    init: function init() {
      this.originalProperty = this.property;
      this.property = this.property + 'Confirmation';
      this._super();
      this.dependentValidationKeys.pushObject(this.originalProperty);
      /*jshint expr:true*/
      if (this.options === true) {
        set(this, 'options', { attribute: this.originalProperty });
        set(this, 'options', { message: _emberValidationsMessages['default'].render('confirmation', this.options) });
      }
    },
    call: function call() {
      var original = get(this.model, this.originalProperty);
      var confirmation = get(this.model, this.property);

      if (!_ember['default'].isEmpty(original) || !_ember['default'].isEmpty(confirmation)) {
        if (original !== confirmation) {
          this.errors.pushObject(this.options.message);
        }
      }
    }
  });
});
define('ember-validations/validators/local/exclusion', ['exports', 'ember', 'ember-validations/validators/base', 'ember-validations/messages'], function (exports, _ember, _emberValidationsValidatorsBase, _emberValidationsMessages) {
  'use strict';

  var get = _ember['default'].get;
  var set = _ember['default'].set;

  exports['default'] = _emberValidationsValidatorsBase['default'].extend({
    init: function init() {
      this._super();
      if (this.options.constructor === Array) {
        set(this, 'options', { 'in': this.options });
      }

      if (this.options.message === undefined) {
        set(this, 'options.message', _emberValidationsMessages['default'].render('exclusion', this.options));
      }
    },
    call: function call() {
      /*jshint expr:true*/
      var lower, upper;

      if (_ember['default'].isEmpty(get(this.model, this.property))) {
        if (this.options.allowBlank === undefined) {
          this.errors.pushObject(this.options.message);
        }
      } else if (this.options['in']) {
        if (_ember['default'].$.inArray(get(this.model, this.property), this.options['in']) !== -1) {
          this.errors.pushObject(this.options.message);
        }
      } else if (this.options.range) {
        lower = this.options.range[0];
        upper = this.options.range[1];

        if (get(this.model, this.property) >= lower && get(this.model, this.property) <= upper) {
          this.errors.pushObject(this.options.message);
        }
      }
    }
  });
});
define('ember-validations/validators/local/format', ['exports', 'ember', 'ember-validations/validators/base', 'ember-validations/messages'], function (exports, _ember, _emberValidationsValidatorsBase, _emberValidationsMessages) {
  'use strict';

  var get = _ember['default'].get;
  var set = _ember['default'].set;

  exports['default'] = _emberValidationsValidatorsBase['default'].extend({
    init: function init() {
      this._super();
      if (this.options.constructor === RegExp) {
        set(this, 'options', { 'with': this.options });
      }

      if (this.options.message === undefined) {
        set(this, 'options.message', _emberValidationsMessages['default'].render('invalid', this.options));
      }
    },
    call: function call() {
      if (_ember['default'].isEmpty(get(this.model, this.property))) {
        if (this.options.allowBlank === undefined) {
          this.errors.pushObject(this.options.message);
        }
      } else if (this.options['with'] && !this.options['with'].test(get(this.model, this.property))) {
        this.errors.pushObject(this.options.message);
      } else if (this.options.without && this.options.without.test(get(this.model, this.property))) {
        this.errors.pushObject(this.options.message);
      }
    }
  });
});
define('ember-validations/validators/local/inclusion', ['exports', 'ember', 'ember-validations/validators/base', 'ember-validations/messages'], function (exports, _ember, _emberValidationsValidatorsBase, _emberValidationsMessages) {
  'use strict';

  var get = _ember['default'].get;
  var set = _ember['default'].set;

  exports['default'] = _emberValidationsValidatorsBase['default'].extend({
    init: function init() {
      this._super();
      if (this.options.constructor === Array) {
        set(this, 'options', { 'in': this.options });
      }

      if (this.options.message === undefined) {
        set(this, 'options.message', _emberValidationsMessages['default'].render('inclusion', this.options));
      }
    },
    call: function call() {
      var lower, upper;
      if (_ember['default'].isEmpty(get(this.model, this.property))) {
        if (this.options.allowBlank === undefined) {
          this.errors.pushObject(this.options.message);
        }
      } else if (this.options['in']) {
        if (_ember['default'].$.inArray(get(this.model, this.property), this.options['in']) === -1) {
          this.errors.pushObject(this.options.message);
        }
      } else if (this.options.range) {
        lower = this.options.range[0];
        upper = this.options.range[1];

        if (get(this.model, this.property) < lower || get(this.model, this.property) > upper) {
          this.errors.pushObject(this.options.message);
        }
      }
    }
  });
});
define('ember-validations/validators/local/length', ['exports', 'ember', 'ember-validations/validators/base', 'ember-validations/messages'], function (exports, _ember, _emberValidationsValidatorsBase, _emberValidationsMessages) {
  'use strict';

  var get = _ember['default'].get;
  var set = _ember['default'].set;

  exports['default'] = _emberValidationsValidatorsBase['default'].extend({
    init: function init() {
      var index, key;
      this._super();
      /*jshint expr:true*/
      if (typeof this.options === 'number') {
        set(this, 'options', { 'is': this.options });
      }

      if (this.options.messages === undefined) {
        set(this, 'options.messages', {});
      }

      for (index = 0; index < this.messageKeys().length; index++) {
        key = this.messageKeys()[index];
        if (this.options[key] !== undefined && this.options[key].constructor === String) {
          this.model.addObserver(this.options[key], this, this._validate);
        }
      }

      this.options.tokenizer = this.options.tokenizer || function (value) {
        return value.toString().split('');
      };
      // if (typeof(this.options.tokenizer) === 'function') {
      // debugger;
      // // this.tokenizedLength = new Function('value', 'return '
      // } else {
      // this.tokenizedLength = new Function('value', 'return (value || "").' + (this.options.tokenizer || 'split("")') + '.length');
      // }
    },
    CHECKS: {
      'is': '==',
      'minimum': '>=',
      'maximum': '<='
    },
    MESSAGES: {
      'is': 'wrongLength',
      'minimum': 'tooShort',
      'maximum': 'tooLong'
    },
    getValue: function getValue(key) {
      if (this.options[key].constructor === String) {
        return get(this.model, this.options[key]) || 0;
      } else {
        return this.options[key];
      }
    },
    messageKeys: function messageKeys() {
      return Object.keys(this.MESSAGES);
    },
    checkKeys: function checkKeys() {
      return Object.keys(this.CHECKS);
    },
    renderMessageFor: function renderMessageFor(key) {
      var options = { count: this.getValue(key) },
          _key;
      for (_key in this.options) {
        options[_key] = this.options[_key];
      }

      return this.options.messages[this.MESSAGES[key]] || _emberValidationsMessages['default'].render(this.MESSAGES[key], options);
    },
    renderBlankMessage: function renderBlankMessage() {
      if (this.options.is) {
        return this.renderMessageFor('is');
      } else if (this.options.minimum) {
        return this.renderMessageFor('minimum');
      }
    },
    call: function call() {
      var key, comparisonResult;

      if (_ember['default'].isEmpty(get(this.model, this.property))) {
        if (this.options.allowBlank === undefined && (this.options.is || this.options.minimum)) {
          this.errors.pushObject(this.renderBlankMessage());
        }
      } else {
        for (key in this.CHECKS) {
          if (!this.options[key]) {
            continue;
          }

          comparisonResult = this.compare(this.options.tokenizer(get(this.model, this.property)).length, this.getValue(key), this.CHECKS[key]);
          if (!comparisonResult) {
            this.errors.pushObject(this.renderMessageFor(key));
          }
        }
      }
    }
  });
});
define('ember-validations/validators/local/numericality', ['exports', 'ember', 'ember-validations/validators/base', 'ember-validations/messages', 'ember-validations/patterns'], function (exports, _ember, _emberValidationsValidatorsBase, _emberValidationsMessages, _emberValidationsPatterns) {
  'use strict';

  var get = _ember['default'].get;

  exports['default'] = _emberValidationsValidatorsBase['default'].extend({
    init: function init() {
      /*jshint expr:true*/
      var index, keys, key;
      this._super();

      if (this.options === true) {
        this.options = {};
      } else if (this.options.constructor === String) {
        key = this.options;
        this.options = {};
        this.options[key] = true;
      }

      if (this.options.messages === undefined || this.options.messages.numericality === undefined) {
        this.options.messages = this.options.messages || {};
        this.options.messages.numericality = _emberValidationsMessages['default'].render('notANumber', this.options);
      }

      if (this.options.onlyInteger !== undefined && this.options.messages.onlyInteger === undefined) {
        this.options.messages.onlyInteger = _emberValidationsMessages['default'].render('notAnInteger', this.options);
      }

      keys = Object.keys(this.CHECKS).concat(['odd', 'even']);
      for (index = 0; index < keys.length; index++) {
        key = keys[index];

        var prop = this.options[key];
        // I have no idea what the hell is going on here. This seems to do nothing.
        // The observer's key is being set to the values in the options hash?
        if (key in this.options && isNaN(prop)) {
          this.model.addObserver(prop, this, this._validate);
        }

        if (prop !== undefined && this.options.messages[key] === undefined) {
          if (_ember['default'].$.inArray(key, _ember['default'].keys(this.CHECKS)) !== -1) {
            this.options.count = prop;
          }
          this.options.messages[key] = _emberValidationsMessages['default'].render(key, this.options);
          if (this.options.count !== undefined) {
            delete this.options.count;
          }
        }
      }
    },
    CHECKS: {
      equalTo: '===',
      greaterThan: '>',
      greaterThanOrEqualTo: '>=',
      lessThan: '<',
      lessThanOrEqualTo: '<='
    },
    call: function call() {
      var check, checkValue, comparisonResult;

      if (_ember['default'].isEmpty(get(this.model, this.property))) {
        if (this.options.allowBlank === undefined) {
          this.errors.pushObject(this.options.messages.numericality);
        }
      } else if (!_emberValidationsPatterns['default'].numericality.test(get(this.model, this.property))) {
        this.errors.pushObject(this.options.messages.numericality);
      } else if (this.options.onlyInteger === true && !/^[+\-]?\d+$/.test(get(this.model, this.property))) {
        this.errors.pushObject(this.options.messages.onlyInteger);
      } else if (this.options.odd && parseInt(get(this.model, this.property), 10) % 2 === 0) {
        this.errors.pushObject(this.options.messages.odd);
      } else if (this.options.even && parseInt(get(this.model, this.property), 10) % 2 !== 0) {
        this.errors.pushObject(this.options.messages.even);
      } else {
        for (check in this.CHECKS) {
          if (this.options[check] === undefined) {
            continue;
          }

          if (!isNaN(parseFloat(this.options[check])) && isFinite(this.options[check])) {
            checkValue = this.options[check];
          } else if (get(this.model, this.options[check]) !== undefined) {
            checkValue = get(this.model, this.options[check]);
          }

          comparisonResult = this.compare(get(this.model, this.property), checkValue, this.CHECKS[check]);

          if (!comparisonResult) {
            this.errors.pushObject(this.options.messages[check]);
          }
        }
      }
    }
  });
});
define('ember-validations/validators/local/presence', ['exports', 'ember', 'ember-validations/validators/base', 'ember-validations/messages'], function (exports, _ember, _emberValidationsValidatorsBase, _emberValidationsMessages) {
  'use strict';

  var get = _ember['default'].get;

  exports['default'] = _emberValidationsValidatorsBase['default'].extend({
    init: function init() {
      this._super();
      /*jshint expr:true*/
      if (this.options === true) {
        this.options = {};
      }

      if (this.options.message === undefined) {
        this.options.message = _emberValidationsMessages['default'].render('blank', this.options);
      }
    },
    call: function call() {
      if (_ember['default'].isBlank(get(this.model, this.property))) {
        this.errors.pushObject(this.options.message);
      }
    }
  });
});//# sourceMappingURL=addons.map