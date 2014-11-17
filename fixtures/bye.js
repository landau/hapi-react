'use strict';

var React = require('react');
var DOM = React.DOM;

module.exports = React.createClass({
  render: function() {
    return DOM.html(null, DOM.head(null), DOM.body(null, this.props.message));
  }
});
