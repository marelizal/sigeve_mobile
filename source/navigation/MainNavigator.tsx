import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TabNavigator from './TabNavigator';
import SettingsScreen from '../screens/drawer/SettingsScreen';
import ReceiptsScreen from '../screens/drawer/ReceiptsScreen';
import { startLocationTracking, stopLocationTracking } from '../services/location.service';

import { Colors } from 'source/constants/Colors';
import { useDispatch } from 'react-redux';
import StockScreen from '@/screens/drawer/StockScreen';
import useFetchData from '@/hooks/useFetchData';

const Drawer = createDrawerNavigator();

const MainNavigator = () => {
  const [isLocationTracking, setIsLocationTracking] = useState(false);

  const dispatch = useDispatch()

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

  // Función que maneja el cierre de sesión 
  const handleLogout = () => {
    // Lógica para cerrar sesión
    console.log('Cerrando sesión...');
    dispatch({ type: 'auth/logout' });
  };

  const screenOptions = {
    headerStyle: { backgroundColor: Colors.background },
    headerTintColor: Colors.white,
    headerRight: () => (
      <Ionicons
        name="log-out" // Icono para cerrar sesión
        size={30}
        color={Colors.white} // Color del ícono
        style={{ marginRight: 15 }} // Margen a la derecha
        onPress={handleLogout} // Llama a la función de cerrar sesión
      />
    ),
  };

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: { backgroundColor: Colors.background },
        drawerActiveTintColor: Colors.textSelection,
        drawerInactiveTintColor: '#ffffff',
        headerShown: true, // Este es el valor predeterminado para el resto de las pantallas
      }}
    >
      {/* Pantalla de Inicio sin encabezado */}
      <Drawer.Screen
        name="Inicio"
        component={TabNavigator}
        options={{ headerShown: false }} // Deshabilitar el encabezado para "Inicio"
      />
      {/* Otras pantallas con encabezado y el ícono de "Cerrar sesión" */}
      <Drawer.Screen
        name="Tu actividad"
        component={ReceiptsScreen}
        options={screenOptions}
      />
      <Drawer.Screen
        name="Stock"
        component={StockScreen}
        options={screenOptions}
      />
      <Drawer.Screen
        name="Configuraciones"
        component={SettingsScreen}
        options={screenOptions}
      />
    </Drawer.Navigator>
  );
};

export default MainNavigator;
