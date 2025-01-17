import CartCard from '@/components/Cards/cart-card';
import Header from '@/components/Header';
import { Colors } from '@/constants/Colors';
import { Order } from '@/models/order';
import { CartItem, clearCart } from '@/redux/slices/cart.slice';
import { selectSelectedCustomer, setSelectedCustomer } from '@/redux/slices/customer.slice';
import { RootState } from '@/redux/store';
import { createOrder } from '@/services/order.service';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View, ActivityIndicator, RootTag, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Location from 'expo-location';

export default function CartScreen() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const salesType = useSelector((state: RootState) => state.cart.salesType);
  const paymentMethods = useSelector((state: RootState) => state.PaymentMethods.methods); // Métodos de pago desde Redux
  const selectedCustomerId = useSelector((state: RootState)=> state.customers.selectedCustomerId)
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState(0);
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });


  const total = cartItems.reduce((acc, product) => {
    const price = Number(product.price_with_tax);  // Ensure price is a valid number
    const quantity = Number(product.quantity);  // Convert to number

    // Handle cases where price or quantity is NaN
    if (isNaN(price) || isNaN(quantity)) {
      return acc;  // Skip invalid product
    }

    return acc + price * quantity;
  }, 0);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigation.navigate('Clientes' as never);
    }
  }, [cartItems, navigation]);


  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'No se pudo obtener la ubicación.');
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        console.log({  latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,})
      } catch (error) {
        Alert.alert('Error', 'Hubo un problema al obtener la ubicación.');
      }
    };

    getLocation();
  }, [location]);





  const selectedPaymentMethod = paymentMethods.find(
    (method) => method.id === paymentMethod
  );

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const orderData: Order = {
        delivery_date: new Date(),  // Fecha de entrega actual
        discount: 0,                 // Descuento (por defecto 0)
        customer_id: selectedCustomerId ? Number(selectedCustomerId) : 0,  // ID del cliente seleccionado
        order_items: cartItems.map((item) => ({
          item_id: Number(item.id),  // Asegurando que el item_id sea un número
          quantity: item.quantity,   // Cantidad del artículo
          price: item.price_with_tax,  // Precio con impuestos
        })),
        payment_method_id: selectedPaymentMethod ? selectedPaymentMethod.id : 1,  // ID del método de pago seleccionado o 1 por defecto
        platform: 'MOBILE_APP',  // Plataforma móvil
        signal: 0,               // Se asume que no hay señal
        lat: location.latitude,                  // Latitud (por ahora 0)
        lng: location.longitude,                  // Longitud (por ahora 0)
        battery: 100,            // Batería (valor por defecto)
        vendor: user?.id ? Number(user.id) : 1,               // ID del vendedor (por defecto 1)
        timestamp: new Date(),   // Timestamp en formato ISO 8601
      };
      
  
      console.log(orderData);
  
      await createOrder(orderData); // Enviar el pedido al servidor
      alert('Pedido creado con éxito!');
      dispatch(clearCart()); // Limpiar el carrito después de crear el pedido
      dispatch(setSelectedCustomer(null))
      navigation.navigate('Clientes' as never); // Navegar después del éxito
    } catch (err) {
      alert('Error al crear el pedido');
    } finally {
      setLoading(false);
    }
  };
  

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
          <Text style={styles.titlePayment}>Total a pagar</Text>
          <Text style={styles.valuePayment}>${total.toFixed(2)}</Text>

          {salesType === 'presale' && (
            <>
              <Text style={styles.paymentMethodLabel}>Seleccionar método de pago:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={paymentMethod}
                  onValueChange={(itemValue) => setPaymentMethod(itemValue)}
                  style={styles.picker}
                >
                  {paymentMethods.map((method) => (
                    <Picker.Item key={method.id} label={method.name} value={method.id} />
                  ))}
                </Picker>
              </View>
            </>
          )}

          <TouchableOpacity style={styles.buttonPayment} onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonPaymentText}>CONTINUAR</Text>
            )}
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
  },
  paymentMethodLabel: {
    fontSize: 16,
    fontWeight: '400',
    marginVertical: 10,
    textAlign: 'left',
    color: Colors.textSelection,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});
