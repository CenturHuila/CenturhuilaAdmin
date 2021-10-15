import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class TownshipsService {

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}
  // Crea un nuevo dato
  public createOrEdite(data: any, document: string): any {
    return this.firestore.collection(environment.collection.townships).doc(document).set(data);
  }
  // Eliminar un dato
  public delete(document: string): any {
    return this.firestore.collection(environment.collection.townships).doc(document).delete();
  }
//   // Obtiene un dato
//   public getbyId(documentId: string, collection: string): any {
//     return this.firestore
//       .collection(collection)
//       .doc(documentId)
//       .snapshotChanges();
//   }
//   // Obtiene todos los datos
  public get(): any {
    return this.firestore
      .collection(environment.collection.townships)
      .snapshotChanges();
  }
//   // Actualiza un dato
//   public update(documentId: string, data: any, collection: string): any {
//     return this.firestore.collection(collection).doc(documentId).set(data);
//   }

//   // Tarea para subir archivo
//   public tareaCloudStorage(nombreArchivo: string, datos: any): any {
//     return this.storage.upload(nombreArchivo, datos);
//   }

//   // Referencia del archivo
//   public referenciaCloudStorage(nombreArchivo: string): any {
//     return this.storage.ref(nombreArchivo);
//   }
}