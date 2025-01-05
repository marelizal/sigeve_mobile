import { Customer } from '@/models/customer';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface MapProps {
  clients: Customer[];
}

const Map: React.FC<MapProps> = ({ clients }) => {
  // Asegúrate de que clients sea un arreglo
  const safeClients = Array.isArray(clients) ? clients : [];


 
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -27.4544,  // Ajusta esto para que sea una región centrada más apropiadamente
          longitude: -58.9870, 
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {safeClients.map((client) => {
          // Asegúrate de que lat y lng sean válidos
          const latitude = client.lat && client.lat >= -90 && client.lat <= 90 ? client.lat : 0;
          const longitude = client.lng && client.lng >= -180 && client.lng <= 180 ? client.lng : 0;

          if (latitude === 0 || longitude === 0) {
            // console.warn(`Coordenadas inválidas para el cliente: ${client.name}`);
            return null;  // Si las coordenadas no son válidas, no mostramos el marcador
          }

          return (
            <Marker
              key={client.id}
              coordinate={{ latitude, longitude }}
              title={client.name}
              description={client.address}
              onPress={() => {
                console.log(`Marcador presionado: ${client.name}`);
              }}
            />
          );
        })}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default Map;
