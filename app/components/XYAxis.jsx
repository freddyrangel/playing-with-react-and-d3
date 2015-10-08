var React = require('react');
var d3    = require('d3');
var Axis  = require('./Axis');

var XYAxis = React.createClass({
  render: function() {
    var props = this.props;
    var xSettings = {
      translate: 'translate(0,' + (props.height - props.padding) + ')',
      scale: props.xScale,
      orient: 'bottom'
    };
    var ySettings = {
      translate: 'translate(' + props.padding + ', 0)',
      scale: props.yScale,
      orient: 'left'
    };
    return (
      <g className="xy-axis">
        <Axis {...xSettings}/>
        <Axis {...ySettings}/>
      </g>
    );
  }
});

module.exports = XYAxis;
