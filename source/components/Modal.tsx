
import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

interface GlobalModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    children: React.ReactNode; // Contenido principal
    children2?: React.ReactNode; // Contenido adicional
}

const GlobalModal: React.FC<GlobalModalProps> = ({
    visible,
    onClose,
    onConfirm,
    children,
    children2,
}) => {
    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.content}>
                        {children}
                    </View>
                    {/* <View style={styles.buttonContainer}>
                        <Button title="Cancelar" onPress={onClose} color={Colors.dark.accent} />
                    </View> */}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    content: {
        marginBottom: 20,
        textAlign: 'center',
        width: '100%',
    },
    buttonContainer: {
        width: '100%',
    },
    fullWidthButton: {
        width: '100%',
        paddingVertical: 10,
    },
});

export default GlobalModal;
