import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators'
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { EventEmitter } from 'stream';
@Injectable()
export class UsersService {

  // public user: User

  constructor(public afAuth: AngularFireAuth,
    private router: Router)
     { }
  async login(email: string, password: string) {
    console.log(email + ' entro al get')
    await this.afAuth.signInWithEmailAndPassword(email, password)
    .then(value => {
      console.log('enytto')
      this.router.navigateByUrl('prestadores-turisticos');
    })
    .catch(err => {
      console.log('Something went wrong: ', err.message);
    });
  }

  async register(email:string, password:string){
    await this.afAuth.createUserWithEmailAndPassword(email, password)
    .then(value => {
  
      this.router.navigateByUrl('');
    })
    .catch(err => {
      console.log('Something went wrong: ', err.message);
    });
  }

  async logout(){
   await this.afAuth.signOut().then(() =>{
     this.router.navigate(['/login'])
   });

  }

  getCurrentUser(){
    return this.afAuth.authState.pipe(first()).toPromise();
  }

}
