import CartCard from '@/components/Cards/cart-card';
import Header from '@/components/Header';
import { Colors } from '@/constants/Colors';
import { Product } from '@/models/product';
import { CartItem, clearCart } from '@/redux/slices/cart.slice';
import { RootState } from '@/redux/store';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';

import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';


export default function CartScreeb() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const salesType = useSelector((state: RootState) => state.cart.salesType);

  const navigation = useNavigation()
  const dispatch = useDispatch()
  const [paymentMethod, setPaymentMethod] = useState(''); // Estado para el método de pago

  console.log(cartItems)

  const [isEnabled, setIsEnabled] = useState(false);
  const total = cartItems.reduce((acc, product) => {
    const price = Number(product.price_with_tax);  // Ensure price is a valid number
    const quantity = Number(product.quantity);  // Convert to number

    // Handle cases where price or quantity is NaN
    if (isNaN(price) || isNaN(quantity)) {
      return acc;  // Skip invalid product
    }

    return acc + price * quantity;
  }, 0);

  console.log(total);


  if (cartItems.length === 0) {
    setTimeout(() => {
      return navigation.navigate('Clientes' as never);
    }, 3000);
  }

  return (
    <>
      <Header />
      <View style={styles.container}>
        <ScrollView style={{ marginHorizontal: 10, paddingTop: 10 }}>
          {cartItems.map((product: CartItem) => {
            const subtotal = product.price_with_tax * product.quantity;
            return (
              <CartCard
                key={product.id}
                qty={product.quantity}
                itemId={product.id}
                name={product.name}
                value={product.price_with_tax}
                subtotal={subtotal}
              />
            );
          })}
        </ScrollView>
        <View style={styles.paymentInfoContainer}>
          {/* {selectedRoadmap && visitType === 'delivery' && (
                        <View style={styles.switchContainer}>
                            <Text style={styles.switchLabel}>
                                Entrega parcial
                            </Text>
                            <Switch
                                trackColor={{ false: '#D9D9D9', true: '#D9D9D9' }}
                                thumbColor={isEnabled ? '#F3764A' : '#767577'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => { }}
                                value={isEnabled}
                                disabled={true}
                            />
                        </View>
                    )} */}
          <Text style={styles.titlePayment}>Total a pagar</Text>
          <Text style={styles.valuePayment}>${total.toFixed(2)}</Text>

          {salesType === 'presale' &&
            <>
              <Text style={styles.paymentMethodLabel}>Seleccionar método de pago:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={paymentMethod}
                  onValueChange={(itemValue) => setPaymentMethod(itemValue)}
                  style={styles.picker}
                >

                  <Picker.Item label="Efectivo" value="cash" />
                  <Picker.Item label="Tarjeta de crédito" value="credit_card" />
                  <Picker.Item label="Transferencia bancaria" value="bank_transfer" />
                </Picker>
              </View>
            </>

          }

          <TouchableOpacity style={styles.buttonPayment} onPress={() => {
            dispatch(clearCart())
            navigation.navigate('Ruta' as never);
          }}>
            <Text style={styles.buttonPaymentText}>CONTINUAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  paymentInfoContainer: {
    padding: 10,
    backgroundColor: '#FFF',
    width: '100%',
  },
  titlePayment: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'right',
  },
  valuePayment: {
    fontSize: 30,
    fontWeight: '300',
    color: Colors.textSelection,
    marginTop: 5,
    marginBottom: 10,
    textAlign: 'right',
  },
  buttonPayment: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.textSelection,
    padding: 10,
    borderRadius: 5,
    width: 'auto',
    justifyContent: 'center',
    marginVertical: 4,
  },
  buttonPaymentText: {
    color: '#FFF',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginVertical: 10,
  },
  switchLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  }, paymentMethodLabel: {
    fontSize: 16,
    fontWeight: '400',
    marginVertical: 10,
    textAlign: 'left',
    color: Colors.textSelection
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
  }, picker: {
    height: 50,
    width: '100%',
  },
});
