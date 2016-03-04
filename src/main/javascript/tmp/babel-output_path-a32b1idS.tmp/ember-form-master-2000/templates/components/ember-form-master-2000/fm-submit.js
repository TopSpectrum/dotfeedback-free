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