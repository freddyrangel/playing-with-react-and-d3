// unfinished/src/components/axis.jsx
import React, { Component } from 'react';
import * as d3 from 'd3';

export default class Axis extends Component {
  componentDidMount() {
    this.renderAxis();
  }

  componentDidUpdate() {
    this.renderAxis();
  }

  renderAxis() {
    if (this.props.ax === 'x') {
      var axis = d3.axisBottom(this.props.xScale).ticks(5);
    } else if (this.props.ax === 'y') {
      var axis = d3.axisLeft(this.props.yScale).ticks(5);
    }

    var node = this.refs.axis;
    d3.select(node).call(axis);
  }

  render() {
    return (
      <g
        className={this.props.ax === 'x' ? 'xAxis' : 'yAxis'}
        ref="axis"
        transform={
          this.props.ax === 'x'
            ? `translate(0, ${this.props.height - this.props.padding})`
            : `translate(${this.props.padding}, 0)`
        }
      />
    );
  }
}
