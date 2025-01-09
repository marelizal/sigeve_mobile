import { RootState } from '@/redux/store';
import React from 'react';
import { View, Text } from 'react-native';
import { Header } from 'react-native/Libraries/NewAppScreen';
import { useSelector } from 'react-redux';

const CartScreen = () => {

  const selectedCustomerId = useSelector((state: RootState) => state.customers.selectedCustomerId);

  return (
    <>
      {selectedCustomerId && (
        <Header />
      )}
      <View>
        <Text>Cart Screen</Text>
      </View>
    </>
  );
};

export default CartScreen;

