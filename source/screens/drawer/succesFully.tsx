
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Colors } from "@/constants/Colors";
import { useNavigation } from "@react-navigation/native";

export default function SuccessComponent() {
    const navigate = useNavigation()
    return (
        <>
        
            <View style={styles.container}>
                <Text style={styles.title}>¡Felicidades!</Text>
                <Ionicons name="checkmark-circle" size={100} color='#27ae60' style={styles.icon} />
                <Text style={styles.subtitle}>La venta se realizó correctamente.</Text>
                {/* <TouchableOpacity style={styles.button} onPress={() => console.log("Ver Remito")}>
                    <Text style={styles.buttonText}>VER REMITO</Text>
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.button} onPress={() => navigate.navigate('Inicio' as never)}>
                    <Text style={styles.buttonText}>REALIZAR OTRA VENTA</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        backgroundColor: "#FFF",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    icon: {
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 16,
        color: "#333",
        textAlign: "center",
        marginBottom: 30,
    },
    button: {
        backgroundColor: Colors.textSelection,
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        width: "100%",
        marginBottom: 10,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});
