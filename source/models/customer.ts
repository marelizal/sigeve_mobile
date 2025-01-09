import { Zone } from "./zone";

export interface Customer {
    name:                  string;
    registered_name:       string;
    phone:                 string;
    email:                 string;
    price_list_id:         number;
    country:               string;
    address:               string;
    allow_self_service:    boolean;
    lat:                   number;
    lng:                   number;
    identification_number: string;
    identification_type:   string;
    days_off_week:         number[];
    tax_category:          string;
    salesman_id:           number;
    zone_id:               number;
    active:                boolean;
    id:                    string;
    zone:                  Zone;
    deleted:               boolean;
    created_at:            Date;
    updated_at:            Date;
}
