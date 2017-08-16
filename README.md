# Playing With React and D3v4

	------------
	Fork notice
	------------
		
	Original tutorial compatible with d3v3 can be found in d3v3 branch.
	Current master branch is refactored original code compatible with d3v4.


At this point, we can now safely say [React](https://facebook.github.io/react/) is the preferred JavaScript library for building user interfaces. It is used practically everywhere, rivaling the level of ubiquity of [jQuery](https://jquery.com/). It has an API that is simple, powerful, and easy to learn. Its performance characteristics are really impressive thanks to the Virtual DOM and its clever [diff algorithm](https://facebook.github.io/react/docs/reconciliation.html) between state changes. However, nothing is the promised land and React is no different. While one of React's strengths is the easy of integrating third-party libaries, certain libraries are more difficult to integrate than others, especially opinionated libraries.

One extremely popular library that is tricky to integrate with React is [D3.js](https://d3js.org/). D3 is an excellent data visualization library with a rich and powerful API. It is the gold standard of data visualization, but it is not a trivial endevour to get it to work with React. Still, with a few simple strategies we can get these two libraries to work together in very powerful ways.

## What is React?

Anyone working in modern client-side JavaScript has most likely heard of React and perhaps have used it in their applications. React is an open-source JavaScript library for creating user interfaces that aims to address the problems of building large applications with data that changes over time. It was originally developed at Facebook and is now seen in many web applications including Instagram, Netflix, Airbnb, HelloSign, and many others.

## Why is React so popular?

React helps developers build applications by helping manage application state. It's simple, declarative, and composable. React is not a traditional MVC framework. React is really only interested in building user interfaces. Some have called it the "V" in MVC, but that's a little misleading. React sees the world much differently from traditional MVC frameworks. As more application logic started moving toward the client, many application developers wanted to apply some kind of structure to their front-end JavaScript. So we started applying a paradigm that we understood from the server (MVC) and apply it to the browser. The problem with this approach is that the browser environment is very different from the server. React acknowledges that client-side applications are really a collection of UI components that should react to events like user interaction.

React encourages building applications out of self-contained, reusable components that only care about a small piece of the UI. Many other frameworks attempt to do this such as Angular. React is different in that it enforces uni-directional data flow from parent component to child component. This makes debugging much easier. Most time spent working on applications is spent on debugging, so while React is more verbose that other libraries/frameworks, in the end it saves a lot of time. In a framework like Angular, if there's a bug it can be hard to figure out where it's coming from: is it in the view? The model? The controller? The directive? The directive controller? Data in Angular flows in many different directions, making it hard to reason about that state of your application. In React, when there is a bug, you can quickly determine where the bug originated from, since data only moves in one direction. If there is a bug, you just trace the direction of the data until you find the culprit.

## What is D3?

D3 (Data-Driven Documents) is a JavaScript library for producing dynamic, interactive data-visualizations. It is the standard for data visualizations, almost like a jQuery for data visualization. It's fairly low level, giving the developer a lot of control over then end result. It takes a bit of work to get it to do what you want, so if you're looking for a more prepackaged solution you're probably better off with highcharts.js. That said, after you work with it for a while it starts to become pretty intuitive and its flexibility becomes a joy.

D3 essentially does 4 things: load data, bind data elements to the DOM via JavaScript and SVG, transforms those elements by interpreting data and setting its visual properties, and transitions elements in response to user input.

## Why Would We Want To Use React with D3?

D3 is great at data visualizations, but it manipulates the DOM directly to display that data. Rendering DOM elements is where React shines. It uses a virtual representation of the DOM (virtual DOM) and uses a super performant diffing algorithm to determine the fastest way to update the DOM. We want to leverage React's highly efficient, declarative, and reusable components with D3's data utility functions. Also, once we create a chart component, we can reuse that chart with different data anywhere in our app.

## How use React and D3?

D3, like React, is declarative. Unlike React, D3 used data binding, while React uses a uni-directional data flow paradigm. Getting them to work together takes a bit of work but the strategy is fairly simple: since SVG lives in the DOM, let React handle displaying SVG representations of the data, while letting D3 handle all the math required to render the data.

Of course, we'll have to make compromises where necessary. React is really unopinionated and flexible, allowing you to do almost anything you need to do. Some things, like creating Axes, are very tedious to create. So we're going to let D3 directly access the DOM and create. It's pretty good axes and since we only need to create very few of those, won't ever become a performance problem.

We are going to go through a simple example of generating a random list of X-Y coordinates and displaying them on a ScatterPlot chart. If you're following the tutorial, a finished example is provided for you under the "finished" directory but you can follow along under "unfinished". I've gone through the trouble of doing all the setup for you. The build will automatically be created from "unfinished/src/index.jsx"

Let's start by creating a simple "Hello World!" React component. Create a file under "components" named "chart.jsx"

```javascript
// unfinished/src/components/chart.jsx
import React, { Component } from 'react';

export default (props) => {
  return <h1>Hello, World!</h1>;
}
```

This example is so simple it almost needs no explanation. Since we're rendering a simple H1 with no state, we can just export a function that returns the HTML we expect. If you're coming from Angular or Ember this might look weird, the fact that we're putting HTML directly into our JS code. This goes against everything we've learned about unobtrusive JavaScript. But this makes sense: we're not putting JavaScript in our HTML but putting our HTML into our JavaScript. React sees HTML and client-side JavaScript as fundamentally bonded together. They're both concerned about one thing: rendering UI components to the user. They simply cannot be seperated without losing the ability to see what your component is going at a glance. The beauty of this approach is that you can describe exactly what your component will look like when it's rendered.

Also keep in mind that this is only possible with JSX, which will translate HTML elements into React functions that will render the HTML to the page.

Now let's move on and mount our component to the DOM. Open up "index.jsx"

```javascript
// unfinished/src/index.jsx
import './main.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Chart from './components/chart.jsx';

const mountingPoint = document.createElement('div');
mountingPoint.className = 'react-app';
document.body.appendChild(mountingPoint);
ReactDOM.render(<Chart />, mountingPoint);
```

You may have noticed a few things. You might be wondering why we're requiring a CSS file. We're using Webpack, which allows us to require CSS files. This is really useful when we need to modularize our stylesheets as well as our JavaScript. We're also creating a div in which we want to mount our React app. That's just a good practice just in case you want to do other things on the page other than render a React component. Lastly, we're calling `render` on ReactDOM with 2 arguments, the name of the component and the DOM element we want to mount it on.

Now let's install all the dependencies by navigating to the `unfinished` directory and running `npm i`. Then fire up the server with `npm run start` and go to `localhost:8080`

![Basic Render Image](/images/basic_render.png)

Awesome, we have rendered our first React component! Let's do something a little less trivial now.

We're going to create some functions that will create an array of random data points, and then render a [scatter plot](https://en.wikipedia.org/wiki/Scatter_plot). While we're at it, we'll add a button to randomize the dataset and trigger a re-render of our app. Let's open up our `Chart` component and add the following:

```javascript
// unfinished/src/components/chart.jsx
import React, { Component } from 'react';
import ScatterPlot from './scatter-plot';

const styles = {
  width: 500,
  height: 300,
  padding: 30
};

// The number of data points for the chart.
const numDataPoints = 50;

// A function that returns a random number from 0 to 1000.
const randomNum = () => Math.floor(Math.random() * 1000);

// A function that creates an array of 50 elements of (x, y) coordinates.
const randomDataSet = () => {
  return Array.from(Array(numDataPoints)).map(() => [randomNum(), randomNum()]);
};

export default class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = { data: randomDataSet() };
  }

  randomizeData() {
    this.setState({ data: randomDataSet() });
  }

  render() {
    return (
      <div>
        <h1>Playing With React and D3v4</h1>
        <ScatterPlot {...this.state} {...styles} />
        <div className="controls">
          <button
            className="btn randomize"
            onClick={() => this.randomizeData()}
          >
            Randomize Data
          </button>
        </div>
      </div>
    );
  }
}

```

Since we want our component to manage it's own state, we need to add a bit more code to our previous "Hello World" stateless functional component. Instead of just a function, we're going to extend `React.Component` and describe our component in the `render()` method. `render()` is the heart of any React component. It describes what our component is supposed to look like. React will call `render()` on initial mount and on every state change.

Inside of `render()` we are rendering a ScatterPlot component as if it were an HTML elemement, and setting some properties or "props". The `...` syntax is a convenient JSX and ES2015 spread operator that spread attributes of an array or object, instead of doing all of that explicitly. For more information check out: [JSX Spread Attributes](https://facebook.github.io/react/docs/jsx-spread.html). We're going to use it to pass along our data and a style object which will be used by some of our child components.

In addition, we're also rendering a button with an `onClick` event handler. We're going to wrap `this.randomizeData()` with an arrow function so we bind the value of `this` to our `Chart` component. When the button is clicked, `randomizeData()` will call `this.setState()` passing in some new data.

Let's talk about `this.setState()`. If `render()` is the heart of a React component, `setState()` is the brains of a component. `setState` explicitly tells React that we're changing some kind of state, triggering a re-render of the component and its children. This essentially turns our UI components into state machines.

Inside of `setState()`, we're passing an object with `data` set to the `randomDataSet()`. This means that if we want to retrieve the state of out application, we only have to call `this.state.whateverStateWereLookingFor`. In this case, we can retrieve the randomData by calling `this.state.data`

A little side note about how React works: React offers great performance for rendering UI components by implementing a diff algorithm, comparing a virtual DOM in memory with the actual DOM. When you think about it, the DOM is really a large tree structure. If there's one thing we learned from decades of computer science research, it's how to compare and manipulate trees. React takes advantage of clever tree diffing algorithms, but in order for it to work, each component can only render one parent element (meaning that you cannot render sibling elements). That's why In the render function we're wrapping all our elements in one parent div.

Let's get started with the ScatterPlot component. Create a file 
`unfinished/src/components/scatter-plot.jsx` :

```javascript
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
    </svg>
  );
};

export default ScatterPlot;
```

There's a lot going on here so let's start with the stateless functional component we're exporting. D3 uses SVG to render data visualizations. D3 has special methods for creating SVG elements and binding data to those elements. However, we're going to let React handle that. We're creating an SVG element with the properties passed in by the `Chart` component, which can be accessed via `this.props`. Then we're creating a `DataCircles` component (we're going to create in a minute) which will render the points for the scatter plot.

Let's talk about D3 scales. This is where D3 shines. Scales take care of doing all the messy math converting your data into a format that can be displayed on a chart. If you have a data point value 189281 but your chart is only 200 pixels wide, D3 scales will convert that number to a number you can use to plot that point.

`d3.scaleLinear()` returns a linear scale. D3 also supports other types of scales: ordinal, logarithmic, square root, etc.. We won't be talking about those here. `domain` is short for an "input domain", meaning the range of possible input values. It takes an array of the smallest input value possible and the maximum input value. `range` is the "output range" which is the range of possible output values. So in `domain`, we're setting the range of possible data values from our random data, and in `range` we're telling D3 the range of our chart. `d3.max` is a d3 method for determining the maximum value of a dataset. It can take a function which D3 will use to give the max values of the X and Y coordinates.

We will be using the scales for rendering the data circles and our axes.

Let's create the DataCircles component under `unfinished/src/components/data-circles.jsx`

```javascript
// unfinished/src/components/data-circles.jsx
import React from 'react';

const renderCircles = props => {
  return (coords, index) => {
    const circleProps = {
      cx: props.xScale(coords[0]),
      cy: props.yScale(coords[1]),
      r: 3,
      key: index
    };
    return <circle {...circleProps} />;
  };
};

const DataCircles = props => {
  return <g>{props.data.map(renderCircles(props))}</g>;
};

export default DataCircles;
```

In this component, we're rendering a `g` element, which is like the SVG equivalent to a `div`. Since we want to render a point for every set of X-Y coordinates, we're going to render multiple sibling elements, so we're wrapping it all in a `g` element for React to work. Inside of `g`, we're mapping over the data and rendering a circle for each one using `renderCircles`. `renderCircles` creates an SVG `circle` element which takes a number of properties. Here's we're setting the x and y coordinates (`cx` and `cy` respectively) with the D3 scales passed in from the ScatterPlot component. `r` is the radius of our circle, and key is something React requires us to do. Since we're rendering identical sibling components, React's diffing algorithm needs some kind of way to keep track of them as it updates the DOM over and over. You can use any key you like, as long as it's unique to the list. Here we're just going to use the index of each element.

Now when we look at our browser we see this:

![Plot Points Image](/images/plot_points.png)

Now we can see our random data and randomize that data via user input. Awesome! But we're missing some way to read this data. What we need are axis. Let's create them now.

Let's open up `ScatterPlot.jsx` and add an `Axis` component

```javascript
// unfinished/src/components/scatter-plot.jsx

// ...

import Axis from './axis';

// ...

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
```

Let's create an Axis component. Go ahead and create `axis.jsx`

```javascript
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
```

Our strategy up to this point is letting React exclusively handle the DOM. This is a good general rule, but we need to leave room for nuance. Sometimes though we have to make compromises. In this case, the math and work we would have to do for rendering an axis is really complicated, and D3 has abstracted that pretty nicely, so we're going to let D3 have access to the DOM in this case. Also, since we're only going to render a maximum of 2 axis, the performance tradeoff is almost non-existant.

We're going to create a `g` element which we will hand over to D3 to do it's DOM manipulation. `transform` is an attribute of a `g`, which defines a list of transform definitions applied to an element and an element's children. We're passing in a `translate` attribute which will move the `g` element where we want it. SVG is similar to canvas in that x coordinates start at the top rather than at the bottom, so we have to account for this. Otherwise, our X-Axis would be right at the top of the chart. For the Y-Axis we want to leave some room for rendering the tickmark values.

`componentDidMount()` is a special React lifecycle method that is called immediately after the React component is mounted on the DOM. It is only called on the initial render. When this component is now rendered on the DOM, we're going to pass a real DOM node to D3 so it can do it's magic. By adding a "ref" attribute to the `g` element, we can refer to it later via `this.refs`. In addition, every time this component is re-rendered, we want D3 to re-draw the axis. That's where `componentDidUpdate()` comes in. It's called every time a component is re-rendered. You can learn more about lifecycle methods [here](https://facebook.github.io/react/docs/component-specs.html).

Now if we take a look at the browser again, we can see the axis, and when we randomize the data they update automatically to reflect the data changes.

![Complete Chart Image](/images/complete_chart.png)

## Conclusion

This was a short introduction to React and D3. If you want to learn more about React, take a look at [React Under the Hood](https://gumroad.com/l/react-under-the-hood). To learn more about using React with D3, take a look at [React + D3.js](http://swizec.com/reactd3js/).

## TODO

* Fix deprecated modules.

		npm WARN deprecated jade@0.26.3: Jade has been renamed to pug, please install the latest version of pug instead of jade
		npm WARN deprecated to-iso-string@0.0.2: to-iso-string has been deprecated, use @segment/to-iso-string instead.
		npm WARN deprecated minimatch@0.3.0: Please update to minimatch 3.0.2 or higher to avoid a RegExp DoS issue
		
* Fix npm test.
