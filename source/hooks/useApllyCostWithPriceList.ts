import { Customer } from "@/models/customer";
import { Pricelist } from "@/models/pricelist";
import { Product } from "@/models/product";
import { useState, useEffect } from "react";


// Este hook actualizará los precios de los productos con los precios de la lista de precios del cliente
function useApplyCostWithPriceList(client: Customer | null, products: Product[], priceLists: Pricelist[]): Product[] {
  const [updatedProducts, setUpdatedProducts] = useState<Product[]>(products);

  useEffect(() => {
    // Si no hay cliente o no tiene lista de precios asignada, no hacemos nada
    if (!client || !client.price_list_id) {
      setUpdatedProducts(products); // Si no hay lista de precios, devolvemos los productos originales
      return;
    }

    const priceList = priceLists.find(list => list.id === client.price_list_id);
    if (!priceList) {
      setUpdatedProducts(products); // Si no encontramos la lista de precios, devolvemos los productos originales
      return;
    }

    // Actualizamos los precios y costos de los productos según la lista de precios
    const newProducts = products.map(product => {
      const priceListItem = priceList.items.find(item => item.item.id === product.id);
      if (priceListItem) {
        return {
          ...product,
          price_with_tax: priceListItem.price, // Asignamos el precio de la lista de precios
          isPriceDeferred: true, // Indica que el precio viene de la lista de precios

        };
      }
      return product; // Si no está en la lista de precios, mantenemos el precio original
    });

    setUpdatedProducts(newProducts);
  }, [client, priceLists, products]);

  return updatedProducts;
}

export default useApplyCostWithPriceList;
