import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native'; // Importamos el hook de navegación y DrawerActions
import ClientsScreen from 'source/screens/tabs/ClientsScreen';
import ProductsScreen from 'source/screens/tabs/ProductsScreen';
import RoutesScreen from 'source/screens/tabs/RoutesScreen';
import CartScreen from 'source/screens/tabs/CartScreen';
import { Colors } from 'source/constants/Colors';
import { useDispatch } from 'react-redux';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const navigation = useNavigation(); // Usamos el hook para obtener la navegación
  const dispatch = useDispatch()

  // Función que maneja el cierre de sesión 
  const handleLogout = () => {
    // Lógica para cerrar sesión
    console.log('Cerrando sesión...');
    dispatch({ type: 'auth/logout' });
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Configuración de los iconos y colores de la barra de pestañas
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: 'home' | 'people' | 'people-outline' | 'cube' | 'cube-outline' | 'map' | 'map-outline' | 'cart' | 'cart-outline' | undefined;

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
        // Configuración del header
        headerStyle: {
          backgroundColor: Colors.background,  // Fondo del header
        },
        headerTintColor: Colors.white,  // Color del texto del header
        headerLeft: () => (
          <Ionicons
            name="menu" // Icono de "hamburger" para abrir el drawer
            size={30}
            color={Colors.white} // Color del ícono
            style={{ marginLeft: 15 }}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())} // Abre el drawer cuando se toca
          />
        ),
        headerRight: () => (
          <Ionicons
            name="log-out" // Icono para cerrar sesión
            size={30}
            color={Colors.white} // Color del ícono
            style={{ marginRight: 15 }} // Margen a la derecha
            onPress={handleLogout} // Llama a la función de cerrar sesión
          />
        ),
      })}
    >
      {/* Definición de las pestañas con las pantallas correspondientes */}
      <Tab.Screen name="Hoja de ruta" component={RoutesScreen} options={{ headerShown: true }} />
      <Tab.Screen name="Clientes" component={ClientsScreen} options={{ headerShown: true }} />
      <Tab.Screen name="Productos" component={ProductsScreen} options={{ headerShown: true }} />
      {/* <Tab.Screen name="Carrito" component={CartScreen} options={{ headerShown: true }} /> */}
    </Tab.Navigator>
  );
};

export default TabNavigator;
