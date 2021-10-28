import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ZonesService {

  constructor(private firestore: AngularFirestore,
    private storage: AngularFireStorage
    ) { }

    public get(): any {
      return this.firestore
        .collection(environment.collection.zones)
        .snapshotChanges();
    }
}
