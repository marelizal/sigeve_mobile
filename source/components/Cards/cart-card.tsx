import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from './styles';
import { useDispatch } from 'react-redux';
import { decreaseItem, increaseItem, removeItem } from '@/redux/slices/cart.slice';

interface CartCardProps {
    itemId: string;
    name: string;
    value: number;
    subtotal: number;
    qty: number;
}

const CartCard: React.FC<CartCardProps> = ({ itemId, name, value, subtotal, qty }) => {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const handleIncrease = () => {
        if (itemId) {
            dispatch(increaseItem(itemId));
        }
    };

    const handleDecrease = () => {
        if (itemId) {
            dispatch(decreaseItem(itemId));
        }
    };

    const handleRemove = () => {
        if (itemId) {
            dispatch(removeItem(itemId));
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.header} onPress={toggleOpen}>
                <Text style={styles.title}>{name}</Text>
                <Feather name={isOpen ? 'chevron-up' : 'chevron-down'} size={24} color="#000" />
            </TouchableOpacity>

            {isOpen && (
                <View style={styles.productCartContainer}>
                    <View style={styles.cartheader}>
                        <View>
                            <Text style={styles.headerText}>Precio por unidad</Text>
                            <Text style={styles.value}>${value.toFixed(2)}</Text>
                            </View>
                        <View>
                            <Text style={styles.headerText}>Total</Text>
                            <Text style={styles.value}>${subtotal.toFixed(2)}</Text>
                        </View>
                    </View>
                    <View style={styles.quantityContainer2}>
                        <TouchableOpacity style={styles.buttonBlock2} onPress={handleRemove}>
                            <Feather name="x" size={24} color="white" />
                            <Text style={styles.buttonText}>Quitar del carrito</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleDecrease}>
                            <Feather name="minus" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.quantity}>{qty}</Text>
                        <TouchableOpacity style={styles.button} onPress={handleIncrease}>
                            <Feather name="plus" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

export default CartCard;
