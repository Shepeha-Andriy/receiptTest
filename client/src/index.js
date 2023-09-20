import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store'

const BuildTest = 1111
const BuildTest3 = 1111
const BuildTest4 = 1111
const BuildTest2 = BuildTest
console.log(BuildTest2)
console.log(BuildTest3)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
      <App />
  </Provider>
);
