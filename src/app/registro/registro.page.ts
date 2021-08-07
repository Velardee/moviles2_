import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from "@angular/router";

import { AlertController } from "@ionic/angular";

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  public name: string;
  public email: string;
  public password: string;

  constructor(private authService: AuthService,
              private router: Router,
              private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  onSubmitRegister(){
    this.authService.register(this.email, this.password, this.name).then( auth => {
      this.presentAlert();
      // this.router.navigate(['/landing'])
    }).catch(err => this.presentAlertErr())
  }

  /*alerta de registro exitoso*/
  async presentAlert() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Registro exitoso',
      message: 'Ir a la pagina de inicio',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigate(['/tabs']);
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlertErr() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Email existente',
      message: 'Ese email ya está siendo utilizado intenta con otro',
      buttons: [
        {
          text: 'OK',
          handler: () => {
          }
        }
      ]
    });

    await alert.present();
  }

}
