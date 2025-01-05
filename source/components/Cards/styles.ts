
import { Colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        marginBottom: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
  
    },
    title: {
        fontSize: 16,
        flex: 1,
        width: 'auto',
        fontWeight:'semibold'
    },
    description: {
        fontSize: 14,
        color: '#555',
        marginTop: 15,

    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 16,
    },
    buttonContainer2: {
        flexDirection: 'column', // Asegúrate de que sea columna
        justifyContent: 'center',
        alignItems: 'center', // Centra los botones
        marginTop: 16,
        width: '100%'
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.textSelection,
        padding: 10,
        borderRadius: 5,
        width: 'auto',
        justifyContent: 'center',
        marginVertical: 4,
        marginHorizontal:2
    },
    buttonBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:  Colors.textSelection,
        padding: 10,
        borderRadius: 5,
        width: '60%',
        justifyContent: 'center',
        marginVertical: 4
    },
    buttonBlock2: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.textSelection,
        padding: 10,
        borderRadius: 5,
        width: '55%',
        justifyContent: 'center',
        marginVertical: 4
    },
    buttonCancel: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        padding: 10,
        borderRadius: 5,
        width: 'auto',
        justifyContent: 'center',
        marginVertical: 4
    },
    buttonText: {
        color: 'white',
        marginLeft: 8,
    },
    buttonTextWithoutIcon: {
        color: 'white',
        marginLeft: 0,
    },
    productContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    productCartContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    value: {
        fontSize: 20,
        fontWeight: 'medium',
        color: Colors.textSelection
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityContainer2: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    quantity: {
        marginHorizontal: 10,
        fontSize: 16,
    },
    clientInfo: {
        marginTop: 15,
    },
    infoText: {
        fontSize: 12,
        color: '#333',
    },
    roadmapContainer: {
        marginTop: 20,
    },
    roadmapText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
    },
    cartheader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 10
    },
    headerText: {
        color: '#c3c3c3',
        fontSize: 18
    },
    availableIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6, // Para hacer el círculo
        backgroundColor: 'green', // Color verde
        marginRight: 8, // Espacio entre el círculo y el icono
    },
    image: {
        width: 50,
        height: 50,
        marginRight: 10,
        borderRadius:0
    }
});

