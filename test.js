'use strict';

var assert = require('assert');
var path = require('path');
var jsdom = require('jsdom');
var hapi = require('hapi');
var hapiReact = require('./');

describe('hapi-react', function() {
  var engine;

  describe('standard', function() {
    var server;

    before(function() {
      engine = hapiReact({
        static: false
      });
      server = new hapi.Server(0);

      server.views({
        defaultExtension: 'jsx',
        path: path.join(__dirname, 'fixtures'),
        engines: {
          jsx: engine,
          js: engine
        }
      });
    });

    it('renders a .jsx file', function(done) {
      server.render('hi', { message: 'hi' }, function(err, rendered) {
        jsdom.env(rendered, function(err, window) {
          assert.ok(window.document.documentElement.getAttribute('data-reactid'));
          assert.ok(window.document.documentElement.getAttribute('data-react-checksum'));
          assert.ok(window.document.body.getAttribute('data-reactid'));
          assert.equal(window.document.body.textContent, 'hi');
          done();
        });
      });
    });

    it('renders a .js file', function(done) {
      server.render('bye.js', { message: 'bye' }, function(err, rendered) {
        jsdom.env(rendered, function(err, window) {
          assert.ok(window.document.documentElement.getAttribute('data-reactid'));
          assert.ok(window.document.documentElement.getAttribute('data-react-checksum'));
          assert.ok(window.document.body.getAttribute('data-reactid'));
          assert.equal(window.document.body.textContent, 'bye');
          done();
        });
      });
    });
  });

  describe('static', function() {
    var server;

    before(function() {
      engine = hapiReact();
      server = new hapi.Server(0);

      server.views({
        defaultExtension: 'jsx',
        path: path.join(__dirname, 'fixtures'),
        engines: {
          jsx: engine,
          js: engine
        }
      });
    });

    it('statically renders a .jsx file', function(done) {
      // Verify that it renders once
      server.render('hi', { message: 'hi' }, function(err, rendered) {
        server.render('hi', { message: 'hi' }, function(err, _rendered) {
          var expected = '<!DOCTYPE html><html><head></head><body>hi</body></html>';
          assert.equal(rendered, expected);
          assert.equal(_rendered, expected);
          done();
        });
      });
    });

    it('statically renders a .js file', function(done) {
      server.render('bye.js', { message: 'bye' }, function(err, rendered) {
        var expected = '<!DOCTYPE html><html><head></head><body>bye</body></html>';
        assert.equal(rendered, expected);
        done();
      });
    });
  });
});
