import {createRoot} from "react-dom/client";
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import './index.scss';
import React from "react";

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
    <Provider store={store}>
      <App />
    </Provider>
);
