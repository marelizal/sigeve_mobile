
import { Customer } from "@/models/customer";
import { axiosInstance } from "./api";

// Función para obtener los clientes
export const getCustomers = async (endpoint: string): Promise<Customer[]> => {
  try {
      const response = await axiosInstance.get(endpoint);
      return response; 
  } catch (error: any) {
      console.error("Error al obtener clientes:", error);
      return [];
  }
};