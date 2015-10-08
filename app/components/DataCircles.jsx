var React = require('react');
var d3    = require('d3');
var uuid  = require('node-uuid');

var DataCircles = React.createClass({
  render: function() {
    return <g>{ this.props.data.map(this.renderCircles) }</g>
  },


  renderCircles: function(coords) {
    var props = {
      cx: this.props.xScale(coords[0]),
      cy: this.props.yScale(coords[1]),
      r: 2,
      key: uuid.v4()
    };
    return (
      <circle {...props}>
      </circle>
    );
  }
});

module.exports = DataCircles;
