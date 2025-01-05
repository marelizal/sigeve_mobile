
import { Colors } from '@/constants/Colors';
import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

type Route = {
    key: string;
    title: string;
};

interface TabsViewProps {
    routes: Route[];
    renderScene: { [key: string]: () => JSX.Element };
}

const TabsView: React.FC<TabsViewProps> = ({ routes, renderScene }) => {
    const [index, setIndex] = React.useState<number>(0);

    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            style={styles.tabBar} // Estilo de la barra de pestañas
            labelStyle={styles.label} // Estilo de las etiquetas
            indicatorStyle={styles.indicator} // Estilo del indicador
        />
    );

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={SceneMap(renderScene)}
            onIndexChange={setIndex}
            initialLayout={{ width: Dimensions.get('window').width }}
            renderTabBar={renderTabBar} // Usar TabBar personalizada
        />
    );
};

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: Colors.textSelection, // Color de fondo de la barra de pestañas
    },
    label: {
        color: '#fff', // Color del texto de las etiquetas
    },
    indicator: {
        backgroundColor: '#fff', // Color del indicador de la pestaña activa
    },
    scene: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20, // Agregar padding al contenido de las escenas
    },
});

export default TabsView;
