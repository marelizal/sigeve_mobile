import ProductCard from '@/components/Cards/ProductCard';
import { setSearchQuery } from '@/redux/slices/product.slice';
import { RootState } from '@/redux/store';
import React from 'react';
import { View, FlatList, TextInput, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const ProductsScreen: React.FC = () => {
 const dispatch = useDispatch()
  const { products, searchQuery } = useSelector((state: RootState) => state.products);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
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

