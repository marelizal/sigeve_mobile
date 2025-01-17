import { Order } from "@/models/order";
import axios from "axios";

// Función para crear una nueva orden
const createOrder = async (orderData: Order) => {
  try {
    const response = await axios.post('https://rxcvgv1p-8000.brs.devtunnels.ms/api/v1/sales/', orderData); 
    return response; // Devuelve la respuesta (el objeto de la orden creada)
  } catch (error: any) {
    // Desglose del error para mayor claridad
    if (axios.isAxiosError(error)) {
      console.error("Axios error:");
      console.error("Response data:", JSON.stringify(error.response?.data));
      console.error("Response status:", error.response?.status);
      console.error("Request headers:", error.config?.headers);
      console.error("Request data:", error.config?.data);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error; // Lanza el error para que pueda ser manejado en el componente o en otra parte
  }
};

export { createOrder };
