import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { ComprasService } from '../services/compras.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public createProductForm: FormGroup;

  constructor( public loadingCtrl:LoadingController,
    public alertCtrl: AlertController,
    private service: ComprasService,
    formBuilder: FormBuilder,
    private router: Router) {

      this.createProductForm =  formBuilder.group({
        titulo:['', Validators.required],
        descripcion: ['', Validators.required],
        precio: ['', Validators.required],
        descuento: ['', Validators.required],
        imagenes: ['', Validators.required],
      })
    }

    async crearProducto(){

      const loading = await this.loadingCtrl.create();

      const titulo = this.createProductForm.value.titulo;
      const descripcion = this.createProductForm.value.descripcion;
      const precio = this.createProductForm.value.precio;
      const descuento = this.createProductForm.value.descuento;
      const imagenes = [this.createProductForm.value.imagenes];

      this.service.createProduct(titulo, descripcion, precio, descuento, imagenes)
      .then(
        () => {
          loading.dismiss().then(() => {
            this.router.navigateByUrl('');
          });
        },
        error =>{
          loading.dismiss().then(() => {
            console.log(error);
          });
        }
      )

      return await loading.present();

    }

}
