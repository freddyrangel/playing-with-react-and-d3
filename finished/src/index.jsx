import './main.css';
import React         from 'react';
import ReactDOM      from 'react-dom';
import { Provider }  from 'react-redux';
import { makeStore } from './lib/store';
import Chart         from './components/chart.jsx';

const store = makeStore();
const app = <Provider store={store}>
  <Chart />
</Provider>

const mountingPoint = document.createElement('div');
mountingPoint.className = 'react-app';
document.body.appendChild(mountingPoint);

ReactDOM.render(app, mountingPoint);
