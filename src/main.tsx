import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found in document.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={
          <p style={{ padding: '2rem', textAlign: 'center' }}>
            Đang khôi phục dữ liệu từ bộ nhớ đệm...
          </p>
        }
        persistor={persistor}
      >
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
