/** @jsx React.DOM */
'use strict';
var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <html>
        <head></head>
        <body>{this.props.message}</body>
      </html>
    );
  }
});
