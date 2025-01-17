import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import * as Application from 'expo-application';
import { Colors } from '@/constants/Colors';

const SettingsScreen = () => {
  const [deviceId, setDeviceId] = useState('');
  const [fcmToken, setFcmToken] = useState('');
  const [serverUrl, setServerUrl] = useState('http://demo4.traccar.org:5055');

  function handleUrlChange(text: string): void {
    throw new Error('Function not implemented.');
  }

  useEffect(() => {
    const fetchDeviceId = async () => {
      const id = await getDeviceId();
      setDeviceId(id);
    };
    fetchDeviceId();
  }, []);

// Función para obtener el deviceId del dispositivo
const getDeviceId = async (): Promise<string> => {
  const androidId = await Application.getAndroidId();
  return androidId || 'default-device-id';  // Usamos un valor por defecto si no se obtiene el ID
}



  // const handleUrlChange = async (url) => {
  //   setServerUrl(url);
  //   try {
  //     await AsyncStorage.setItem('serverUrl', url);
  //   } catch (error) {
  //     console.error('Error saving server URL:', error);
  //   }
  // };

  return (    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>URL de seguimiento</Text>
        <TextInput
          style={styles.input}
          value={serverUrl}
          onChangeText={handleUrlChange}
          placeholder="http://demo4.traccar.org:5055"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>ID de seguimiento</Text>
        <Text style={styles.value}>{ deviceId || 'Loading...'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>FCM Token</Text>
        <Text style={styles.value} numberOfLines={2}>{fcmToken || 'Ocurrio un error generando el token FCM'}</Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'white',
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  value: {
    fontSize: 14,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    color:Colors.textSelection
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    
  },
});

export default SettingsScreen;