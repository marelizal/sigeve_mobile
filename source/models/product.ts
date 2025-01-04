import { Category } from "./category";
import { MeasurementUnit } from "./measurement";

export interface Product {
    name:                   string;
    productType:            string;
    price:                  number;
    cost:                   number;
    iva:                    number;
    profitability:          number;
    minUnitForBonification: number;
    description:            string;
    bonificationType:       string;
    bonification:           number;
    SKU:                    string;
    bar_code:               string;
    stock_min:              number;
    stock_trigger_level:    number;
    category_id:            number;
    is_combo:               boolean;
    images:                 string[];
    active:                 boolean;
    deleted:                boolean;
    id:                     number;
    category:               Category;
    stock:                  number;
    price_with_tax:         number;
    price_without_tax:      number;
    tax_amount:             number;
    measurement_unit_id:    number;
    measurement_unit:       MeasurementUnit;
    created_at:             Date;
    updated_at:             Date;
}