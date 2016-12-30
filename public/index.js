import React from 'react';
import ReactDOM from 'react-dom';
import App from '../components/App'
import 'normalize-scss';
import '../scss/main.scss';

const rootElement = document.getElementById('app');
ReactDOM.render(<App />, rootElement);