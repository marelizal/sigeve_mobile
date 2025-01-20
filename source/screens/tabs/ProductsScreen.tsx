import React, { useEffect } from 'react';
import { View, FlatList, TextInput, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts, setSearchQuery } from '@/redux/slices/product.slice';
import { RootState } from '@/redux/store';
import ProductCard from '@/components/Cards/product-card';
import Header from '@/components/Header';
import useApplyCostWithPriceList from '@/hooks/useApllyCostWithPriceList';
import { getProducts } from '@/services/product.service';


const ProductsScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { products, searchQuery } = useSelector((state: RootState) => state.products);
  const selectedCustomerId = useSelector((state: RootState) => state.customers.selectedCustomerId);
  const customers = useSelector((state: RootState) => state.customers.customers);
  const priceLists = useSelector((state: RootState) => state.priceList.priceLists);

  // Obtener el cliente seleccionado
  const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId) || null;

  // Aplicar lista de precios al cliente seleccionado
  const updatedProducts = useApplyCostWithPriceList(selectedCustomer, products, priceLists);

  // Filtrar productos por búsqueda
  const filteredProducts = updatedProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

 
  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts('/products');
      dispatch( setProducts(products))
    };
    fetchProducts();
  }, [])
  

  return (
    <>
      {selectedCustomerId && <Header />}
      <View style={styles.container}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar productos..."
          value={searchQuery}
          onChangeText={(text) => dispatch(setSearchQuery(text))}
        />
        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => <ProductCard product={item} />}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
});

export default ProductsScreen;
