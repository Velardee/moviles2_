import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { Products } from '../models/product';
import { ComprasService } from '../services/compras.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

import { CarritoService } from "../services/carrito.service";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  public listaProductos: Observable<Products[]>
  @Input() producto: Products;

  constructor(private service: ComprasService,
              public alertCtrl: AlertController,
              public router: Router,
              private carritoS: CarritoService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.listaProductos = this.service.getProducts();
    
  }

  async eliminarProducto(id:string, titulo: string){
    const alert = await this.alertCtrl.create({
      message: `¿Quieres eliminar el producto ${titulo}?`,
      buttons:[
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: cancelar => {
            console.log('Se cancelo la accion');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.service.eliminarProducto(id).then(() => {
              console.log(id);
              this.router.navigateByUrl('');
            })
          }
        }
      ]
    })
    await alert.present();
  }

  addCart(){
    this.carritoS.addCart(this.producto);
  }

}
