import { Component, OnInit } from '@angular/core';
import { PushNotification, 
        PushNotificationActionPerformed, 
        PushNotificationToken, 
        PushNotificationSchema, 
        PushNotifications
} from "@capacitor/push-notifications";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  constructor() {}

  ngOnInit():void{
    //Pedir permisos
    PushNotifications.requestPermissions().then(result => {
      if(result.receive === 'granted'){
        //Registrar notificaciones
        PushNotifications.register();
      }
      else{
        console.log('Error no se tienen permisos');
      }
    });

    PushNotifications.addListener('registration', (token: PushNotificationToken)=> {
      alert('Registro exitoso, token:' + token.value);
    });

    PushNotifications.addListener('registrationError', (error:any) => {
      alert('Error de registro' + JSON.stringify(error));
    });

    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      alert('Notificacion recibida: ' + JSON.stringify(notification));
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification: PushNotificationActionPerformed) => {
      alert('La accion fue ejecutada correctamente:' + JSON.stringify(notification));
    });

  }

}
