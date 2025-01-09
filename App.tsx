import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { persistor, store } from 'source/redux/store';
import RootNavigator from 'source/navigation/RootNavigator';

import * as Sentry from '@sentry/react-native';

export default function App() {


// Inicializar Sentry con tu DSN
Sentry.init({
  dsn: 'https://659278441380b207d45d0cbcab3764db@o4508609672052736.ingest.de.sentry.io/4508609674018896',
  debug: true, 
});
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

