import { Product } from "./product";

export interface Pricelist {
    id:          number;
    code:        string;
    description: string;
    active:      boolean;
    items:       ItemElement[];
}

export interface ItemElement {
    item:  Product;
    price: number;
}