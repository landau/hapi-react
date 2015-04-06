'use strict';

var React = require('react');
var beautifyHTML = require('js-beautify').html;
var nodeJSX = require('node-jsx');
var assign = require('object-assign');

var DEFAULT_OPTIONS = {
  jsx: {
    extension: '.jsx',
    harmony: false
  },
  doctype: '<!DOCTYPE html>',
  beautify: false
};

module.exports = function createEngine(engineOptions) {
  engineOptions = engineOptions || {};
  // Merge was nice because it did nest objects. assign doesn't. So we're going
  // to assign the JSX options then the rest. If there were more than a single
  // nested option, this would be really dumb. As is, it looks pretty stupid but
  // it keeps our dependencies slim.
  var jsxOptions = assign({}, DEFAULT_OPTIONS.jsx, engineOptions.jsx);

  // Since we're passing an object with jsx as the key, it'll override the rest.
  engineOptions = assign({}, DEFAULT_OPTIONS, engineOptions, {jsx: jsxOptions});

  // Don't install the require until the engine is created. This lets us leave
  // the option of using harmony features up to the consumer.
  nodeJSX.install(engineOptions.jsx);

  function compile(template, options) {
    var filename = options.filename;
    var doctype = engineOptions.doctype;
    var component;

    try {
      component = require(filename);
      // Transpiled ES6 may export components as { default: Component }
      component = component.default || component;
      component = React.createFactory(component);
    } catch (e) {
      return function() {
        throw e;
      };
    }

    return function _compile(context) {
      var markup = doctype;

      try {
        markup += React.renderToStaticMarkup(component(context));
      } catch (e) {
        throw e;
      }

      if (engineOptions.beautify) {
        // NOTE: This will screw up some things where whitespace is important, and be
        // subtly different than prod.
        markup = beautifyHTML(markup);
      }

      if (options.env === 'development' || options.cached === false || engineOptions.cached === false) {
        delete require.cache[require.resolve(options.filename)];
      }

      return markup;
    };
  }

  return {
    compile: compile
  };
};
