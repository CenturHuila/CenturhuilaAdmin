import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FirebaseApp } from '@angular/fire';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(
    private firestore: AngularFirestore,
  ) { }

  public get(): any {
    return this.firestore
      .collection(environment.collection.services)
      .snapshotChanges();
  }
}
