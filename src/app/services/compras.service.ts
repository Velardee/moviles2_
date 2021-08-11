import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { BehaviorSubject, Observable } from 'rxjs';
import { Products, Producto } from '../models/product';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  data: Producto[] = [
    {
      id: 1,
      titulo: 'Kimetsu no Yaiba 6',
      descripcion: 'la batalla con los demonios araña termina, y un cuervo da la orden de que capturen a Tanjiro y a Nezuko y los lleven al Cuartel General de la Compañía.',
      imagen: 'https://images-na.ssl-images-amazon.com/images/I/51PemHA31qL._SX315_BO1,204,203,200_.jpg' ,
      precio: 120,
      qty: 1
    },
    {
      id: 2,
      titulo: 'Jujutsu Kaisen 2',
      descripcion: 'En medio de la misión, Yuji cambia de lugar con Sukuna, quien derrota con facilidad a la maldición de grado especial.',
      imagen: 'https://images-na.ssl-images-amazon.com/images/I/51gsGzYsZML._SX320_BO1,204,203,200_.jpg' ,
      precio: 110,
      qty: 1
    },
    {
      id: 3 ,
      titulo: 'Naruto 72',
      descripcion: 'De una dimensión a otra, de un mundo a otro, Naruto y Sasuke buscan la manera de vencer a Kaguya, la diosa que un día se transformó en demonio y que ahora busca recuperar el chakra que sus hijos le robaron.',
      imagen: 'https://images-na.ssl-images-amazon.com/images/I/51FIlmfgGxL._SX317_BO1,204,203,200_.jpg' ,
      precio: 99,
      qty: 1
    }
  ]

  private cart = []
  private cartCount = new BehaviorSubject(0);

  constructor( public firestore: AngularFirestore,
                public http: HttpClient) { }

  getProducts(): Observable <Products[]>{
    return this.firestore.collection<Products>('ListaProductos').valueChanges();
  }

  createProduct(
    titulo: string,
    descripcion: string,
    precio: number,
    descuento: number,
    imagenes: string[]
  ):Promise<void>{
    const id = this.firestore.createId();

    return this.firestore.doc(`ListaProductos/${id}`).set({
      id,
      titulo,
      descripcion,
      precio,
      descuento,
      imagenes
    });

  }

  eliminarProducto(id: string): Promise<void>{
    console.log(`ListaProductos/${id}`);
    return this.firestore.doc(`ListaProductos/${id}`).delete();
  }


  completarPago(cantidad: number, moneda: string, tokenID: string, descripcion: string){
    this.http.post(environment.stripeUrlApi, {
      "amount": cantidad,
      "currency": moneda,
      "token": tokenID,
      "descripcion": descripcion,
      "customer": {
        name: "Hugo Velarde",
        phone: "6182958802",
        address: "Las vegas",
        email: "hugovela15@gmail.com"
      }
    })
    .subscribe(
      (data) => {
        console.log('*****API RESPONSE******');
        console.log(JSON.stringify(data));
      },
        (error) => {
          console.log('*****API RESPONSE ERROR******');
          console.log(JSON.stringify(error));
        })
  }

  getProducto(){
    return this.data;
  }

  getCarrito(){
    return this.cart;
  }

  getCartCount(): BehaviorSubject<number> {
    return this.cartCount;
  }

  addProducto(product) {
    let added = false;
    for (let p of this.cart) {
      if(p.id === product.id){
        p.qty += 1;
        added = true;
        break;
      }
    }
    if (!added){
      product.qty = 1;
      this.cart.push(product);
    }
    this.cartCount.next(this.cartCount.value + 1);
  }

  decreaseProduct(product) {
    for (const [index, item] of this.cart.entries()){
      if(item.id === product.id){
        item.qty -= 1;
        if (item.qty === 0){
          this.cart.splice(index, 1);
        }
      }
    }
    this.cartCount.next(this.cartCount.value -1);
  }

  removeProduct(product){
    for (const [index, item] of this.cart.entries()) {
      if (item.id === product.id){
        this.cartCount.next(this.cartCount.value - item.qty);
        this.cart.splice(index, 1);
      }
    }
  }


}
