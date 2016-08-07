import React from 'react';
import ReactDOM from 'react-dom';

import { Router, Route } from 'react-router'
import { browserHistory } from 'react-router';

/*
 Import Components
 */

import NotFound from './components/NotFound';
import StorePicker from './components/StorePicker';
import App from './components/App';

/*
 Routes
 */

var routes = (
  <Router history={browserHistory}>
    <Route path="/" component={StorePicker} />
    <Route path="/store/:storeId" component={App} />
    <Route path="*" component={NotFound} />
  </Router>
);

ReactDOM.render(routes, document.querySelector('#main'));