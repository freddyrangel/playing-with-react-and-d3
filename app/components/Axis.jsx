var React = require('react');

var Axis = React.createClass({
  render: function() {
    return (
      <g className="axis" transform={this.props.translate}></g>
    );
  },

  componentDidUpdate: function() {
    this.renderAxis();
  },

  componentDidMount: function() {
    this.renderAxis();
  },

  renderAxis: function() {
    var props = this.props;
    var node  = this.getDOMNode();
    var scale = props.scale;
    var axis = d3.svg.axis().orient(props.orient).ticks(5).scale(scale);
    d3.select(node).call(axis);
  }
});

module.exports = Axis;
