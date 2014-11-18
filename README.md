[![Build Status](https://travis-ci.org/landau/hapi-react.svg)](https://travis-ci.org/landau/hapi-react)

hapi-react
==========

> A port of `[express-react-views](https://github.com/reactjs/express-react-views)` to `hapi`

This is an hapi view engine which renders React components on server. It renders static markup and does not support mounting those views on the client.

This is intended to be used as a replacement for existing server-side view solutions, like jade, ejs, or handlebars.

## Install

`npm i -S hapi-react`

Note: You must explicitly install react as a dependency. React is a peer dependency here. This is to avoid issues that may come when using incompatible versions.

## Support for React 0.11.x

The `1.x.x` version(s) is reserved for `React` 0.11.x versions. Versions `2.x.x` and up will support `React` 0.12.x and up.

## Usage

Add it to your app

'''js
server = new hapi.Server(0);
var engine = require('hapi-react')();

server.views({
  defaultExtension: 'jsx',
  engines: {
    jsx: engine, // support for .jsx files
    js: engine // support for .js
  }
});
'''

### Options


option | values | default
-------|--------|--------
`jsx.harmony` | `true`: enable a subset of ES6 features | `false`
`jsx.extension` | any file extension with leading `.` | `".jsx"`
`doctype` | any string that can be used as [a doctype](http://en.wikipedia.org/wiki/Document_type_declaration), this will be prepended to your document | `"<!DOCTYPE html>"`
`beautify` | `true`: beautify markup before outputting (note, this can affect rendering due to additional whitespace) | `false`

The defaults are sane, but just in case you want to change something, here's how it would look:

```js
var options = { jsx: { harmony: true } };

server.views({
  engines: {
    jsx: require('hapi-react')(options)
  }
});
'''
```

### Views

Your views should be node modules that export a React component. Let's assume you have this file in `views/index.jsx`:

```js
/** @jsx React.DOM */

var React = require('react');
var HelloMessage = React.createClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});

module.exports = HelloMessage;
```

### Routes

Create a `hapi` route and serve the view.

```js
server.route({
  method: 'GET',
  path: BASE_URL,
  handler: function(request, reply) {
    reply.view('index', {
      name: 'Trevor'
    });
  }
})
```
