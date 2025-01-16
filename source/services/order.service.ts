import { Order } from "@/models/order";
import { axiosInstance } from "./api";
import axios from "axios";

// Función para crear una nueva orden
const createOrder = async (orderData: Order) => {
  try {
    const response = await axios.post('https://rxcvgv1p-8000.brs.devtunnels.ms/api/v1/sales/', orderData); 
    return response; // Devuelve la respuesta (el objeto de la orden creada)
  } catch (error) {
    console.error('Error creando la orden:', error);
    throw error; // Lanza el error para que pueda ser manejado en el componente o en otra parte
  }
};

export { createOrder };
