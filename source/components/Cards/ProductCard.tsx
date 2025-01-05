import React, { useState, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { Product } from '@/models/product';
import { RootState } from '@/redux/store';
import { addToCart, removeFromCart } from '@/redux/slices/cart.slice';
import defautl_product_image from '@/assets/default-product.png'
import { Colors } from '@/constants/Colors';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const dispatch = useDispatch();
    const selectedCustomerId = useSelector((state: RootState) => state.customers.selectedCustomerId);
    const customers = useSelector((state: RootState) => state.customers.customers);
    const priceLists = useSelector((state: RootState) => state.priceList.priceLists);
    const cartItems = useSelector((state: RootState) => state.cart.items);

    const cartItem = cartItems.find(item => item.product.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    const selectedCustomer = useMemo(() => {
        return customers.find(customer => customer.id === selectedCustomerId);
    }, [customers, selectedCustomerId]);

    const productPrice = useMemo(() => {
        if (selectedCustomer) {
            const customerPriceList = priceLists.find(pl => pl.id === selectedCustomer.price_list_id);
            if (customerPriceList) {
                const priceListItem = customerPriceList.items.find(item => item.item.id === product.id);
                if (priceListItem) {
                    return priceListItem.price;
                }
            }
        }
        return product.price_with_tax;
    }, [selectedCustomer, priceLists, product]);

    const handleIncrement = () => {
        if (selectedCustomerId) {
            dispatch(addToCart({ ...product, price_with_tax: productPrice }));
        }
    };

    const handleDecrement = () => {
        if (selectedCustomerId && quantity > 0) {
            dispatch(removeFromCart(product.id));
        }
    };

    return (
        <View style={styles.card}>
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={styles.header}>
                <Image
                    source={product.images && product.images.length > 0
                        ? { uri: product.images[0] }
                        : defautl_product_image}
                    style={styles.image}
                />
                <Text style={styles.name}>{product.name}</Text>
                <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} color={Colors.textSelection} />
            </TouchableOpacity>
            {isExpanded && (
                <View style={styles.content}>
                    <Text style={styles.description}>{product.description}</Text>
                    <View style={styles.quantityContainer}>
                        <Text style={styles.price}>${productPrice.toFixed(2)}</Text>
                       {selectedCustomerId && ( <View style={styles.quantityContainer}>
                            <TouchableOpacity onPress={handleDecrement} disabled={!selectedCustomerId || quantity === 0}>
                                <Ionicons name="remove-circle-outline" size={24} color={selectedCustomerId ? "black" : "gray"} />
                            </TouchableOpacity>
                            <Text style={styles.quantity}>{quantity}</Text>
                            <TouchableOpacity onPress={handleIncrement} disabled={!selectedCustomerId}>
                                <Ionicons name="add-circle-outline" size={24} color={selectedCustomerId ? "black" : "gray"} />
                            </TouchableOpacity>
                        </View>)} 
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 16,
    },
    name: {
        flex: 1,
        fontSize: 16,
    },
    content: {
        padding: 8,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    description: {
        marginBottom: 2,
    },
    price: {
        fontWeight: 'bold',
        color:Colors.textSelection,
        fontSize: 16,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    quantity: {
        fontSize: 18,
        marginHorizontal: 16,
    },
});

export default ProductCard;

