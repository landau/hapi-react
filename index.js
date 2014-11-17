'use strict';

var React = require('react');
var beautifyHTML = require('js-beautify').html;
var nodeJSX = require('node-jsx');
var _merge = require('lodash.merge');

var DEFAULT_OPTIONS = {
  jsx: {
    extension: '.jsx',
    harmony: false
  },
  doctype: '<!DOCTYPE html>',
  beautify: false
};

module.exports = function createEngine(engineOptions) {
  engineOptions = _merge(DEFAULT_OPTIONS, engineOptions);

  // Don't install the require until the engine is created. This lets us leave
  // the option of using harmony features up to the consumer.
  nodeJSX.install(engineOptions.jsx);

  var moduleDetectRegEx = new RegExp('\\' + engineOptions.jsx.extension + '$');

  function compile(template, options) {
    var filename = options.filename;
    var markup, component;

    try {
      markup = engineOptions.doctype;
      component = require(filename);
      // Transpiled ES6 may export components as { default: Component }
      component = component.default || component;
    } catch (e) {
      return function() {
        throw e;
      };
    }

    return function _compile(context) {
      try {
        markup += React.renderComponentToStaticMarkup(component(context));
      } catch (e) {
        throw e;
      }

      if (engineOptions.beautify) {
        // NOTE: This will screw up some things where whitespace is important, and be
        // subtly different than prod.
        markup = beautifyHTML(markup);
      }

      if (options.env === 'development') {
        // Remove all files from the module cache that use our extension. If we're
        // using .js, this could be sloooow. On the plus side, we can now make changes
        // to our views without needing to restart the server.
        Object.keys(require.cache).forEach(function(module) {
          if (moduleDetectRegEx.test(require.cache[module].filename)) {
            delete require.cache[module];
          }
        });
      }

      return markup;
    };
  }

  return {
    compile: compile
  };
};
