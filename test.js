'use strict';

var assert = require('assert');
var path = require('path');
var hapi = require('hapi');
var engine = require('./')();

describe('hapi-react', function() {
  var server;

  before(function() {
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

  it('renders a .js file', function(done) {
    server.render('bye.js', { message: 'bye' }, function(err, rendered) {
      var expected = '<!DOCTYPE html><html><head></head><body>bye</body></html>';
      assert.equal(rendered, expected);
      done();
    });
  });
});
