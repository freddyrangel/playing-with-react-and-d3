var React       = require('react');
var ScatterPlot = require('./Table.jsx');
var d3          = require('d3');

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
