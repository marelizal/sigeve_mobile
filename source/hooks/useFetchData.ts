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
        // Hacer las peticiones de manera secuencial
        const customers = await getCustomers('/customers');
        const products = await getProducts('/products');
        const priceLists = await getPriceLists('/pricelists');
        const paymentMethods = await getPaymentMethod('/payment_methods/?page=1&size=10');
        
        // Despachamos las acciones para almacenar los datos en Redux
        dispatch(setCustomers(customers));
        dispatch(setProducts(products));
        dispatch(setPriceLists(priceLists));
        dispatch(addPaymentMethods(paymentMethods));

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [dispatch]);
};

export default useFetchData;
