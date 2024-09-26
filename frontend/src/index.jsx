import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import App from './components/App';
import { Provider } from 'react-redux';
import store from './services/index.js';
import './i18next.js'
import { ErrorBoundary } from '@rollbar/react';

const rollbarConfig = {
  accessToken: 'd8298ae5f8e948888c1601ffb59e7b5b',
  environment: 'testenv',
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <ErrorBoundary config={rollbarConfig}>
      <App />
    </ErrorBoundary>
  </Provider>
);
