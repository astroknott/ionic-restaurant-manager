import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Router } from '@angular/router';
import { BehaviorSubject, from } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = new BehaviorSubject(null);
  
  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, private functions: AngularFireFunctions, private router: Router) {
    this.afAuth.authState.subscribe(async user => {
      console.log('Auth changed', user);

      if (user) {
	this.db.doc(`users/${user.uid}`).valueChanges().pipe(
	  take(1),
	  tap((res: any) => {
	    this.currentUser.next({
	      email: user.email,
	      id: user.uid,
	      name: res.name,
	      role: res.role
	    })
	  })
	)
      }
    })
  }

  signIn({ email, password}) {
    const data = from(this.afAuth.signInWithEmailAndPassword(email, password));
    return data.pipe(
      switchMap(res => {
	console.log("res",res);
	return this.db.doc(`users/${res.user.uid}`).valueChanges();
      }),
      take(1)
    )
  }

  async signOut() {
    await this.afAuth.signOut();
    this.currentUser.next(false);
    this.router.navigateByUrl('/', {replaceUrl: true});
  }
  
  createUser(data: {email, password, role, name}) {
    const callable = this.functions.httpsCallable('addUser');
    
    return callable(data);
  }

  getUsers() {
    return this.db.collection('users').valueChanges({ idField: 'id'});
  }

  deleteUser(id: any) {
    this.db.collection('users').doc(id).delete();
  }
}
