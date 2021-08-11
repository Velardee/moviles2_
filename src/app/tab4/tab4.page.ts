import { Component, Input, OnInit,  } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

import { Stripe } from '@ionic-native/stripe/ngx';
import { environment } from '../../environments/environment';
import { ComprasService } from "../services/compras.service";
import { Router, ActivatedRoute } from '@angular/router';
import { CarritoPage } from '../carrito/carrito.page';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  public cardNumber: string= "";
  public mes: string= "";
  public anio: string= "";
  public codigo: string= "";
  public nombre: string= "";
  deshabilitarBoton: boolean = false;
  public loading;

  total: any;


  credencialesTarjeta: any = {};

  constructor( public alertController: AlertController,
                private stripe: Stripe,
                public loader: LoadingController,
                public servicio: ComprasService,
                private router: Router,
                private activedRouter: ActivatedRoute) { }

  ngOnInit() {
    this.total = this.activedRouter.snapshot.paramMap.get('id');
    console.log(this.total);
  }


  separarNumero(){
    let nuevoNumero = this.cardNumber.toString().replace(/\d{4}(?=.)/g,'$& ');
    return nuevoNumero;
  }

  async presentLoading(){
    this.loading = await this.loader.create({
      message: "Tramitando pago..."
    });
    await this.loading.present();
  }

  async dismissLoading(){
    await this.loading.dismiss();
  }

  async pagarConStripe(){

    await this.presentLoading();
    this.deshabilitarBoton = true;

    this.stripe.setPublishableKey(environment.stripeKey);

    this.credencialesTarjeta = {
      number: this.cardNumber,
      expMonth: this.mes,
      expYear: this.anio,
      cvc: this.codigo
    }
    this.stripe.createCardToken(this.credencialesTarjeta)
    .then(token => {
      
      let cantidad = this.total * 100;
      console.log(JSON.stringify(token));
      this.presentarAlert("Ok", `Token: ${token.id}`);

      this.servicio.completarPago(cantidad, "MXN", token.id, "Pago exitoso");
    })
    .catch(error => {
      console.log(JSON.stringify(error));
      this.presentarAlert("Error", error);
    })
    .finally(() => {
      this.deshabilitarBoton = false;
      this.dismissLoading();
    })
  }

  async presentarAlert(encabezado: string, mensaje:string){
    const alert = await this.alertController.create({
      header:encabezado,
      message:mensaje,
      buttons: ['Aceptar']
    });

    await alert.present();

    const {role} = await alert.onDidDismiss();
    console.log('El evento cerrar fue resuelto por el evento role:', role)

  }

  onClick(){
    alert("Hola word");
  }

  returnCarrito(){
    this.router.navigateByUrl('')
  }

}