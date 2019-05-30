import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { MenuController } from '@ionic/angular';

import { apiUrl } from '../../environments/environment';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  user: any;
  userForm: FormGroup;


  constructor(
    private menuCtrl: MenuController,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private router: Router,
    private storage: Storage) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
    this.storage.get('user').then((user) => {
      this.user = user;
      console.log(this.user);
      this.userForm = this.formBuilder.group({
        username: [this.user.displayName, Validators.required],
        email: [{ value: this.user.email, disabled: true }]
      });
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.userForm.invalid) {
      return;
    }
    let userData = {
      'username': this.userForm.value.username,
      'email': this.user.email
    };
    this.api.createUser(userData).subscribe(response => {
      let userRes = <any>response;
      console.log('Create User' + response);
      console.log('User Res' + userRes.id);

      this.storage.set('user',
        {
          ...this.user,
          'id': userRes.id,
          'username': userRes.username
        });
      this.storage.set('userHref', `${apiUrl}/users/${userRes.id}`).  then(() => this.router.navigateByUrl('/home'));
    });
  }

}
