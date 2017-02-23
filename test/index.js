'use strict';

var path = require('path');
var hapi = require('hapi');
var engine = require('../')();

describe('hapi-react', function() {
  var server, testComponent;

  before(function(done) {
    server = new hapi.Server(0);
    server.register(require('vision'), function(err) {
      if (err) {
        return done(err);
      }

      server.views({
        defaultExtension: 'jsx',
        path: path.join(__dirname, 'fixtures'),
        engines: {
          jsx: engine,
          js: engine
        }
      });

      done();
    });

    testComponent = function(view, cb) {
      server.render(view, { title: 'foo' }, function(err, source) {
        if (err) {
          return cb(err);
        }

        var output = 'I can count to 10:1, 2, 3, 4, 5, 6, 7, 8, 9, 10';
        if (source.indexOf(output) < 0) {
          err = new Error('View did not render correctly.');
        }

        cb(err, source);
      });
    };
  });

  it('renders a regular js', function(done) {
    this.timeout(30e3);
    testComponent('standard-js.js', done);
  });

  it('renders a es5 module', function(done) {
    testComponent('es5-component', done);
  });

  it('renders a es6 module', function(done) {
    testComponent('es6-component', done);
  });

  it('renders a es6 module with fb flow', function(done) {
    testComponent('es6-flow-component', done);
  });
});
