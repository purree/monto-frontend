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
    // TODO: change to actual user...
    let userHref;
    this.storage.get('userHref').then((val) => {
      console.log(val);
      userHref = val;
      let routeData = {
        "routeName": this.routeForm.value.name,
        "description": this.routeForm.value.description,
        "public": this.routeForm.value.public,
        "routeCreator": userHref
      }
      this.api.createRoute(routeData).subscribe(data => {
        console.log(data);
        this.router.navigateByUrl('/list-route');
      });
    });
  }
}
