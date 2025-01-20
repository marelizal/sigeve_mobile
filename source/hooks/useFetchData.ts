
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getCustomers } from '@/services/customer.service';

import { setCustomers } from '@/redux/slices/customer.slice';
import { setProducts } from '@/redux/slices/product.slice';
import { getProducts } from '@/services/product.service';
import { getPriceLists } from '@/services/pricelist.service';
import { setPriceLists } from '@/redux/slices/pricelist.slice';
import { getPaymentMethod } from '@/services/payment-method.service';
import { addPaymentMethods } from '@/redux/slices/payment-method.featere';


const useFetchData = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ejecutamos los servicios
        const customers = await getCustomers('/customers');
        console.log('Customers:', customers); // Verificar datos
        dispatch(setCustomers(customers));
  
        const products = await getProducts('/products');
        console.log('Products:', products); // Verificar datos
        dispatch(setProducts(products));
  
        const priceLists = await getPriceLists('/pricelists');
        console.log('Price Lists:', priceLists); // Verificar datos
        dispatch(setPriceLists(priceLists));
  
        const paymentMethods = await getPaymentMethod('/payment_methods/?page=1&size=10');
        console.log('Payment Methods:', paymentMethods); // Verificar datos
        dispatch(addPaymentMethods(paymentMethods));
      } catch (error) {
        console.error('Error fetching data:', error);
        // Aquí podrías despachar una acción para manejar el error en el estado global
        // Por ejemplo: dispatch(setError('Error al cargar los datos'));
      }
    };

    fetchData();
  }, [dispatch]); // Se ejecuta una vez cuando el componente se monta
};

export default useFetchData;

