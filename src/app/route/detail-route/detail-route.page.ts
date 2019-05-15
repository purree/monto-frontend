import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../api.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-detail-route',
  templateUrl: './detail-route.page.html',
  styleUrls: ['./detail-route.page.scss'],
})
export class DetailRoutePage implements OnInit {

  private route: any;
  private routeId: any;
  private myActiveRouteId: any;
  private isRouteCreator: any;
  private isActive: boolean;
  private text: string;
  private url: string;

  routeForm: FormGroup;


  constructor(
    private socialSharing: SocialSharing,
    private file: File,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private formBuilder: FormBuilder) {
    this.url = window.location.pathname;
  }

  ngOnInit() {
  }

  ionViewWillLeave() {
    let routeData = {
      "routeName": this.routeForm.value.name,
      "description": this.routeForm.value.description,
      "public": this.routeForm.value.public
    }
    this.api.patchRoute(this.routeId, routeData).subscribe(data => console.log(data));
  }

  ionViewWillEnter() {
    this.routeId = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.activatedRoute.snapshot);
    this.api.getRoute(this.routeId).subscribe(data => {
      this.route = data;
      //this.route.attractions = this.route._embedded.attractions;
      this.routeForm = this.formBuilder.group({
        name: [this.route.routeName, Validators.required],
        description: [this.route.description],
        public: this.route.public
      });
      /*this.api.getRouteCreator(this.route).subscribe(data => {
        this.route.creator = data;
        this.api.getUser().then((userHref) => this.isRouteCreator = userHref == this.route.creator._links.self.href);
      });
      this.api.getRouteRatings(this.route).subscribe(data => {
        let ratingsResponse = <any>data;
        this.route.ratings = ratingsResponse._embedded.ratings;
      });*/
    });
    this.api.getUser().then(userHref => {
      this.api.getMyActiveRoute(userHref).subscribe(data => {
        if (data) {
          let activeRouteResonse = <any>data;
          this.myActiveRouteId = activeRouteResonse.id;
          this.isActive = this.myActiveRouteId == this.routeId;
        }
      });
    })
  }

  setActiveRoute() {
    this.api.getUser().then(userHref => {
      this.api.setMyActiveRoute(userHref, this.route._links.self.href).subscribe(data => {
        this.isActive = true;
      });
    });
  }

  removeAttractionFromRoute(attractionId) {
    this.api.removeAttractionFromRoute(this.routeId, attractionId).subscribe(data => {
      if (!data) {
        this.route.attractions = this.route.attractions.filter(x => x.id !== attractionId);
      }
    });
  }


  async shareTwitter() {
    // Either URL or Image
    this.socialSharing.shareViaTwitter(null, null, this.url).then(() => {
      // Success
    }).catch((e) => {
      // Error!
    });
  }

  async shareWhatsApp() {
    // Text + Image or URL works
    this.socialSharing.shareViaWhatsApp(this.text, null, this.url).then(() => {
      // Success
    }).catch((e) => {
      // Error!
    });
  }

  async resolveLocalFile() {
    return this.file.copyFile(`${this.file.applicationDirectory}www/assets/imgs/`, 'academy.jpg', this.file.cacheDirectory, `${new Date().getTime()}.jpg`);
  }

  removeTempFile(name) {
    this.file.removeFile(this.file.cacheDirectory, name);
  }

  async shareEmail() {
    //let file = await this.resolveLocalFile();
    console.log('im here!');
    this.socialSharing.shareViaEmail(this.text, 'My custom subject', ['saimon@devdactic.com'], null, null, null/*file.nativeURL*/).then((any) => {
      //this.removeTempFile(file.name);
      console.log('Now im here: ' + any);
    }).catch((e) => {
      console.log(e);
      // Error!
    });
  }

  async shareFacebook() {
    let file = await this.resolveLocalFile();

    // Image or URL works
    this.socialSharing.shareViaFacebook(null, file.nativeURL, null).then(() => {
      this.removeTempFile(file.name);
    }).catch((e) => {
      // Error!
    });
  }
}
