
import { PaymentMethod } from '@/models/payment-method';
import axios from 'axios';

export const getPaymentMethod = async (url: string): Promise<PaymentMethod[]> => {
  try {
    const response = await axios.get<PaymentMethod[]>(`https://rxcvgv1p-8000.brs.devtunnels.ms/api/v1/payment_methods/?page=1&size=10`);
    console.log('METODOS DE PAGOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO',response.data);
    return response.data; 
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }
};
