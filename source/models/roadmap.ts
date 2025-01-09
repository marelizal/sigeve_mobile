export interface Destination {
    customer: string;
    order: string;
    zone: string;
    address: string;
    type: string;
    vehicle: string;
    _id: string;
    visited?: boolean; // Añadido para rastrear si el destino ha sido visitado
  }
  
  export interface Roadmap {
    name: string;
    start: string;
    status: string;
    deleted: boolean;
    active: boolean;
    destinations: Destination[];
    createdAt: string;
    updatedAt: string;
    id: string;
    observations?: string; // Añadido para almacenar observaciones al finalizar la ruta
  }
  
  