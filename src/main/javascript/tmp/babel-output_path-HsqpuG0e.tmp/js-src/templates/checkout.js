define("js-src/templates/checkout", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.4.1",
          "loc": {
            "source": null,
            "start": {
              "line": 23,
              "column": 6
            },
            "end": {
              "line": 25,
              "column": 6
            }
          },
          "moduleName": "js-src/templates/checkout.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          Finish\n");
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
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 27,
            "column": 6
          }
        },
        "moduleName": "js-src/templates/checkout.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h1");
        var el3 = dom.createTextNode("Confirm ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "row");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("textarea");
        dom.setAttribute(el3, "class", "form-control");
        dom.setAttribute(el3, "style", "overflow-y: scroll; height: 100px; width: 100%;");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "row");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("a");
        dom.setAttribute(el3, "target", "_blank");
        dom.setAttribute(el3, "href", "/terms");
        dom.setAttribute(el3, "class", "pull-right");
        var el4 = dom.createTextNode("View Terms");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "checkbox");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" I agree to the terms of service\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var morphs = new Array(5);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 1, 1);
        morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]), 1, 1);
        morphs[2] = dom.createMorphAt(dom.childAt(element0, [5, 1]), 0, 0);
        morphs[3] = dom.createMorphAt(dom.childAt(element0, [9, 1]), 1, 1);
        morphs[4] = dom.createMorphAt(dom.childAt(element0, [11]), 1, 1);
        return morphs;
      },
      statements: [["content", "model.record.destinationFullDomainName", ["loc", [null, [2, 16], [2, 58]]]], ["inline", "whois-table", [], ["model", ["subexpr", "@mut", [["get", "model.record", ["loc", [null, [5, 26], [5, 38]]]]], [], []], "email", ["subexpr", "@mut", [["get", "model.email", ["loc", [null, [5, 45], [5, 56]]]]], [], []], "disabled", true], ["loc", [null, [5, 6], [5, 72]]]], ["content", "model.terms", ["loc", [null, [9, 93], [9, 108]]]], ["inline", "input", [], ["type", "checkbox", "name", "isAdmin", "checked", ["subexpr", "@mut", [["get", "model.acceptsTos", ["loc", [null, [18, 57], [18, 73]]]]], [], []], "disabled", ["subexpr", "@mut", [["get", "model.spinning", ["loc", [null, [18, 83], [18, 97]]]]], [], []]], ["loc", [null, [18, 10], [18, 99]]]], ["block", "ladda-button", [], ["class", "btn-add btn btn-primary ladda-button", "data-style", "slide-left", "tabindex", "1", "action", "next", "disabled", ["subexpr", "@mut", [["get", "isInvalid", ["loc", [null, [23, 127], [23, 136]]]]], [], []], "spinning", ["subexpr", "@mut", [["get", "model.spinning", ["loc", [null, [23, 146], [23, 160]]]]], [], []]], 0, null, ["loc", [null, [23, 6], [25, 23]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});