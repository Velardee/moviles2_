import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from 'rxjs';
import { Products } from '../models/product';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

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

}
