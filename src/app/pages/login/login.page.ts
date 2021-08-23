import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentialForm: FormGroup;
  
  constructor(private fb: FormBuilder,
	      private router: Router,
	      private alertController: AlertController,
	      private loadingController: LoadingController,
	      private authService: AuthService) { }

  ngOnInit() {
    this.credentialForm = this.fb.group({
      email: [ '', [ Validators.required, Validators.email ] ],
      password: [ '', [ Validators.required, Validators.minLength(6) ] ]
    });
  }

  async signIn() {
    const loading = await this.loadingController.create();
    await loading.present();
    
    this.authService.signIn(this.credentialForm.value).subscribe((user: any) => {
      console.log('after sign in: ', user);
      loading.dismiss();

      if (user.role == 'ADMIN') {
	this.router.navigateByUrl('/admin', { replaceUrl: true })
      } else {
	this.router.navigateByUrl('/orders', { replaceUrl: true })
      }
    }, async err => {
      loading.dismiss();

      const alert = await this.alertController.create({
	header: ':(',
	message: err.message,
	buttons: [ 'OK' ],
      });

      await alert.present();
    })
  }
  
}
