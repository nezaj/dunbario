/* Entry point for our create-react-app (webpack) server */

import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import { App } from './client/components';

ReactDOM.render(<App />, document.getElementById('root'));
