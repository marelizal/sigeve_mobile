import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { clearCart } from '@/redux/slices/cart.slice';
import { setSelectedCustomer } from '@/redux/slices/customer.slice';
import { Colors } from '@/constants/Colors';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const dispatch = useDispatch();
  
  // Selecting necessary pieces of state
  const selectedUserId = useSelector((state: RootState) => state.customers.selectedCustomerId);
  const user = useSelector((state: RootState) => state.auth.user);
  const { customers } = useSelector((state: RootState) => state.customers);

  // Safe lookup for selected customer
  const selectedCustomer = customers?.find((customer) => customer.id === selectedUserId);

  // Handle cancel action
  const handleCancelSelection = () => {
    dispatch(clearCart());
    dispatch(setSelectedCustomer(null));
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      {selectedCustomer ? (
        <View style={styles.clientInfo}>
          <View style={styles.clientTextContainer}>
            <Text style={styles.clientName}>
              {selectedCustomer.name}
            </Text>
            <Text style={styles.clientDetails}>
              {selectedCustomer.identification_type}: {selectedCustomer.identification_number}
            </Text>
            <Text style={styles.clientDetails}>
              IVA: {selectedCustomer.tax_category}
            </Text>
          </View>
          <TouchableOpacity onPress={handleCancelSelection} style={styles.cancelButton}>
            <Feather name="x" size={24} color={Colors.textSelection} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.userInfo}>
          <Text style={styles.user}>
            {title || user?.name || "No User"}
          </Text>
          <Text style={styles.vehicle}>
            {subtitle || user?.email || "No email provided"}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.textSelection,
    paddingBottom: 30,
    paddingHorizontal: 10,
  },
  userInfo: {
    alignItems: 'center',
  },
  user: {
    fontSize: 20,
    color: Colors.textSelection,
    marginVertical: 5,
  },
  vehicle: {
    fontSize: 15,
    marginVertical: 5,
    padding: 10,
    lineHeight: 10,
    color:'#fff'
  },
  clientInfo: {
    marginTop: 10,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  clientTextContainer: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    color: Colors.textSelection,
    marginRight: 10,
  },
  clientDetails: {
    fontSize: 14,
    color: 'white',
  },
  cancelButton: {
    marginLeft: 10,
    justifyContent: 'center',
  },
});

export default Header;
