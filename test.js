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
    server.render('hi', { message: 'hi' }, function(err, rendered) {
      assert(/hi/g.test(rendered), 'Expected `hi` to be in the string');
      done();
    });
  });

  it('renders a .js file', function(done) {
    server.render('bye.js', { message: 'bye' }, function(err, rendered) {
      assert(/bye/g.test(rendered), 'Expected `bye` to be in the string');
      done();
    });
  });
});
