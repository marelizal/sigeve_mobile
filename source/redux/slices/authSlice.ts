import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from "jwt-decode";
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { User } from 'source/models/user';
import { apiFetchToken } from 'source/services/auth.service';

export type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null; // Almacenar el token en Redux
  loading: boolean;
  error: string | null; // Estado de manejo de errores
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null, // Inicializa el token como null
  loading: false,
  error: null, // Inicializa el estado de error
};

// Acción para obtener el token y los datos del usuario
export const fetchToken = createAsyncThunk<
  { access_token: string; user: User }, // Forma esperada de la respuesta
  { email: string; password: string }, // Payload (correo y contraseña)
  { rejectValue: string } // Tipo para manejo de errores
>(
  'auth/fetchToken',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiFetchToken(email, password);
      return response; // Devuelve el token y los datos del usuario
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

// Redux slice
const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      AsyncStorage.removeItem('token'); // Elimina el token de AsyncStorage al cerrar sesión
    },
    setAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload; // Establece el estado de autenticación
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload; // Establece los datos del usuario
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchToken.pending, (state) => {
        state.loading = true;
        state.error = null; // Reinicia el error
      })
      .addCase(fetchToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true; // Establece el estado como autenticado

        // Decodifica el token JWT para extraer los datos del usuario
        const decodedToken = jwtDecode(action.payload.access_token) as { sub: string; email: string; name: string };

        console.log({ id: decodedToken.sub, email: decodedToken.email, name: decodedToken.name });

        // Establece los datos del usuario a partir del token decodificado
        state.user = {
          id: decodedToken.sub,
          email: decodedToken.email,
          name: decodedToken.name,
          token: action.payload.access_token,
        };
        state.token = action.payload.access_token; // Establece el token en el estado de Redux

        // Almacena el token en AsyncStorage para persistencia
        AsyncStorage.setItem('token', action.payload.access_token);
      })
      .addCase(fetchToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Establece el error en caso de fallo
      });
  },
});

export const { setAuthenticated, setUser, logout } = slice.actions;

export default slice.reducer;
