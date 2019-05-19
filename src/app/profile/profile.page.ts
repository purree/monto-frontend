import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';


@Component({
    selector: 'app-profile',
    templateUrl: 'profile.page.html',
    styleUrls: ['profile.page.scss'],
  })
export class ProfilePage {

  user:any;

  constructor(private http: HttpClient, private storage:Storage) {
  }

  ngOnInit() {
    this.storage.get('userHref').then((userHref) => {
      this.http.get(userHref).subscribe(data => this.user = data);
    });
  }
}