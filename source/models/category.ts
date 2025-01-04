export interface Category {
    created_at:         Date;
    updated_at:         Date;
    id:                 number;
    name:               string;
    deleted:            boolean;
    active:             boolean;
    available_online:   boolean;
    image:              string;
    description:        string;
    parent_category_id: number;
}