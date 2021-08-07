import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

import { Stripe } from '@ionic-native/stripe/ngx';
import { environment } from '../../environments/environment';
import { ComprasService } from "../services/compras.service";

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  public cardNumber: string= "4242424242424242";
  public mes: string= "11";
  public anio: string= "2021";
  public codigo: string= "221";
  public nombre: string= "Hugo Velarde";
  deshabilitarBoton: boolean = false;
  public loading;

  credencialesTarjeta: any = {};

  constructor( public alertController: AlertController,
                private stripe: Stripe,
                public loader: LoadingController,
                public servicio: ComprasService) { }

  ngOnInit() {
    
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
      
      let cantidad = 100 * 100;
      console.log(JSON.stringify(token));
      this.presentarAlert("Ok", `Token: ${token.id}`);

      this.servicio.completarPago(cantidad, "MXN", token.id, "Mi Primer pago con stripe");
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

}