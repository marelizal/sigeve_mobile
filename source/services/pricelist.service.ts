
import { Pricelist } from '@/models/pricelist';
import { axiosInstance } from './api';


export const getPriceLists = async (url: string): Promise<Pricelist[]> => {
  try {
    const response = await axiosInstance.get<Pricelist[]>(url);
    return response;
  } catch (error) {
    console.error('Error fetching price lists:', error);
    throw error;
  }
};

