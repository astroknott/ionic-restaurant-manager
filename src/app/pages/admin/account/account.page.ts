import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  credentialForm: FormGroup;
  
  constructor(private fb: FormBuilder,
	      private router: Router,
	      private alertController: AlertController,
	      private loadingController: LoadingController,
	      private toastController: ToastController,
	      private authService: AuthService) { }

  ngOnInit() {
    this.credentialForm = this.fb.group({
      email: [ '', [ Validators.required, Validators.email ] ],
      password: [ '', [ Validators.required, Validators.minLength(6) ] ],
      role: [ 'SERVICE', [ Validators.required ] ],
      name: [ '', [ Validators.required ] ]
    });
  }

  async createUser() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.createUser(this.credentialForm.value).subscribe(async (res: any) => {
      loading.dismiss();
      console.log('RESULT: ', res);
      const toast = await this.toastController.create({
	message: 'User created.',
	duration: 2000
      });
      toast.present();
      this.router.navigateByUrl('/admin');
      
    }, async err => {
      loading.dismiss();

      const alert = await this.alertController.create({
	header: 'Error',
	message: err.message,
	buttons: [ 'OK' ]
      });

      await alert.present();
    })
  }

}
