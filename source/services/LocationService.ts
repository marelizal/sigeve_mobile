import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Battery from 'expo-battery';  // Para obtener el nivel de batería
import axios from 'axios';
import * as Application from 'expo-application';

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

// Función para enviar la ubicación a la API de OsmAnd
const sendLocationToBackend = async (location: Location.LocationObject): Promise<void> => {
  const deviceId = await getDeviceId(); // Obtenemos el ID del dispositivo
  const driverUniqueId = 'DRIVER123'; // Este valor debe ser dinámico dependiendo del conductor
  const timestamp = new Date().toISOString(); // Usamos la fecha actual como timestamp

  // Obtenemos el nivel de batería y el estado de carga
  const { batt, charge } = await getBatteryInfo();

  // Crear los parámetros conforme a la interfaz OsmAnd
  const params = {
    deviceId: "4bfa8ac2e615ffe7",  // ID del dispositivo
    lat: location.coords.latitude,
    lon: location.coords.longitude,
    timestamp,
    speed: location.coords.speed ?? 0,  // Usamos 0 si no hay valor de velocidad
    bearing: location.coords.heading ?? 0,  // Usamos 0 si no hay valor de dirección
    altitude: location.coords.altitude ?? 0,  // Usamos 0 si no hay valor de altitud
    accuracy: location.coords.accuracy ?? 0,  // Usamos 0 si no hay precisión
    hdop: 1.0,  //  calcular esto en función de la precisión, pero aquí lo dejamos en 1.0 por defecto
    batt,
    charge: charge ? 'charging' : 'not charging',  // Estado de carga como 'charging' o 'not charging'
    driverUniqueId,
    valid: false,  // Establecemos 'false' como valor predeterminado
    id: "4bfa8ac2e615ffe7",  // El ID del dispositivo es igual a deviceId
  };

  const apiUrl = 'http://demo4.traccar.org:5055';

  // Construir la URL con los parámetros
  const queryParams = new URLSearchParams(params as any).toString();
  const fullUrl = `${apiUrl}?${queryParams}`;

  // Imprimir la URL final con los parámetros
  console.log('---- Enviando ubicación al backend con la URL:');
  console.log(fullUrl);
  console.log('----');

  try {
    // Enviar la ubicación a la API de OsmAnd usando axios
    await axios.get(fullUrl);
    console.log('---- Ubicación enviada correctamente a OsmAnd');
  } catch (error) {
    console.error('---- Error al enviar la ubicación a OsmAnd:', error);
  }
};

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
          console.log('---- Ubicación en segundo plano:', location.coords);
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
