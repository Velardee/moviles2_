import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private AFauth: AngularFireAuth,
              private router: Router,
              private db: AngularFirestore) { }


    login(email:string, password:string){

    return new Promise((resolve, rejected) => {
      this.AFauth.signInWithEmailAndPassword(email, password).then(user => {
        resolve(user)
      }).catch(err => rejected(err));
    });
  }

  logOut(){
    this.AFauth.signOut().then(() => {
      this.router.navigate(['/login']);
    })
  }

  register(email:string, password:string, name:string){
    return new Promise((resolve, rejected) => {
      this.AFauth.createUserWithEmailAndPassword(email, password).then(res => {
        // console.log(res.user.uid);
        const id = res.user.uid;
        this.db.collection('users').doc(id).set({
          name : name,
          uid :id, 
        });

        /*Creacion de sub coleccion*/ 
        
        // this.db.collection('users').doc(id).collection('userSettings').doc(id).set({
        //   recordatorio: 21,
        //   preparacion: 15,
        //   recuperacion: 30,
        //   uid: id,
        // });

        resolve(res);
      }).catch(err => rejected(err))

    })
  }

  resetPassword(email:string){
    return this.AFauth.sendPasswordResetEmail(email);
  }

  stateAuth(){
    return this.AFauth.authState;
  }
}
