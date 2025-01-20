import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, Modal, StyleSheet, Pressable, Alert, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

import { isAvailableForVisit } from '@/utils/isAvailableForVisit';
import GlobalModal from '../Modal';
import { Customer } from '@/models/customer';
import { useDispatch } from 'react-redux';
import { Colors } from '@/constants/Colors';
import { setSelectedCustomer } from '@/redux/slices/customer.slice';
import { SaleType, setSalesType } from '@/redux/slices/cart.slice';
import { useNavigation } from '@react-navigation/native';



interface CustomerCardProps {
    client: Customer;
}

const ClientCard: React.FC<CustomerCardProps> = ({ client }) => {
    const dispatch = useDispatch()
    const { phone, address, name, days_off_week, id, lat, lng, identification_type, identification_number, zone,current_balance,account_limit } = client;
    const [isOpen, setIsOpen] = useState(false);
    const [modalMenuVisible, setModalMenuVisible] = useState(false);
    const [loading, setLoading] = useState(false); // Estado para mostrar el loading
    const [amount, setAmount] = useState<string>(''); // Estado para el monto a cobrar

    const [modalVisible, setModalVisible] = useState(false);
    const navigate = useNavigation()


    const handleSale = () => {
        // router.push('/(app)/(root)/vehicle_stock')
    };
    const handlePreSale = () => {
        // Lógica de confirmación
        // router.push('/(app)/(root)/(tabs)/three')
        // dispatch(selectUser(id))
        dispatch(setSelectedCustomer(id))
        dispatch(setSalesType(SaleType.PRESALE))
        navigate.navigate('Productos' as never)
        // handleCloseModal();
    };


    const handleCobro = () => {
        if (!amount) {
            Alert.alert('Por favor, ingrese un monto válido.');
            return;
        }

        setLoading(true); // Inicia el loading

        // Simula un retraso de cobro (puedes poner aquí tu lógica real)
        setTimeout(() => {
            setLoading(false); // Detiene el loading
            Alert.alert('Cobro realizado exitosamente');
            setModalVisible(false); // Cierra el modal
        }, 2000); // Simula un retraso de 2 segundos
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
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 10,

                    borderRadius: 8,
                }}
                onPress={toggleOpen}
            >
                {/* Primer contenedor */}
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    {/* Fila: Icono de persona y nombre */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                        <Ionicons name="person-circle" size={24} />
                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 8, color: '#333' }}>
                            {name}
                        </Text>
                    </View>

                    {/* Fila: Identification number y type */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, color: '#666', marginRight: 8 }}>
                            {identification_type}:
                        </Text>
                        <Text style={{ fontSize: 14, color: '#666' }}>
                            {identification_number}
                        </Text>
                    </View>
                </View>

                {/* Flecha hacia abajo */}
                <Ionicons
                    name={isOpen ? 'chevron-up-outline' : 'chevron-down-outline'}
                    size={24}
                    color="#666"
                />
            </TouchableOpacity>


            {isOpen && (
                <View>
                    {/* Dirección */}
                    {address && (
                        <Text style={{ fontSize: 14, color: '#333', marginBottom: 4, marginLeft: 11 }}>
                            Dirección: {address}
                        </Text>
                    )}

                    {/* Zona (con color naranja) */}
                    {zone && (
                        <Text style={{ fontSize: 14, color: 'orange', marginBottom: 4, marginLeft: 11 }}>
                            Zona: {zone.name}
                        </Text>
                    )}

                    {/* Teléfono */}
                    {phone && (
                        <Text style={{ fontSize: 14, color: '#333', marginBottom: 4, marginLeft: 11 }}>
                            Teléfono: {phone}
                        </Text>
                    )}

                    {/* Última visita */}

                    <Text style={{ fontSize: 14, color: '#333', marginBottom: 12, marginLeft: 11 }}>
                        Última visita: 18/08/1994
                    </Text>


                    {/* Botones */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        {/* Botón de Venta */}
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: '#000',
                                padding: 10,
                                borderRadius: 8,
                                marginRight: 8,
                                flex: 1,
                                justifyContent: 'center',
                            }}
                            onPress={()=>{}} 
                        >
                            <Ionicons name="cash-outline" size={20} color="white" />
                            <Text style={{ fontSize: 14, color: 'white', marginLeft: 8 }}>
                                Venta
                            </Text>
                        </TouchableOpacity>

                        {/* Botón de Pedido */}
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: '#000',
                                padding: 10,
                                borderRadius: 8,
                                flex: 1,
                                justifyContent: 'center',
                            }}
                            onPress={handlePreSale} // Ajusta esta función según tu lógica
                        >
                            <Ionicons name="clipboard-outline" size={20} color="white" />
                            <Text style={{ fontSize: 14, color: 'white', marginLeft: 8 }}>
                                Pedido
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                width: 40, // Ancho del botón
                                height: 40, // Alto del botón, igual al ancho para que sea un círculo
                                alignItems: 'center', // Centra el contenido horizontalmente
                                justifyContent: 'center', // Centra el contenido verticalmente
                                backgroundColor: '#000', // Color de fondo del botón
                                borderRadius: 25, // Radio igual a la mitad del tamaño para que sea redondo
                                marginLeft: 4
                            }}
                            onPress={() => {
                                setModalMenuVisible(true); // Lógica para abrir el modal
                            }}>
                            <Ionicons name="ellipsis-vertical" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

            )}


            <Modal
                animationType="fade"
                transparent={true}
                visible={modalMenuVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                  
                }}>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Oscurece el fondo
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <View
                        style={{
                            backgroundColor: 'white',
                            padding: 20,
                            borderRadius: 8,
                            width: '90%', // Ocupa el 90% del ancho de la pantalla
                            alignItems: 'stretch', // Asegura que los botones ocupen todo el ancho
                        }}>
                        {[
                            { label: 'Actualizar geocoordenadas', icon: 'location-outline' },
                            { label: 'Cobrar', icon: 'cash-outline' },
                            { label: 'Navegar', icon: 'navigate-outline' },
                            { label: 'Marcar como visitado', icon: 'checkmark-done-outline' },
                            { label: 'Consultar CTE-CTA', icon: 'document-text-outline' },
                            { label: 'Devolución', icon: 'arrow-undo-outline' },
                            
                        ].map((button, index) => (
                            <TouchableOpacity
                                key={index}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: '#000',
                                    paddingVertical: 12, // Reduce la altura de los botones
                                    paddingHorizontal: 16,
                                    borderRadius: 6,
                                    marginBottom: index === 5 ? 0 : 10, // Sin margen inferior en el último botón
                                }}
                                onPress={() => {
                                    console.log(button.label);
                                    if(button.label === 'Actualizar geocoordenadas'){
                                        Alert.alert('La ubicación del cliente se actualizó correctamente.')
                                        setModalMenuVisible(false)
                                    }
                                    if(button.label === 'Cobrar'){
                                        setModalVisible(true)
                                        setModalMenuVisible(false)
                                        
                                    }
                                    if(button.label === 'Marcar como visitado'){
                                        Alert.alert('El cliente ha sido marcado como visitado.')
                                        setModalMenuVisible(false)
                                    }
                                    if (button.label === 'Consultar CTE-CTA') {
                                        if (current_balance == null || account_limit == null) {
                                            Alert.alert('Este usuario no tiene asignada una CTE-CTA.');
                                        } else {
                                            Alert.alert(`La consulta CTE-CTA se realizó correctamente. 
                                                Balance actual: ${current_balance} - Límite de cuenta: ${account_limit}`);
                                        }
                                        setModalMenuVisible(false);
                                    }
                                        if(button.label === 'Devolución'){
                                            Alert.alert('El proceso de devolución no esta disponible.')
                                            setModalMenuVisible(false)
                                        }
                                        if(button.label === 'Navegar'){
                                            handlenavigation()
                                        }
                                    }}
                                >
                                <Ionicons name={button.icon as keyof typeof Ionicons.glyphMap} size={20} color="white" />
                                <Text style={{ fontSize: 14, color: 'white', marginLeft: 8 }}>
                                    {button.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>

             {/* Modal para ingresar monto y realizar cobro */}
             <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={style2s.modalBackground}>
                    <View style={style2s.modalContainer}>
                        <Text style={style2s.modalTitle}>Ingrese el monto a cobrar</Text>
                        <TextInput
                            style={style2s.input}
                            placeholder="Monto"
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                        />
                        <TouchableOpacity
                            style={style2s.cobrarButton}
                            onPress={handleCobro}
                            disabled={loading} // Desactiva el botón mientras está en carga
                        >
                            {loading ? (
                                <View style={{display:'flex', flexDirection:'row', gap:4}}>
                                <ActivityIndicator size="small" color="#fff" />
                                <Text style={style2s.buttonText}>Imprimiendo recibo</Text>
                                </View>
                            ) : (
                                <Text style={style2s.buttonText}>Cobrar</Text>
                            )}
                        </TouchableOpacity>
                  
                    </View>
                </View>
            </Modal>


        </View>
    );
};

export default ClientCard;

const style2s = StyleSheet.create({
    openModalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 8,
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 14,
        color: 'white',
        marginLeft: 8,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },
    cobrarButton: {
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    closeButton: {
        marginTop: 10,
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
});