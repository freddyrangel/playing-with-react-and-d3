var React       = require('react');
var XYAxis      = require('./XYAxis');
var DataCircles = require('./DataCircles');

var ScatterPlot = React.createClass({
  render: function() {
    var props = this.props;
    var xScale = this.getXScale(props);
    var yScale = this.getYScale(props);
    return (
      <svg width={props.width} height={props.height}>
        <DataCircles
          xScale={xScale}
          yScale={yScale}
          {...props} />
        <XYAxis
          xScale={xScale}
          yScale={yScale}
          {...props} />
      </svg>
    );
  },

  getXScale: function(props) {
    var xMax = d3.max(props.data, function(d) { return d[0] });
    return d3.scale.linear()
      .domain([0, xMax])
      .range([props.padding, props.width - props.padding * 2]);
  },

  getYScale: function(props) {
    var yMax = d3.max(props.data, function(d) { return d[1] });
    return d3.scale.linear()
      .domain([0, yMax])
      .range([props.height - props.padding, props.padding]);
  },
});

module.exports = ScatterPlot;
