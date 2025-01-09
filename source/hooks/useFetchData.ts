import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getCustomers } from '@/services/customer.service';

import { setCustomers } from '@/redux/slices/customer.slice';
import { setProducts } from '@/redux/slices/product.slice';
import { getProducts } from '@/services/product.service';
import { getPriceLists } from '@/services/pricelist.service';
import { setPriceLists } from '@/redux/slices/pricelist.slice';


const useFetchData = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ejecutam los servicios
        const customers = await getCustomers('/customers');
        const products = await getProducts('/products');
        const priceLists = await getPriceLists('/pricelists');

        // Despachamos las acciones para almacenar los datos en Redux
        dispatch(setCustomers(customers));
        dispatch(setProducts(products));
        dispatch(setPriceLists(priceLists));
      } catch (error) {
        console.error('Error fetching data:', error);
       
      }
    };

    fetchData();
  }, [dispatch]);
};

export default useFetchData;

