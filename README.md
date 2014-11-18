hapi-react
==========

> A port of `[express-react-views](https://github.com/reactjs/express-react-views)` to `hapi`

This is an hapi view engine which renders React components on server. It renders static markup and does not support mounting those views on the client.

This is intended to be used as a replacement for existing server-side view solutions, like jade, ejs, or handlebars.

## Install

`npm i -S hapi-react`

Note: You must explicitly install react as a dependency. React is a peer dependency here. This is to avoid issues that may come when using incompatible versions.

## Support for React 0.11.x

The `1.0.0` semver is reserved for `React` 0.11.x versions. Version `2.x.x` and up will support `React` 0.12.x and up.

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
