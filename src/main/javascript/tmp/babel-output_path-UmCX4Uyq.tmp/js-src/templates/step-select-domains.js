define("js-src/templates/step-select-domains", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.4.1",
            "loc": {
              "source": null,
              "start": {
                "line": 3,
                "column": 2
              },
              "end": {
                "line": 9,
                "column": 2
              }
            },
            "moduleName": "js-src/templates/step-select-domains.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("span");
            dom.setAttribute(el2, "class", "availability-status");
            dom.setAttribute(el2, "data-value", "true");
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode(" is available");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("span");
            dom.setAttribute(el2, "class", "availability-status");
            dom.setAttribute(el2, "data-value", "false");
            var el3 = dom.createTextNode("Unavailable");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("span");
            dom.setAttribute(el2, "class", "availability-status");
            dom.setAttribute(el2, "data-value", "reserved");
            var el3 = dom.createTextNode("Reserved");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element3 = dom.childAt(fragment, [1]);
            var morphs = new Array(2);
            morphs[0] = dom.createAttrMorph(element3, 'class');
            morphs[1] = dom.createMorphAt(dom.childAt(element3, [1]), 0, 0);
            return morphs;
          },
          statements: [["attribute", "class", ["concat", [["get", "model.destinationAvailabilityRecord.status", ["loc", [null, [4, 18], [4, 60]]]]]]], ["content", "model.destinationFullDomainName", ["loc", [null, [5, 60], [5, 95]]]]],
          locals: [],
          templates: []
        };
      })();
      var child1 = (function () {
        var child0 = (function () {
          var child0 = (function () {
            return {
              meta: {
                "fragmentReason": false,
                "revision": "Ember@2.4.1",
                "loc": {
                  "source": null,
                  "start": {
                    "line": 20,
                    "column": 16
                  },
                  "end": {
                    "line": 22,
                    "column": 16
                  }
                },
                "moduleName": "js-src/templates/step-select-domains.hbs"
              },
              isEmpty: false,
              arity: 0,
              cachedFragment: null,
              hasRendered: false,
              buildFragment: function buildFragment(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createTextNode("                    Next\n");
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
          return {
            meta: {
              "fragmentReason": false,
              "revision": "Ember@2.4.1",
              "loc": {
                "source": null,
                "start": {
                  "line": 19,
                  "column": 14
                },
                "end": {
                  "line": 23,
                  "column": 14
                }
              },
              "moduleName": "js-src/templates/step-select-domains.hbs"
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
            statements: [["block", "ladda-button", [], ["class", "btn-add btn btn-primary ladda-button", "data-style", "slide-left", "tabindex", "1", "action", "next", "disabled", ["subexpr", "@mut", [["get", "nextIsDisabled", ["loc", [null, [20, 137], [20, 151]]]]], [], []], "spinning", ["subexpr", "@mut", [["get", "model.fetchingSourceFullDomainNameRecord", ["loc", [null, [20, 161], [20, 201]]]]], [], []]], 0, null, ["loc", [null, [20, 16], [22, 33]]]]],
            locals: [],
            templates: [child0]
          };
        })();
        var child1 = (function () {
          var child0 = (function () {
            return {
              meta: {
                "fragmentReason": false,
                "revision": "Ember@2.4.1",
                "loc": {
                  "source": null,
                  "start": {
                    "line": 26,
                    "column": 16
                  },
                  "end": {
                    "line": 28,
                    "column": 16
                  }
                },
                "moduleName": "js-src/templates/step-select-domains.hbs"
              },
              isEmpty: false,
              arity: 0,
              cachedFragment: null,
              hasRendered: false,
              buildFragment: function buildFragment(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createTextNode("                    Update\n");
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
          return {
            meta: {
              "fragmentReason": false,
              "revision": "Ember@2.4.1",
              "loc": {
                "source": null,
                "start": {
                  "line": 25,
                  "column": 14
                },
                "end": {
                  "line": 29,
                  "column": 14
                }
              },
              "moduleName": "js-src/templates/step-select-domains.hbs"
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
            statements: [["block", "ladda-button", [], ["class", "btn-add btn btn-primary ladda-button", "data-style", "slide-left", "tabindex", "1", "action", "next", "disabled", ["subexpr", "@mut", [["get", "nextIsDisabled", ["loc", [null, [26, 137], [26, 151]]]]], [], []], "spinning", ["subexpr", "@mut", [["get", "model.fetchingDestinationAvailabilityRecord", ["loc", [null, [26, 161], [26, 204]]]]], [], []]], 0, null, ["loc", [null, [26, 16], [28, 33]]]]],
            locals: [],
            templates: [child0]
          };
        })();
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.4.1",
            "loc": {
              "source": null,
              "start": {
                "line": 15,
                "column": 4
              },
              "end": {
                "line": 32,
                "column": 4
              }
            },
            "moduleName": "js-src/templates/step-select-domains.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1, "class", "pull-out");
            dom.setAttribute(el1, "style", "position: relative;");
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("div");
            dom.setAttribute(el2, "class", "btn-add-controls");
            var el3 = dom.createTextNode("\n\n");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("            ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element2 = dom.childAt(fragment, [1, 1]);
            var morphs = new Array(2);
            morphs[0] = dom.createMorphAt(element2, 1, 1);
            morphs[1] = dom.createMorphAt(element2, 3, 3);
            return morphs;
          },
          statements: [["block", "unless", [["get", "isEditingEditDestinationFullDomainName", ["loc", [null, [19, 24], [19, 62]]]]], [], 0, null, ["loc", [null, [19, 14], [23, 25]]]], ["block", "if", [["get", "isEditingEditDestinationFullDomainName", ["loc", [null, [25, 20], [25, 58]]]]], [], 1, null, ["loc", [null, [25, 14], [29, 21]]]]],
          locals: [],
          templates: [child0, child1]
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
              "line": 33,
              "column": 0
            }
          },
          "moduleName": "js-src/templates/step-select-domains.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h1");
          dom.setAttribute(el1, "class", "label-free-domain-name");
          var el2 = dom.createTextNode("\n        Free domain\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          morphs[1] = dom.createMorphAt(fragment, 5, 5, contextualElement);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "if", [["get", "hasDestinationAvailabilityRecord", ["loc", [null, [3, 8], [3, 40]]]]], [], 0, null, ["loc", [null, [3, 2], [9, 9]]]], ["block", "validated-input", [], ["type", "text", "data-minlength", "3", "tabindex", "0", "autocomplete", "off", "placeholder", "", "value", ["subexpr", "@mut", [["get", "model.destinationCustomerDomainName", ["loc", [null, [15, 107], [15, 142]]]]], [], []], "errors", ["subexpr", "@mut", [["get", "errors.model.domainName", ["loc", [null, [15, 150], [15, 173]]]]], [], []], "enter", "next", "disabled", ["subexpr", "@mut", [["get", "model.loading", ["loc", [null, [15, 196], [15, 209]]]]], [], []], "mask", "^[^.]*$"], 1, null, ["loc", [null, [15, 4], [32, 24]]]]],
        locals: [],
        templates: [child0, child1]
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
              "line": 38,
              "column": 0
            },
            "end": {
              "line": 50,
              "column": 0
            }
          },
          "moduleName": "js-src/templates/step-select-domains.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "alert alert-info clearfix");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h4");
          var el3 = dom.createTextNode("Modeling ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("strong");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" WHOIS");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n        We will use the whois record for ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" listed below. Please choose a different model domain to clone a whois record for your registration or edit the record.\n\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2, "class", "pull-right");
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("a");
          dom.setAttribute(el3, "class", "btn btn-default");
          var el4 = dom.createTextNode("\n                Model after something else\n            ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [5, 1]);
          var morphs = new Array(3);
          morphs[0] = dom.createMorphAt(dom.childAt(element0, [1, 1]), 0, 0);
          morphs[1] = dom.createMorphAt(element0, 3, 3);
          morphs[2] = dom.createElementMorph(element1);
          return morphs;
        },
        statements: [["content", "model.sourceFullDomainName", ["loc", [null, [40, 29], [40, 61]]]], ["content", "model.sourceFullDomainName", ["loc", [null, [42, 41], [42, 73]]]], ["element", "action", ["chooseDifferentSourceFullDomainName"], [], ["loc", [null, [45, 15], [45, 63]]]]],
        locals: [],
        templates: []
      };
    })();
    var child2 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.4.1",
            "loc": {
              "source": null,
              "start": {
                "line": 55,
                "column": 6
              },
              "end": {
                "line": 57,
                "column": 6
              }
            },
            "moduleName": "js-src/templates/step-select-domains.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          Loading...\n");
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
      var child1 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.4.1",
            "loc": {
              "source": null,
              "start": {
                "line": 57,
                "column": 6
              },
              "end": {
                "line": 59,
                "column": 6
              }
            },
            "moduleName": "js-src/templates/step-select-domains.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
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
          statements: [["inline", "whois-table", [], ["model", ["subexpr", "@mut", [["get", "model.sourceFullDomainNameRecord", ["loc", [null, [58, 28], [58, 60]]]]], [], []], "email", ["subexpr", "@mut", [["get", "model.email", ["loc", [null, [58, 67], [58, 78]]]]], [], []], "errors", ["subexpr", "@mut", [["get", "errors", ["loc", [null, [58, 86], [58, 92]]]]], [], []]], ["loc", [null, [58, 8], [58, 94]]]]],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 52,
              "column": 0
            },
            "end": {
              "line": 61,
              "column": 0
            }
          },
          "moduleName": "js-src/templates/step-select-domains.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "id", "whois");
          dom.setAttribute(el1, "class", "section col-sm-12");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h3");
          var el3 = dom.createTextNode("Whois");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 3, 3);
          return morphs;
        },
        statements: [["block", "if", [["get", "model.fetchingSourceFullDomainNameRecord", ["loc", [null, [55, 12], [55, 52]]]]], [], 0, 1, ["loc", [null, [55, 6], [59, 13]]]]],
        locals: [],
        templates: [child0, child1]
      };
    })();
    var child3 = (function () {
      var child0 = (function () {
        var child0 = (function () {
          var child0 = (function () {
            return {
              meta: {
                "fragmentReason": false,
                "revision": "Ember@2.4.1",
                "loc": {
                  "source": null,
                  "start": {
                    "line": 67,
                    "column": 14
                  },
                  "end": {
                    "line": 69,
                    "column": 14
                  }
                },
                "moduleName": "js-src/templates/step-select-domains.hbs"
              },
              isEmpty: false,
              arity: 0,
              cachedFragment: null,
              hasRendered: false,
              buildFragment: function buildFragment(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createTextNode("                  Update\n");
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
          return {
            meta: {
              "fragmentReason": false,
              "revision": "Ember@2.4.1",
              "loc": {
                "source": null,
                "start": {
                  "line": 63,
                  "column": 4
                },
                "end": {
                  "line": 72,
                  "column": 4
                }
              },
              "moduleName": "js-src/templates/step-select-domains.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("        ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("div");
              dom.setAttribute(el1, "class", "pull-out");
              dom.setAttribute(el1, "style", "position: relative;");
              var el2 = dom.createTextNode("\n\n            ");
              dom.appendChild(el1, el2);
              var el2 = dom.createElement("div");
              dom.setAttribute(el2, "class", "btn-add-controls");
              var el3 = dom.createTextNode("\n");
              dom.appendChild(el2, el3);
              var el3 = dom.createComment("");
              dom.appendChild(el2, el3);
              var el3 = dom.createTextNode("            ");
              dom.appendChild(el2, el3);
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("\n        ");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1, 1]), 1, 1);
              return morphs;
            },
            statements: [["block", "ladda-button", [], ["class", "btn-add btn btn-primary ladda-button", "data-style", "slide-left", "tabindex", "1", "action", "selectModelFromDomainName", "disabled", ["subexpr", "@mut", [["get", "hasInvalidNewSourceFullDomainName", ["loc", [null, [67, 156], [67, 189]]]]], [], []], "spinning", ["subexpr", "@mut", [["get", "model.loading", ["loc", [null, [67, 199], [67, 212]]]]], [], []]], 0, null, ["loc", [null, [67, 14], [69, 31]]]]],
            locals: [],
            templates: [child0]
          };
        })();
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.4.1",
            "loc": {
              "source": null,
              "start": {
                "line": 62,
                "column": 2
              },
              "end": {
                "line": 73,
                "column": 2
              }
            },
            "moduleName": "js-src/templates/step-select-domains.hbs"
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
          statements: [["block", "validated-input", [], ["type", "text", "label", "Enter a domain name to model the whois information after", "data-minlength", "3", "tabindex", "0", "autocomplete", "off", "placeholder", "", "value", ["subexpr", "@mut", [["get", "model.newSourceFullDomainName", ["loc", [null, [63, 172], [63, 201]]]]], [], []], "enter", "selectModelFromDomainName", "actionReceiver", ["subexpr", "@mut", [["get", "selectModelFromDomainNameInput", ["loc", [null, [63, 251], [63, 281]]]]], [], []]], 0, null, ["loc", [null, [63, 4], [72, 24]]]]],
          locals: [],
          templates: [child0]
        };
      })();
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 61,
              "column": 0
            },
            "end": {
              "line": 74,
              "column": 0
            }
          },
          "moduleName": "js-src/templates/step-select-domains.hbs"
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
        statements: [["block", "if", [["get", "isEditing", ["loc", [null, [62, 8], [62, 17]]]]], [], 0, null, ["loc", [null, [62, 2], [73, 9]]]]],
        locals: [],
        templates: [child0]
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
            "line": 74,
            "column": 7
          }
        },
        "moduleName": "js-src/templates/step-select-domains.hbs"
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
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "hidden");
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "hidden");
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
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
        var morphs = new Array(5);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(dom.childAt(fragment, [2]), 0, 0);
        morphs[2] = dom.createMorphAt(dom.childAt(fragment, [4]), 0, 0);
        morphs[3] = dom.createMorphAt(fragment, 6, 6, contextualElement);
        morphs[4] = dom.createMorphAt(fragment, 8, 8, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "unless", [["get", "isEditing", ["loc", [null, [1, 10], [1, 19]]]]], [], 0, null, ["loc", [null, [1, 0], [33, 11]]]], ["content", "showModelingBar", ["loc", [null, [35, 20], [35, 39]]]], ["content", "isEditingEditDestinationFullDomainName", ["loc", [null, [36, 20], [36, 62]]]], ["block", "if", [["get", "showModelingBar", ["loc", [null, [38, 6], [38, 21]]]]], [], 1, null, ["loc", [null, [38, 0], [50, 7]]]], ["block", "if", [["get", "showWhoisTable", ["loc", [null, [52, 6], [52, 20]]]]], [], 2, 3, ["loc", [null, [52, 0], [74, 7]]]]],
      locals: [],
      templates: [child0, child1, child2, child3]
    };
  })());
});