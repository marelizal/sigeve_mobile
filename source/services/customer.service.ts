
import { Customer } from "@/models/customer";
import { axiosInstance } from "./api";
import axios from "axios";

// Función para obtener los clientes
export const getCustomers = async (endpoint: string): Promise<Customer[]> => {
  try {
      const response = await axiosInstance.get(endpoint);
      console.log(response);
      
      return response; 
  } catch (error: any) {
      console.error("Error al obtener clientes:", error);
      return [];
  }
};