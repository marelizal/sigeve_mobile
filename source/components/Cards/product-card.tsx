import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Product } from '@/models/product';
import { addItem, decreaseItem } from '@/redux/slices/cart.slice';
import { Colors } from '@/constants/Colors';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { id, name, description, price_with_tax = 0, images } = product;
    const dispatch = useDispatch();
    const [localQuantity, setLocalQuantity] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const selectedCustomerId = useSelector((state: RootState) => state.customers.selectedCustomerId);


    
    const increaseLocal = () => {
        const newQuantity = localQuantity + 1;
        setLocalQuantity(newQuantity);
        dispatch(addItem({ id, name, quantity: 1, price_with_tax }));
    };

    const decreaseLocal = () => {
        if (localQuantity > 0) {
            const newQuantity = localQuantity - 1;
            setLocalQuantity(newQuantity);
            dispatch(decreaseItem(id));
        }
    };

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    // Verifica si el array de imágenes tiene elementos
    const imageSource =  require('@/assets/default-product.png'); 

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleAccordion} style={styles.header} accessibilityRole="button" accessible={true}>
                <Image
                    source={imageSource}  
                    style={styles.image}
                />
                <Text style={styles.title}>{name}</Text>
                <Feather name={isOpen ? "chevron-up" : "chevron-down"} size={24} color={Colors.textSelection} />
            </TouchableOpacity>

            {isOpen && (
                <View>
                    {description && <Text style={styles.description}>{description}</Text>}
                    
                    {product.isPriceDeferred && <Text style={styles.cost}>Precio aplicado desde lista de precios</Text>}
                    <View style={styles.productContainer}>
                        <Text style={styles.value}>
                            ${price_with_tax && !isNaN(price_with_tax) ? price_with_tax.toFixed(2) : 'N/A'}
                        </Text>
                        {selectedCustomerId &&
                            <View style={styles.quantityContainer}>
                                <TouchableOpacity style={styles.button} onPress={decreaseLocal}>
                                    <Feather name="minus" size={24} color="white" />
                                </TouchableOpacity>
                                <Text style={styles.quantity}>{localQuantity}</Text>
                                <TouchableOpacity style={styles.button} onPress={increaseLocal}>
                                    <Feather name="plus" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                </View>
            )}
        </View>
    );
};

export default ProductCard;