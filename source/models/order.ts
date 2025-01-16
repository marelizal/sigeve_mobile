export interface Order {
    delivery_date:     Date;        // Fecha de actual
    discount:          number;      // opcional
    customer_id:       number;     // cliente
    order_items:       OrderItem[];  //items
    payment_method_id: number;    //method
    platform:          string;   // MOBILE_APP
    signal:            number;   // señal del telefono al momento de enviar el pedido
    lat:               number;   // 
    lng:               number;
    battery:           number;
    vendor:            number; // usuario que hizo la venta 
    timestamp:         Date;   // 
}

export interface OrderItem {
    item_id:       number;
    quantity:      number;
    price:         number;
    price_list_id?: number; // Opcional
}