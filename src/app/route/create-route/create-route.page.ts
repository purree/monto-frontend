import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../../api.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-create-route',
  templateUrl: './create-route.page.html',
  styleUrls: ['./create-route.page.scss'],
})
export class CreateRoutePage implements OnInit {

  routeForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private router: Router,
    private storage: Storage) {
    this.routeForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      public: [false]
    })
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.routeForm.invalid) {
      return;
    }
    this.storage.get('userHref').then((userHref) => {
      let routeData = {
        "routeName": this.routeForm.value.name,
        "description": this.routeForm.value.description,
        "routeIsPublic": this.routeForm.value.public,
        "routeCreator": userHref
      }
      'http://localhost:8080/routes/12/ratings'
      this.api.createRoute(routeData).subscribe(() => this.router.navigateByUrl('/list-route'));
    });
  }
}
