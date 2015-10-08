var css   = require('./main.css');
var React = require('react');
var App   = require('./components/App.jsx');

var appNode = document.createElement('div');
appNode.className = 'react-app';
document.body.appendChild(appNode);
React.render(<App />, appNode);

