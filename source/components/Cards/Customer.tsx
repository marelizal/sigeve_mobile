import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

import { isAvailableForVisit } from '@/utils/isAvailableForVisit';
import GlobalModal from '../Modal';
import { Customer } from '@/models/customer';
import { useDispatch } from 'react-redux';
import { Colors } from '@/constants/Colors';



interface CustomerCardProps {
    client: Customer;
}

const ClientCard: React.FC<CustomerCardProps> = ({ client }) => {
    const dispatch = useDispatch()
    const { phone, address, name, days_off_week, id,lat,lng } = client;
    const [isOpen, setIsOpen] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);


    const handleOpenModal = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const handleConfirm = () => {
        handleCloseModal();
    };

    const handleSale = () => {
        // router.push('/(app)/(root)/vehicle_stock')
    };
    const handlePreSale = () => {
        // Lógica de confirmación
        // router.push('/(app)/(root)/(tabs)/three')
        // dispatch(selectUser(id))
        handleCloseModal();
    };

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const handlenavigation = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
    };
    const available = isAvailableForVisit(days_off_week);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.header} onPress={toggleOpen}>
                <View
                    style={[
                        styles.availableIndicator,
                        { backgroundColor: available ? 'green' : 'red' }
                    ]}
                />
                {/* <Feather name="user" size={24} color={Colors.dark.accent} /> */}
                <Text style={styles.title}>{name}</Text>
                <Ionicons name={isOpen ? 'chevron-up-outline' : 'chevron-down-outline'} size={24} color={Colors.textSelection} />
            </TouchableOpacity>

            {isOpen && (
                <View>
                    <Text></Text>
                    {phone && <Text style={styles.infoText}>Teléfono: {phone}</Text>}
                    {address && <Text style={styles.infoText}>Dirección: {address}</Text>}
                    {available && <Text style={{ color: Colors.textSelection }}>Disponible para la visita</Text>}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.buttonBlock} onPress={handleOpenModal}>
                            <Ionicons name="add-outline" size={20} color="white" />
                            <Text style={styles.buttonText}>REALIZAR UNA VENTA</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handlenavigation}>
                            <Ionicons name="map" size={20} color="white" />
                            <Text style={styles.buttonText}>NAVEGAR</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <GlobalModal
                visible={modalVisible}
                onClose={handleCloseModal}
                onConfirm={handleConfirm}
                children={
                    <View>
                        <Text>Seleccione una opción:</Text>
                        <View style={styles.buttonContainer2}>
                            {/* <TouchableOpacity style={styles.buttonBlock} onPress={handleSale}>
                                <Text style={styles.buttonText}>VENTA EN RUTA</Text>
                            </TouchableOpacity> */}
                            <TouchableOpacity style={styles.buttonBlock} onPress={handlePreSale}>
                                <Text style={styles.buttonText}>PREVENTA</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            />
        </View>
    );
};

export default ClientCard;
