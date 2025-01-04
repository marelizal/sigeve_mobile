import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Alert } from 'react-native';
import TabNavigator from './TabNavigator';
import SettingsScreen from '../screens/drawer/SettingsScreen';
import ReceiptsScreen from '../screens/drawer/ReceiptsScreen';
import ProfileScreen from '../screens/drawer/ProfileScreen';
import { startLocationTracking, stopLocationTracking } from '../services/LocationService';

import useGreeting from 'source/hooks/useGreeting';
import { Colors } from 'source/constants/Colors';

const Drawer = createDrawerNavigator();

const MainNavigator = () => {
  const [isLocationTracking, setIsLocationTracking] = useState(false);
  const greeting = useGreeting();

  useEffect(() => {
    const initLocationTracking = async () => {
      try {
        await startLocationTracking();
        setIsLocationTracking(true);
        console.log('El seguimiento de ubicación se inició correctamente.');
      } catch (error) {
        console.error('No se pudo iniciar el seguimiento de ubicación:', error);
        Alert.alert(
          'Error de seguimiento de ubicación',
          'No se pudo iniciar el seguimiento de ubicación. Verifique sus permisos y vuelva a intentarlo.',
          [{ text: 'OK' }]
        );
      }
    };

    initLocationTracking();

    return () => {
      if (isLocationTracking) {
        stopLocationTracking().catch(console.error);
      }
    };
  }, []);

  const screenOptions = {
    headerStyle: { backgroundColor: Colors.background },
    headerTintColor: Colors.white,
  };

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: { backgroundColor: Colors.background },
        drawerActiveTintColor: Colors.textSelection,
        drawerInactiveTintColor: '#ffffff',
      }}
    >
      <Drawer.Screen name="Inicio" component={TabNavigator} options={{ ...screenOptions }} />
      <Drawer.Screen name="Tu actividad" component={ReceiptsScreen} options={screenOptions} />
      <Drawer.Screen name="Configuraciones" component={SettingsScreen} options={screenOptions} />
    </Drawer.Navigator>
  );
};

export default MainNavigator;
