import axios from 'axios';

// Primero, defino la URL base de la API con la que voy a trabajar.
const baseURL = process.env.APIAURL || 'https://api-2ro3.onrender.com/api/v1';

// Luego, creo una instancia de Axios con algunas configuraciones básicas.
export const axiosInstance = axios.create({
    baseURL, // Asigno la URL base que definí anteriormente.
    timeout: 100000, // Establezco un tiempo de espera de 10 segundos para las solicitudes.
    headers: {
        'Content-Type': 'application/json', // Indico que el contenido que enviaré es en formato JSON.
        // Aquí puedo agregar otros encabezados predeterminados si los necesito.
    }
});

// A continuación, configuro un interceptor para manejar las respuestas y errores de las solicitudes.
axiosInstance.interceptors.response.use(
    response => {
        // Aquí manejo la respuesta exitosa, retornando solo los datos.
        return response.data; // Puedo hacer cualquier transformación que necesite en esta respuesta.
    },
    error => {
        // Si ocurre un error, lo manejo aquí.
        const status = error.response ? error.response.status : null; // Obtengo el código de estado si está disponible.
        // Aquí puedo agregar lógica para manejar diferentes códigos de estado según lo que necesite.
        console.error('Error en la respuesta:', error); // Imprimo el error en la consola para depurar.
        return Promise.reject(error); // Rechazo la promesa para que el error sea manejado donde se hizo la llamada.
    }
);

// Finalmente, configuro un interceptor para agregar lógica antes de enviar la solicitud.
axiosInstance.interceptors.request.use(
    config => {
        // Aquí puedo agregar lógica antes de que la solicitud se envíe, como un token de autenticación.
        // const token = getToken(); // Supongo que tengo una función para obtener el token.
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`; // Agrego el token a los encabezados si está presente.
        // }
        return config; // Retorno la configuración de la solicitud para que se envíe.
    },
    error => {
        // Si ocurre un error al configurar la solicitud, lo manejo aquí.
        return Promise.reject(error); // Rechazo la promesa para que el error pueda ser tratado adecuadamente.
    }
);
