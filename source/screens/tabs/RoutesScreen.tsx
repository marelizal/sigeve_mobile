import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useNavigation } from '@react-navigation/native';
import { setActiveRoadmap, setRoadmaps } from '@/redux/slices/roadmap.slice';
import axios from 'axios';
import { Roadmap } from '@/models/roadmap';
import { Colors } from '@/constants/Colors';
import SlideToStart from '@/components/SlideToStart';
import SwipeButton from '@arelstone/react-native-swipe-button';


const RoadmapsScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const roadmaps = useSelector((state: RootState) => state.roadmap.roadmaps);
  const activeRoadmap = useSelector((state: RootState) => state.roadmap.activeRoadmap);
  const customers = useSelector((state: RootState) => state.customers.customers);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const response = await axios.get('https://api-ocarranza.veza.com.ar/v1/planifications');
        const fetchedRoadmaps: Roadmap[] = response.data.docs;

        const populatedRoadmaps = fetchedRoadmaps.map(roadmap => ({
          ...roadmap,
          destinations: roadmap.destinations.map(destination => ({
            ...destination,
            customerInfo: customers.find(customer => customer.id === destination.customer)
          }))
        }));

        dispatch(setRoadmaps(populatedRoadmaps));
      } catch (error) {
        console.error('Error fetching roadmaps:', error);
        setError('Error al cargar las planificaciones');
      }
    };

    fetchRoadmaps();
  }, [dispatch, customers]);

  const handleStartRoadmap = (roadmap: Roadmap) => {
    if (activeRoadmap) {
      if (activeRoadmap.id === roadmap.id) {
        // @ts-ignore
        navigation.navigate('Ruta', { roadmapId: roadmap.id } as never);
      } else {
        setError('Ya tienes una planificación activa. Finalízala antes de comenzar otra.');
      }
      return;
    }

    dispatch(setActiveRoadmap(roadmap));
    // @ts-ignore
    navigation.navigate('Ruta', { roadmapId: roadmap.id } as never);
  };

  const renderRoadmapItem = ({ item }: { item: Roadmap }) => (
    <View
      style={[
        styles.roadmapItem,
        activeRoadmap && activeRoadmap.id !== item.id && styles.disabledRoadmapItem
      ]}
    >
      <Text style={styles.roadmapName}>{item.name}</Text>
      <Text>Hora de inicio: {new Date(item.start).toLocaleTimeString()}</Text>

      <Text>Clientes a visitar: {item.destinations.length}</Text>
      
      {activeRoadmap && activeRoadmap.id === item.id ? (
        <TouchableOpacity
          style={styles.continueButton}
          // @ts-ignore
          onPress={() => navigation.navigate('Ruta', { roadmapId: item.id } as any)}
          >
          <Text style={styles.continueButtonText}>Continuar Hoja de Ruta</Text>
        </TouchableOpacity>
      ) : (
        !activeRoadmap && (
          <View style={styles.sliderContainer}>
            <SlideToStart 
              onSlideComplete={() => handleStartRoadmap(item)}
              // @ts-ignore
              disabled={!!activeRoadmap && activeRoadmap.id !== item.id}
            />
          </View>
        )
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={roadmaps}
        renderItem={renderRoadmapItem}
        keyExtractor={(item) => item.id}
  
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  roadmapItem: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  disabledRoadmapItem: {
    opacity: 0.5,
  },
  roadmapName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  continueButton: {
    backgroundColor: Colors.textSelection,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sliderContainer: {
    marginTop: 16,
  },
});

export default RoadmapsScreen;

