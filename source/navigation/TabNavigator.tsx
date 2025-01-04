import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ClientsScreen from 'source/screens/tabs/ClientsScreen';
import ProductsScreen from 'source/screens/tabs/ProductsScreen';
import RoutesScreen from 'source/screens/tabs/RoutesScreen';
import CartScreen from 'source/screens/tabs/CartScreen';
import { Colors } from 'source/constants/Colors';
import Homescreen from 'source/screens/tabs/HomeScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Configuración de los iconos y colores de la barra de pestañas
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: 'home' |'people' | 'people-outline' | 'cube' | 'cube-outline' | 'map' | 'map-outline' | 'cart' | 'cart-outline' | undefined;

          // Configuración de los iconos según el nombre de la ruta
          switch (route.name) {
            case 'Clientes':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Productos':
              iconName = focused ? 'cube' : 'cube-outline';
              break;
            case 'Hoja de ruta':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'Carrito':
              iconName = focused ? 'cart' : 'cart-outline';
              break;
            default:
              iconName = 'home'; 
          }

          // Retorna el icono con el tamaño y color correcto
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // Colores de la barra de pestañas
        tabBarActiveTintColor: Colors.textSelection,  // Color del icono cuando está seleccionado
        tabBarInactiveTintColor: 'gray',   // Color del icono cuando no está seleccionado
        tabBarStyle: {
          backgroundColor: Colors.background,  // Color de fondo de la barra de pestañas
        },
      })}
    >
      {/* Definición de las pestañas con las pantallas correspondientes */}
      <Tab.Screen name="Inicio" component={Homescreen} options={{ headerShown: false }} />
      <Tab.Screen name="Clientes" component={ClientsScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Productos" component={ProductsScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Hoja de ruta" component={RoutesScreen} options={{ headerShown: false }} />
      {/* <Tab.Screen name="Carrito" component={CartScreen} options={{ headerShown: false }} /> */}
    </Tab.Navigator>
  );
};

export default TabNavigator;
