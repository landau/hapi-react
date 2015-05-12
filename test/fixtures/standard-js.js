var React = require('react');
var DOM = React.DOM;

function countTo(n) {
  var a = [];
  for (var i = 0; i < n; i++ ) {
    a.push(i + 1);
  }
  return a.join(', ');
}

var Index = React.createClass({
  propTypes: {
    title: React.PropTypes.string
  },

  render: function() {
    return DOM.div(
      null,
      DOM.h1(null, this.props.title),
      DOM.p(null, 'Welcome to ' + this.props.title),
      DOM.p(null, 'I can count to 10:' + countTo(10))
    );
  }
});

module.exports = Index;
