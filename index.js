'use strict';

var React = require('react');
var ReactDOMServer = require('react-dom/server');
var beautifyHTML = require('js-beautify').html;
var assign = require('object-assign');
var path = require('path');
var _escaperegexp = require('lodash.escaperegexp');

var DEFAULT_OPTIONS = {
  doctype: '<!DOCTYPE html>',
  beautify: false,
  transformViews: true,
  babel: {
    presets: [
      'react',
      'es2015'
    ]
  }
};

module.exports = function createEngine(engineOptions) {
  var registered = false;
  var moduleDetectRegEx;
  var filePath;
  engineOptions = assign({}, DEFAULT_OPTIONS, engineOptions || {});

  function compile(template, options) {
    // Defer babel registration until the first request so we can grab the view path.
    if (!moduleDetectRegEx) {
      filePath = path.dirname(options.filename);
      moduleDetectRegEx = new RegExp('^' + _escaperegexp(filePath));
    }

    if (engineOptions.transformViews && !registered) {

      // Passing a RegExp to Babel results in an issue on Windows so we'll just
      // pass the view path.
      require('babel-register')(assign({ only: filePath }, engineOptions.babel));
      registered = true;
    }

    var component;

    try {
      component = require(options.filename);
      // Transpiled ES6 may export components as { default: Component }
      component = component.default || component;
    } catch (e) {
      return function() {
        throw e;
      };
    }

    return function _compile(context) {
      var markup = engineOptions.doctype;

      try {
        markup += ReactDOMServer.renderToStaticMarkup(React.createElement(component, context));
      } catch (e) {
        throw e;
      } finally {
        if (options.env === 'development') {
          // Remove all files from the module cache that are in the view folder.
          Object.keys(require.cache).forEach(function(module) {
            if (moduleDetectRegEx.test(require.cache[module].filename)) {
              delete require.cache[module];
            }
          });
        }
      }

      if (engineOptions.beautify) {
        // NOTE: This will screw up some things where whitespace is important, and be
        // subtly different than prod.
        markup = beautifyHTML(markup);
      }


      return markup;
    };
  }

  return {
    compile: compile
  };
};
