export interface Products {
    id: string;
    titulo: string;
    descripcion: string;
    imagenes: string[];
    precio: number;
    descuento: number;
}

export interface Producto {
    id: number;
    titulo: string;
    descripcion: string;
    precio: number;
    imagen: string;
    qty: number;
}