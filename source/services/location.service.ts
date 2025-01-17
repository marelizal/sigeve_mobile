import * as Location from 'expo-location';
import * as Network from 'expo-network';
import * as TaskManager from 'expo-task-manager';
import * as Battery from 'expo-battery';  // Para obtener el nivel de batería
import * as Application from 'expo-application';
import { OsmAnd } from '@/models/osmand';

const LOCATION_TASK_NAME = 'background-location-task';

// Función para obtener el deviceId del dispositivo
const getDeviceId = async (): Promise<string> => {
  const androidId = await Application.getAndroidId();
  return androidId || 'default-device-id';  // Usamos un valor por defecto si no se obtiene el ID
}

// Función para obtener el nivel de batería y el estado de carga
const getBatteryInfo = async () => {
  const batteryLevel = await Battery.getBatteryLevelAsync();
  const chargeStatus = await Battery.getBatteryStateAsync();

  return {
    batt: Math.floor(batteryLevel * 100),  // Convertimos el nivel de batería en porcentaje
    charge: chargeStatus === Battery.BatteryState.CHARGING,  // Verificamos si el dispositivo está cargando
  };
}

// Función para enviar la ubicación a la API de OsmAnd usando fetch
const sendLocationToBackend = async (location: Location.LocationObject): Promise<void> => {
  const deviceId = await getDeviceId(); // Obtenemos el ID del dispositivo
  const driverUniqueId = 'DRIVER123'; // Este valor debe ser dinámico dependiendo del conductor
  const timestamp = new Date().toISOString(); // Usamos la fecha actual como timestamp

  // Obtenemos el nivel de batería y el estado de carga
  const { batt, charge } = await getBatteryInfo();

  // Crear los parámetros conforme a la interfaz OsmAnd
  const params: OsmAnd = {
    deviceId: deviceId,  // ID del dispositivo
    lat: location.coords.latitude,
    lon: location.coords.longitude,
    timestamp: timestamp,  // Usamos el timestamp actual
    speed: location.coords.speed ?? 0,  // Usamos 0 si no hay valor de velocidad
    bearing: location.coords.heading ?? 0,  // Usamos 0 si no hay valor de dirección
    altitude: location.coords.altitude ?? 0,  // Usamos 0 si no hay valor de altitud
    accuracy: location.coords.accuracy ?? 0,  // Usamos 0 si no hay precisión
    hdop: 1.0,  //  calcular esto en función de la precisión, pero aquí lo dejamos en 1.0 por defecto
    batt,
    charge: charge ? true : false,  // Estado de carga como 'charging' o 'not charging'
    driverUniqueId,
    valid: false,  // Establecemos 'false' como valor predeterminado
    id: deviceId,  // El ID del dispositivo es igual a deviceId
  };

  const apiUrl = 'http://demo4.traccar.org:5055';

  // Construir la URL con los parámetros
  const queryParams = new URLSearchParams(params as any).toString();
  const fullUrl = `${apiUrl}?${queryParams}`;

  console.log('---- URL completa:', fullUrl);

  try {
    // Enviar la ubicación a la API de OsmAnd usando fetch
    const response = await fetch(fullUrl);
    
    if (!response.ok) {
      throw new Error(`Error al enviar la ubicación. Código de estado: ${response.status}`);
    }

    console.log('---- Ubicación enviada correctamente');
  } catch (error) {
    console.error('Error al enviar la ubicación:', error);

    // Si no hay conexión, guardar la URL de la petición en localStorage
    const isOnline = await Network.getNetworkStateAsync();
    if (!isOnline.isConnected) {
      const storedUrls = JSON.parse(localStorage.getItem('requestUrls') || '[]');
      storedUrls.push(fullUrl);  // Guardar la URL de la petición fallida
      localStorage.setItem('requestUrls', JSON.stringify(storedUrls));  // Guardar en localStorage
    }
  }
};

// Función para enviar las URLs almacenadas en localStorage cuando haya conexión
const sendStoredRequests = async () => {
  const isOnline = await Network.getNetworkStateAsync();
  if (isOnline.isConnected) {
    const storedUrls = JSON.parse(localStorage.getItem('requestUrls') || '[]');
    if (storedUrls.length > 0) {
      for (const url of storedUrls) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            console.log(`---- Petición exitosa para URL: ${url}`);
          } else {
            console.error(`---- Error al enviar la URL: ${url}`);
          }
        } catch (error) {
          console.error('Error al ejecutar la URL almacenada:', error);
        }
      }
      // Borrar las URLs almacenadas después de ejecutarlas
      localStorage.removeItem('requestUrls');
    }
  }
};

// Detectar cuando se vuelve a tener conexión
Network.addNetworkStateListener(({ isConnected }) => {
  if (isConnected) {
    sendStoredRequests();  // Intentamos enviar las URLs almacenadas
  }
});

export const startLocationTracking = async () => {
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus !== 'granted') {
    console.log('---- Permiso de ubicación en primer plano no otorgado');
    return;
  }

  const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
  if (backgroundStatus !== 'granted') {
    console.log('---- Permiso de ubicación en segundo plano no otorgado');
    return;
  }

  const isTaskDefined = TaskManager.isTaskDefined(LOCATION_TASK_NAME);
  if (!isTaskDefined) {
    console.log('---- La tarea no está definida, definiéndola ahora.');
    TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
      if (error) {
        console.error('---- Error en la tarea de ubicación en segundo plano:', error);
        return;
      }
      if (data) {
        const { locations } = data as { locations: Location.LocationObject[] };
        const location = locations[0];
        if (location) {
          // Enviar ubicación a la API de OsmAnd
          await sendLocationToBackend(location);
        }
      }
    });
  }

  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.Balanced,
    timeInterval: 5000,
    distanceInterval: 10,
    foregroundService: {
      notificationTitle: "Ubicación en segundo plano",
      notificationBody: "Esta app está rastreando tu ubicación en segundo plano.",
      notificationColor: "#fff",
    }
  });

  console.log('---- Inicio del rastreo de ubicación');
};

export const stopLocationTracking = async () => {
  await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  console.log('---- Rastreo de ubicación detenido');
};
