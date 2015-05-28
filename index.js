'use strict';

var React = require('react');
var beautifyHTML = require('js-beautify').html;
var assign = require('object-assign');
var path = require('path');

var DEFAULT_OPTIONS = {
  doctype: '<!DOCTYPE html>',
  beautify: false
};

module.exports = function createEngine(engineOptions) {
  var registered = false;
  var moduleDetectRegEx;
  engineOptions = assign({}, DEFAULT_OPTIONS, engineOptions || {});

  function compile(template, options) {
    // Defer babel registration until the first request so we can grab the view path.
    if (!registered) {
      var filePath = path.dirname(options.filename);
      moduleDetectRegEx = new RegExp('^' + filePath);

      // Passing a RegExp to Babel results in an issue on Windows so we'll just
      // pass the view path.
      require('babel/register')({ only: filePath });
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
        markup += React.renderToStaticMarkup(React.createElement(component, context));
      } catch (e) {
        throw e;
      }

      if (engineOptions.beautify) {
        // NOTE: This will screw up some things where whitespace is important, and be
        // subtly different than prod.
        markup = beautifyHTML(markup);
      }

      if (options.env === 'development') {
        // Remove all files from the module cache that are in the view folder.
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
