// import 'main.css';
import 'materialize-css/dist/css/materialize.css';

import 'materialize-css/dist/js/materialize.js'
import App from 'App';
import React from 'react';
import ReactDOM from 'react-dom';

import alt from './lib/alt';
import persist from './lib/persist';
import storage from './lib/storage';


persist(alt, storage, 'app');


ReactDOM.render(<App />, document.getElementById('app'));