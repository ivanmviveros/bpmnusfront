import React from 'react';
import ReactDOM from 'react-dom';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { SnackbarProvider } from 'notistack';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <SnackbarProvider 
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    classes={{
      variantSuccess: { backgroundColor: 'green' },
      variantError: { backgroundColor: 'red' },
    }}
  >
    <React.StrictMode>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Provider store={store}>
          <App />
        </Provider>
      </LocalizationProvider>
    </React.StrictMode>
  </SnackbarProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
