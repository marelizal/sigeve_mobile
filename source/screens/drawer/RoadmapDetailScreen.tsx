import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { finishRoadmap, updateDestination } from '@/redux/slices/roadmap.slice';
import { Destination } from '@/models/roadmap';
import TabsView from '@/components/TabsView';
import { Colors } from '@/constants/Colors';
import * as Location from 'expo-location';

type RoadmapDetailRouteProp = RouteProp<{ RoadmapDetail: { roadmapId: string } }, 'RoadmapDetail'>;

const RoadmapDetailScreen: React.FC = () => {
    const route = useRoute<RoadmapDetailRouteProp>();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const { roadmapId: paramRoadmapId } = route.params || {};
    const roadmapId = paramRoadmapId || useSelector((state: RootState) => state.roadmap.activeRoadmap?.id);

    const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setUserLocation(location);
        })();
    }, []);

    if (!roadmapId) {
        return <Text>ID de planificación no proporcionado.</Text>;
    }

    const roadmap = useSelector((state: RootState) =>
        state.roadmap.roadmaps.find(r => r.id === roadmapId)
    );

    const customers = useSelector((state: RootState) => state.customers.customers);

    const [observations, setObservations] = useState('');
    const allVisited = roadmap ? roadmap.destinations.every(d => d.visited) : false;
    if (!roadmap) {
        return <Text>Planificación no encontrada</Text>;
    }

    const handleToggleVisited = (destinationId: string) => {
        dispatch(updateDestination({ roadmapId, destinationId, visited: true }));
    };

    const handleFinishRoadmap = () => {
        const allVisited = roadmap.destinations.every(d => d.visited);
        if (!allVisited && !observations) {
            Alert.alert(
                'Observaciones requeridas',
                'Debes proporcionar observaciones si no has visitado todos los clientes.',
                [{ text: 'OK' }]
            );
            return;
        }

        dispatch(finishRoadmap({ roadmapId, observations }));
        navigation.goBack();
    };

    const calculateDistance = (destLat: number, destLon: number) => {
        if (!userLocation) return null;
        const R = 6371; // Earth's radius in km
        const φ1 = userLocation.coords.latitude * Math.PI / 180;
        const φ2 = destLat * Math.PI / 180;
        const Δφ = (destLat - userLocation.coords.latitude) * Math.PI / 180;
        const Δλ = (destLon - userLocation.coords.longitude) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c;
        return distance <= 1 ? `${(distance * 1000).toFixed(0)} m` : `${distance.toFixed(1)} km`;
    };

    const isNearLocation = (destLat: number, destLon: number) => {
        if (!userLocation) return false;
        const distance = calculateDistance(destLat, destLon);
        return distance && parseFloat(distance) <= 0.01; // 10 meters
    };

    const renderDestinationItem = ({ item }: { item: Destination }) => {
        const customer = customers.find(c => String(c.id) === String(item.customer));
        const isNearby = isNearLocation(customer!.lat, customer!.lng);
        const distance = calculateDistance(customer!.lat, customer!.lng);
        console.log(distance);

        return (
            <View style={[styles.destinationItem, item.visited && styles.visitedDestination]}>
                <Text style={styles.customerName}>
                    {customer ? customer.registered_name : 'Cliente desconocido'}
                </Text>

                {distance !== 'NaN km' && <Text style={styles.typeText}>{`(a ${distance} de distancia)`}</Text>}


                <Text style={styles.addressText}>{item.address}</Text>
                <Text style={styles.statusText}>{item.visited ? 'Visitado' : 'Pendiente'}</Text>

                <View style={styles.buttonContainer}>
                    {!isNearby && !item.visited && (
                        <>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => { handleToggleVisited(item._id); }}>
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.navButton]} onPress={() => {/* Navigate to map */ }}>
                                <Text style={styles.buttonText}>Navegar</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {isNearby && !item.visited && (
                        <TouchableOpacity
                            style={[styles.button, styles.actionButton]}
                            onPress={() => {
                                if (item.type === 'delivery') {
                                    handleToggleVisited(item._id);
                                } else {
                                    handleToggleVisited(item._id);
                                }
                                handleToggleVisited(item._id);
                            }}
                        >
                            <Text style={styles.buttonText}>
                                {item.type === 'delivery' ? 'Entregar productos' : 'Realizar venta'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    const deliveries = roadmap.destinations.filter(d => d.type === 'delivery');
    const visits = roadmap.destinations.filter(d => d.type === 'visit');


    const pendingDeliveries = deliveries.filter(d => !d.visited);
    const pendingVisits = visits.filter(d => !d.visited);


    const routes = [
        { key: 'entregas', title: `Entregas (${pendingDeliveries.length})` },
        { key: 'visitas', title: `Visitas (${pendingVisits.length})` },
    ];

    const renderScene = {
        entregas: () => (
            <FlatList
                data={deliveries}
                renderItem={renderDestinationItem}
                keyExtractor={(item) => item._id}
                ListEmptyComponent={<Text>No hay entregas programadas</Text>}
            />
        ),
        visitas: () => (
            <FlatList
                data={visits}
                renderItem={renderDestinationItem}
                keyExtractor={(item) => item._id}
                ListEmptyComponent={<Text>No hay visitas programadas</Text>}
            />
        ),
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{roadmap.name}</Text>
            <Text style={styles.subtitle}>Hora de inicio:  {new Date(roadmap.start).toLocaleTimeString()}</Text>


            <TabsView renderScene={renderScene} routes={routes} />



            {
                !allVisited && !observations && (
                    <TextInput
                        style={styles.observationsInput}
                        placeholder="Observaciones (requerido si no se visitaron todos los clientes)"
                        value={observations}
                        onChangeText={setObservations}
                        multiline
                    />
                )


            }
            <TouchableOpacity style={styles.finishButton} onPress={handleFinishRoadmap}>
                <Text style={styles.finishButtonText}>Finalizar Planificación</Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        marginHorizontal: 16,
        marginTop: 16,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 16,
        marginHorizontal: 16,
    },
    subtitle2: {
        fontSize: 16,
        marginBottom: 16,
        marginHorizontal: 16,
    },
    destinationItem: {
        marginTop: 10,
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginHorizontal: 10,
    },
    visitedDestination: {
        backgroundColor: '#e6ffe6',
    },
    customerName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    addressText: {
        fontSize: 14,
        marginBottom: 4,
    },
    typeText: {
        fontSize: 14,
        marginBottom: 4,
    },
    statusText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    button: {
        flex: 1,
        padding: 8,
        borderRadius: 4,
        alignItems: 'center',
    },
    navButton: {
        backgroundColor: Colors.background,
    },
    cancelButton: {
        backgroundColor: 'red',
    },
    actionButton: {
        backgroundColor: Colors.textSelection,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    observationsInput: {
        backgroundColor: 'white',
        padding: 8,
        margin: 16,
        borderRadius: 8,
        height: 100,
        textAlignVertical: 'top',
    },
    finishButton: {
        backgroundColor: Colors.textSelection,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 16,
    },
    finishButtonText: {

        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default RoadmapDetailScreen;

