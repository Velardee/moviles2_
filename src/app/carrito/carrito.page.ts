import { Component, OnInit } from '@angular/core';
import { Producto } from '../models/product';
import { ComprasService } from '../services/compras.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Total } from '../models/orden';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {

  cart: Producto[] = [];
  total: number;

  constructor(private service: ComprasService,
              private router: Router,
              private modalCtrl: ModalController) { }

  ngOnInit() {
    this.cart = this.service.getCarrito();
  }

  restarItem(product){
    this.service.decreaseProduct(product);
  }

  sumarItem(product){
    this.service.addProducto(product);
  }

  removeItemCart(product){
    this.service.removeProduct(product);
  }

  getTotal(){
    return this.total = this.cart.reduce((i, j) => i + j.precio * j.qty, 0), console.log(this.total);
  }

  close(){
    this.modalCtrl.dismiss();
  }

  pagar(){
    this.close();
    this.router.navigate(['/tab4', this.total]);
  }

}
