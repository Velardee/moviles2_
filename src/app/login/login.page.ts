import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { AlertController } from "@ionic/angular";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  password: string;
  email: string;

  constructor( private authService: AuthService,
               public router: Router,
               private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  
  onSubmitLogin(){
    this.authService.login(this.email, this.password).then( res => {
      this.router.navigate(['/tabs'])
    }).catch(err => this.presentAlert())
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Alerta',
      subHeader: 'Usuario o contraseña incorrectos',
      message: 'Intentalo nuevamente',
      buttons: ['OK']
    });

    await alert.present();
  }


}
