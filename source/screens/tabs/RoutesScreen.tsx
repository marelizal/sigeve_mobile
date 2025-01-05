import useFetchData from '@/hooks/useFetchData';
import React from 'react';
import { View, Text } from 'react-native';

const RoutesScreen = () => {
  useFetchData();
  return (
    <View>
      <Text>Alguien no puso planificaciones..</Text>
    </View>
  );
};

export default RoutesScreen;

