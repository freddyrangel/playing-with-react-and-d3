// unfinished/src/components/scatter-plot.jsx
import React from 'react';
import * as d3 from 'd3';
import DataCircles from './data-circles';
import Axis from './axis';

// Returns the largest X coordinate from the data set.
const xMax = data => d3.max(data, d => d[0]);

// Returns the higest Y coordinate from the data set.
const yMax = data => d3.max(data, d => d[1]);

// Returns a function that "scales" X coordinates from the data to fit the chart.
const xScale = props => {
  return d3
    .scaleLinear()
    .domain([0, xMax(props.data)])
    .range([props.padding, props.width - props.padding * 2]);
};

// Returns a function that "scales" Y coordinates from the data to fit the chart.
const yScale = props => {
  return d3
    .scaleLinear()
    .domain([0, yMax(props.data)])
    .range([props.height - props.padding, props.padding]);
};

const ScatterPlot = props => {
  const scales = { xScale: xScale(props), yScale: yScale(props) };

  return (
    <svg width={props.width} height={props.height}>
      <DataCircles {...props} {...scales} />
      <Axis ax={'x'} {...props} {...scales} />
      <Axis ax={'y'} {...props} {...scales} />
    </svg>
  );
};

export default ScatterPlot;
