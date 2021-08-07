import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private db: AngularFirestore) { }


  createDoc(data: any, path: string, id: string){
    const collection = this.db.collection(path);
    return collection.doc(id).set(data);
  }

  getDoc<tipo>(path: string, id: string){
    const collection = this.db.collection<tipo>(path);
    return collection.doc(id).valueChanges();
  }

  updateDoc(data: any, path: string, id: string){
    const collection = this.db.collection(path);
    return collection.doc(id).update(data);
  }

  getCollection<tipo>(path: string){
    const collection = this.db.collection<tipo>(path);
    return collection.valueChanges();
  }

  getUid(){
    return this.db.createId();
  }

  deleteDoc(path: string, id:string){
    const collection = this.db.collection(path);
    return collection.doc(id).delete();
  }

}
