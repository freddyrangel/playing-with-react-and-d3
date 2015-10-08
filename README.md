# Playing With React and D3

This repo aims to give a broad overview of React and D3, and how to get them to play together despite their very different ways of looking at the world.

## What is React?

Anyone working in modern client-side JavaScript has most likely heard of React and perhaps have used it in their applications. React is an open-source JavaScript library for creating user interfaces that aims to address the problems of building large applications with data that changes over time. It was originally developed at Facebook and is now seen in many web applications including Instagram, Netflix, Airbnb, HelloSign, and many others.

## Why is React so popular?

React helps developers build applications by helping manage application state. It's simple, declarative, and composable. React is not a traditional MVC framework. React is really only interested in building user interfaces. Some have called it the "V" in MVC, but that's a little misleading. React sees the world much differently from traditional MVC frameworks. As more application logic started moving toward the client, many application developers wanted to apply some kind of structure to their front-end JavaScript. So we started applying a paradigm that we understood from the server (MVC) and apply it to the browser. The problem with this approach is that the browser environment is very different from the server. React acknowledges that client-side applications are really a collection of UI components that should react to events like user interaction.

React encourages building applications out of self-contained, reusable components that only care about a small piece of the UI. Many other frameworks attempt to do this such as Angular. React is different in that it enforces uni-directional data flow from parent component to child component. This makes debugging much easier. Most time spend working on applications is spent on debugging, so while React is more verbose that other libraries/frameworks, in the end it saves a lot of time. In a framework like Angular, if there's a bug it can be hard to figure out where it's coming from: is it in the view? The model? The controller? The directive? The directive controller? Data in Angular flows in many different directions, making it hard to reason about that state of your application. In React, when there is a bug, you can quickly determine where the bug originated from, since data only moves in one direction. If there is a bug, you just trace the direction of the data until you find the culprit.

## What is D3?

D3 (Data-Driven Documents) is a JavaScript library for producing dynamic, interactive data-visualizations. It is the standard for data visualizations, almost like a jQuery for data visualization. It's fairly low level, giving the developer a lot of control over then end result. It takes a bit of work to get it to do what you want, so if you're looking for a more prepackaged solution you're probably better off with highcharts.js. That said, after you work with it for a while it starts to become pretty intuitive and it's flexibility becomes a joy.

D3 essentially does 4 things: Load data, bind data elements to the DOM via JavaScript and SVG, transforms those elements by interpreting data and setting it's visual properties, and transitions elements in response to user input.

## Why Would We Want To Use React with D3?

D3 is great at data visualizations, but it manipulates the DOM directly to display that data. Rendering DOM elements is where React shines. It uses a virtual representation of the DOM (virtual DOM) and uses a super performant diffing algorithm to determine the fastest way to update the DOM. 

Also, once we create a chart component, we can reuse that chart with different data anywhere in our app.

## How use React and D3?

D3, like React, is declarative. Unlike React, D3 used data binding, while React uses a uni-directional data flow paradigm. Getting them to work together takes a bit of work but the strategy is fairly simple: since SVG lives in the DOM, let React handle displaying SVG representations of the data, while letting D3 handle all the math required to render the data.

We're going to go through a simple example of generating a random list of X-Y coordinates and displaying them on a ScatterPlot chart. A finished example is provided for you under the "finished" directory but you can follow along under "unfinished". I've gone through the trouble of doing all the setup for you. The build will automatically be created from "unfinished/app/index.jsx"

Let's start by creating a simple "Hello World!" React component. Create a file under "components" names "App.jsx"

```
var React = require('react');

var App = React.createClass({
  render: function() {
    return <h1>Hello, world!</h1>
  }
});

module.exports = App;

```

There are a couple of things that need to be pointed out. First, we're calling `createClass` on react and passing it an object. There are several methods you can pass to React that it knows what to do with but the heart of a React component is the `render` function. `render` Tell React how the component should look like once it's rendered. If you're coming from Angular or Ember this might look weird, the fact that we're putting HTML directly into our JS code. This goes against everything we've learned about unobtrusive JavaScript. That way of thinking makes sense in other contexts, but let's not get too dogmatic about it. Everything is different in React, and for good reason. React sees HTML and client-side JavaScript as fundamentally bonded together. They're both concerned about one thing: rendering UI components to the user. They simply cannot be seperated without losing the ability to see what your component is going at a glance. The beauty of this approach is that you can describe exactly what your component will look like when it's rendered.

Also keep in mind that this is only possible with JSX, which will translate HTML elements into React functions that will render the HTML to the page.

Now let's move on and mount our component to the DOM. Open up "index.jsx"

```
var React = require('react');
var App   = require('./components/App');
var css   = require('./main.css')

var appNode = document.createElement('div');
appNode.className = 'react-app';
document.body.appendChild(appNode);
React.render(<App />, appNode);
```

You may have noticed a few things. You might be wondering why we're requiring a CSS file. We're using Webpack, which allows us to require CSS files. We're also creating a div in which we want to mount our React app. That's just a good practice just in case you want to do other things on the page other than render a React component. Lastly, we're calling `render` on React with 2 arguments, the name of the component and the DOM element we want to mount it on. 

Now let's install all the dependencies by navigating to the `unfinished` directory and running `npm i`. Then fire up the server with `npm start` and go to `localhost:4000`

![Basic Render Image](/images/basic_render.png)


Awesome, we have rendered our first React component! Let's do something a little less trivial now. First let's create some dummy data with which to work with. Let's open up our `App` component and add the following:

```
var React       = require('react');
var d3          = require('d3');

var App = React.createClass({

  ... 
  
  componentWillMount: function() {
    this.randomizeData();
  },

  randomizeData: function() {
    var randomData = [];
    d3.range(settings.numDataPoints).forEach(function() {
      var newNumber1 = Math.floor(Math.random() * settings.maxRange());
      var newNumber2 = Math.floor(Math.random() * settings.maxRange());
      randomData.push([newNumber1, newNumber2]);
    });
    this.setState({data: randomData});
  }
});

var settings = {
  width: 500,
  height: 300,
  padding: 30,
  numDataPoints: 50,
  maxRange: function() {
    return Math.random() * 1000
  }
};

module.exports = App;
```

`componentWillMount` is another React lifecycle function which will be called before the initial rendering of the component occurs. Inside of `componentWillMount` we're creating 50 random X-Y coordinates within a certain random range using D3's `range` method, which provides an array of values from 0 up to but excluding the value provided. So in this case, `d3.range(settings.numDataPoints)` will return an array `[0 ... 49]`. We could use a for-loop here, but d3's range method works very nicely here.

Let's talk about `this.setState`. If `render` is the heard of a React component, `setState` is the brains of a component. `setState` explicitly tells React that we're changing some kind of state, triggering a rerender of the component and it's children. This essentially turns out UI components into state machines.  

Inside of `setState`, we're passing an object with `data` set to the `randomData` we just generated. This means that if we want to retrieve the state of out application, we only have to call `this.state.whateverStateWereLookingFor`. In this case, we can retrieve the randomData by calling `this.state.data`

Now let's update our `render` function to render other components which will create our scatter plot.

```

...


var ScatterPlot = require('./ScatterPlot.jsx');

var App = React.createClass({
  render: function() {
    return (
      <div>
        <h1>React and D3 are Friends</h1>
        <ScatterPlot data={this.state.data} {...settings} />
        <div className="controls">
          <button className={'btn randomize'} onClick={this.randomizeData}>Randomize Data</button>
        </div>
      </div>
    );
  },

  ...
  
  }
});

```

A little side note about how React works: React offers great performance for rendering UI components by implementing a diffing algorithm, comparing a virtual DOM in memory, and the actual DOM. In order for it to work, each component can only render one parent element (meaning that you cannot render sibling elements). That's why In the render function we're wrapping all our elements in one parent div.

We're referring to a ScatterPlot component which we will create in a moment. We're passing in our `data` which lives in the `App` component's state to the ScatterPlot as a property or `prop`, along with the settings object. `...settings` is a convenient JSX and ES2015 spread operator that spread attributes of an array or object, instead of doing all of that explicitly. For more information check out: [JSX Spread Attributes](https://facebook.github.io/react/docs/jsx-spread.html).

Then, we're creating a button that when clicked will call `randomizeData` which will create new random data and trigger a state change, which in turn will trigger a whole rerender of the app.

Let's get started with the ScatterPlot component. Create a file `unfinished/app/components/ScatterPlot.jsx` :

```
var React       = require('react');
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

```

There's a lot going on here so let's start with the `render` function. D3 uses SVG to render data visualizations. D3 has special methods for creating SVG elements and binding data to those elements. However, we're going to let React handle that. We're creating an SVG element with the properties passed in by the `App` component, which can be accessed via `this.props`. Then we're creating a DataCircles component (which we're going to create in a minute) which will render the points on the scatter plot.

Let's talk about D3 scales. This is where D3 shines. Scales take care of doing all the messy math converting your data into a format that can be displayed on a chart. If you have a data point value 189281 but your chart is only 200 pixels wide, D3 scales will convert that number to a number you can use to plot that point.

`d3.scale.linear()` returns a linear scale. D3 also supports other types of scales: ordinal, logarithmic, square root, etc.. We won't be talking about those here. `domain` is short for an "input domain", meaning the range of possible input values. It takes an array of the smallest input value possible and the maximum input value. `range` is the "output range" which is the range of possible output values. So in `domain`, we're setting the range of possible data values from our random data, and in `range` we're telling D3 the range of our chart. `d3.max` is a d3 method for determining the maximum value of a dataset. It can take a callback which we're using to have D3 only give the max values of the X and Y coordinates.

We're creating the scales for X and Y coordinates here so we can pass it in to other components such as an X and Y axis. 

As a side note, the plural of axis is axis, so when we get to X and Y axis it might get a little confusing whether I'm referring to one or two axis. 

Let's create the DataCircles component under `unfinished/app/components/DataCircles.jsx`

```
var React = require('react');
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
```

In this component, we're rendering a `g` element, which is like the SVG equivalent to a `div`. Since we want to render a point for every set of X-Y coordinates, we're going to render multiple sibling elements, so we're wrapping it all in a `g` element for React to work. Inside of `g`, we're mapping over the data and rendering a circle for each one using `renderCircles`. `renderCircles` creates an SVG `circle` element which takes a number of properties. Here's we're setting the x and y coordinates (`cx` and `cy` respectively) with the D3 scales passed in from the ScatterPlot component. `r` is the radius of our circle, and key is something React requires us to do. Since we're rendering identical sibling components, React's diffing algorithm needs some kind of way to keep track of them as it updates the DOM over and over. I'm using `node-uuid` because it's an easy way to create a unique key for each element. You can use anything you like, as long as it's unique.

Now when we look at our browser we see this: 

![Plot Points Image](/images/plot_points.png)

Now we can see our random data and randomize that data via user input. Awesome! But we're missing some way to read this data. What we need are axis. Let's create them now.

Let's open up `ScatterPlot.jsx` and add an `XYAxis` component

```

...

var XYAxis      = require('./XYAxis');

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

  ...
  
});

module.exports = ScatterPlot;
```

Now let's create the `XYAxis` component

```
var React = require('react');
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
```

For simplicity's sake, we're creating two objects which will hold the props for each of our X-Y Axis. Let's create an Axis component to explain what these props do. Go ahead and create `Axis.jsx`

```
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
```

Our strategy up to this point is letting React exclusively handle the DOM. This is a good general rule, but we need to leave room for nuance. Sometimes thought we have to make compromises. In this case, the math and work we would have to do for rendering an axis is really complicated, and D3 has abstracted that pretty nicely, so we're going to get D3 have access to the DOM in this case. Also, since we're only going to render a maximum of 2 axis, the performance tradeoff is almost non-existant. 

We're going to create a `g` element which we will hand over to D3 to do it's DOM manipulation. `transform` is an attribute of a `g`, which defines a list of transform definitions applied to an element and an element's children. We're passing in a `translate` attribute which will move the `g` element where we want it. SVG is similar to canvas in that x coordinates start at the top rather than at the bottom, so we have to account for this. Otherwise, our X-Axis would be right at the top of the chart. For the Y-Axis we want to leave some room for rendering the tickmark values.

Now if we take a look at the browser again, we can see the axis, and when we randomize the data they update automatically to reflect the data changes.

![Complete Chart Image](/images/complete_chart.png)


## Conclusion
This is short introduction to React and D3. I encourage you to go through Facebook's React introduction and read a few books on D3, or you can ask me a question on twitter: [@frangel85](https://twitter.com/frangel85)
