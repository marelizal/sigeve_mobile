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
import RoadmapDetailScreen from '@/screens/drawer/RoadmapDetailScreen';

const Drawer = createDrawerNavigator();

const MainNavigator = () => {
  const [isLocationTracking, setIsLocationTracking] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false); // Estado para controlar la visibilidad de "Ruta"
  
  const dispatch = useDispatch();

  useEffect(() => {
    const initLocationTracking = async () => {
      try {
        await startLocationTracking();
        setIsLocationTracking(true);
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

  const handleLogout = () => {
    console.log('Cerrando sesión...');
    dispatch({ type: 'auth/logout' });
  };

  const screenOptions = {
    headerStyle: { backgroundColor: Colors.background },
    headerTintColor: Colors.white,
    headerRight: () => (
      <Ionicons
        name="log-out"
        size={30}
        color={Colors.white}
        style={{ marginRight: 15 }}
        onPress={handleLogout}
      />
    ),
  };

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: { backgroundColor: Colors.background },
        drawerActiveTintColor: Colors.textSelection,
        drawerInactiveTintColor: '#ffffff',
        headerShown: true,
      }}
    >
      <Drawer.Screen
        name="Inicio"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
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
      
      {/* "Ruta" está oculta en el Drawer pero aún es accesible */}
      <Drawer.Screen
        name="Ruta"
        component={RoadmapDetailScreen}
        options={{
          ...screenOptions,
          drawerItemStyle: { display: 'none' }, 
        }}
      />
    </Drawer.Navigator>
  );
};

export default MainNavigator;
