import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import TabsView from '@/components/TabsView';
import ClientCard from '@/components/Cards/customer-card';
import { isAvailableForVisit } from '@/utils/isAvailableForVisit';
import Header from '@/components/Header';
import { getCustomers } from '@/services/customer.service';
import { setCustomers } from '@/redux/slices/customer.slice';



const CustomersScreen: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const dispatch = useDispatch()
  // Obtén los clientes desde el estado de Redux
  const { customers } = useSelector((state: RootState) => state.customers);
  const availableForVisit = customers.filter(client => isAvailableForVisit(client.days_off_week));
  const selectedCustomerId = useSelector((state: RootState) => state.customers.selectedCustomerId);
  const routes = [
    { key: 'customers', title: 'Todos' },
    { key: 'today', title: 'Visitar hoy' },
  ];

    useEffect(() => {
      const fetchCustomer = async () => {
        const customers = await getCustomers('/customers');
        dispatch( setCustomers(customers))
        setLoading(false)
      };
      fetchCustomer();
    }, [])
    

  useEffect(() => {
    // Cuando los clientes están disponibles, actualizamos el estado de carga y los clientes filtrados
    if (customers.length > 0) {
      setFilteredCustomers(customers);  // Mostrar todos los clientes en la vista "Todos"
      setLoading(false);
    }
  }, [customers]);  // Se ejecuta cada vez que los clientes cambian

  useEffect(() => {
    // Filtrar clientes basados en la búsqueda
    const filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [searchQuery, customers]);

  const renderScene = {
 
    customers: () => (
      <View style={{ padding: 10 }}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Cargando clientes...</Text>
          </View>
        ) : filteredCustomers.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>No hay clientes disponibles.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredCustomers}
            renderItem={({ item }) => <ClientCard client={item} />}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    ),
    today: () => (
      <View style={{ padding: 10 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : availableForVisit.length === 0 ? (
          <Text style={{ marginTop: 10 }}>No hay clientes disponibles para la visita.</Text>
        ) : (
          <FlatList
            data={availableForVisit.filter(customer =>
              customer.name.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            renderItem={({ item }) => <ClientCard client={item} />}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    ),
  };

  return (
    <View style={{ flex: 1 }}>
      {/* <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textSelection} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar clientes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View> */}
        {selectedCustomerId && (
              <Header />
            )}
      <TabsView routes={routes} renderScene={renderScene} />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
});

export default CustomersScreen;
