export interface MeasurementUnit {
    created_at:  Date;
    updated_at:  Date;
    id:          number;
    description: string;
    code:        string;
    unit_symbol: string;
    deleted:     boolean;
    active:      boolean;
}