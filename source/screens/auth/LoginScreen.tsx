import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ImageBackground,Image } from 'react-native';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { fetchToken } from '../../redux/slices/authSlice'; 
import backgroundImage from '@/assets/background.png';
import logoImage from '@/assets/logo.png';
import { Colors } from '@/constants/Colors';

const LoginScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [username, setUsername] = useState('demo@veza.com.ar');
  const [password, setPassword] = useState('admin');
  const [loading, setLoading] = useState(false); // Para manejar el estado de carga
  const [error, setError] = useState<string | null>(null); // Para manejar errores

  const handleLogin = async () => {
    if (username && password) {
      setLoading(true);
      try {
        const resultAction = await dispatch(fetchToken({ email: username, password }));
        if (fetchToken.fulfilled.match(resultAction)) {
          // Handle successful login
        } else {
          setLoading(false);
         setError(resultAction.error.message || 'Hubo un error al iniciar sesión');
        }
        await dispatch(fetchToken({ email: username, password })).unwrap();
      } catch (error: any) {
        setLoading(false);
       setError(error.message || 'Hubo un error al iniciar sesión');
      }
    } else {
      setError('Por favor, ingrese su nombre de usuario y contraseña');
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <Image source={logoImage} style={styles.logo} />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre de usuario"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
          <Button
            title={loading ? "Cargando..." : "Acceder"}
            onPress={handleLogin}
            disabled={loading}
            color={Colors.textSelection}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    height: 82,
    width: 256,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  inputContainer: {
    width: '80%',
    marginVertical: 20,
  },
  input: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: '#000',
    backgroundColor: 'white',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    marginBottom: 10
  },
});


