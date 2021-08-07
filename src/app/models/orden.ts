import { Products } from './product';
import { User } from './user';

export interface Orden {
    id: string;
    user: User;
    precioTotal: number;
    productos: ProductoPedido[];
    fecha: Date;
}

export interface ProductoPedido {
    producto: Products;
    cantidad: number;
}