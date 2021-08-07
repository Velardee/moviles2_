import { Injectable } from '@angular/core';
import { Products } from '../models/product';
import { Orden, ProductoPedido } from '../models/orden';
import { AuthService } from '../services/auth.service';

import{ FirestoreService } from '../services/firestore.service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private orden: Orden;
  path = 'carrito/';
  uid = '';
  user: User;

  constructor(public firestore: FirestoreService,
              private firebaseAuth: AuthService,
              public router: Router) {

    this.firebaseAuth.stateAuth().subscribe(res => {
      console.log(res);
      if (res !== null){
          this.uid = res.uid;
          this.loadUser();
        // this.getUserInfo(this.uid);
      }
    })

  }

  loadCart(){
    const path = 'users/'  + this.uid + '/' + 'carrito';
    console.log(this.user)
    this.firestore.getDoc<Orden>(path, this.uid).subscribe( res => {
      console.log(res);
      if (res){
        this.orden = res;

      } else {
        this.initCart();
      }

    })
  }

  initCart(){
    this.orden = {
      id: this.uid,
      user: this.user,
      precioTotal: null,
      productos: [],
      fecha: new Date
    }
  }

  loadUser(){
    const path = 'users';
    this.firestore.getDoc<User>(path, this.uid).subscribe( res => {
        this.user = res;
        console.log(res)
        this.loadCart();
    });
  }

  addCart(product: Products){
    console.log('Add pedido -->', this.uid);
    if (this.uid.length){
      const item = this.orden.productos.find( productoPedido => {
        return (productoPedido.producto.id === product.id)
      });
      if (item !== undefined) {
        item.cantidad ++;
      } else {
        const add: ProductoPedido = {
          cantidad: 1,
          producto: product
        }
        this.orden.productos.push(add);
      }
    } else {
      // this.router.navigate(['/login']);
    }
    console.log('Add pedido -->', this.orden);
    const path = 'users/' + this.uid + '/' + this.path;
    this.firestore.createDoc(this.orden, path, this.uid).then( () => {
      console.log('Añadido con exito')
    })
  } 


}
