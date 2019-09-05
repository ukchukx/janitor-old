import React from 'react';
import ReactDOM from 'react-dom';
import SchedulePage from './SchedulePage';

const App = () => (<SchedulePage />);

const wrapper = document.getElementById('app');

if (wrapper) ReactDOM.render(<App />, wrapper);
