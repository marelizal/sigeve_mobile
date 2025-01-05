import axios from 'axios';
import { Product } from '@/models/product';
import { axiosInstance } from './api';


export const getProducts = async (url: string): Promise<Product[]> => {
  try {
    const response = await axiosInstance.get<Product[]>(url);
    return response;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

