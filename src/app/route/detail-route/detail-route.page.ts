import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../api.service';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { File } from '@ionic-native/file/ngx';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-detail-route',
  templateUrl: './detail-route.page.html',
  styleUrls: ['./detail-route.page.scss'],
})
export class DetailRoutePage implements OnInit {

  isRouteCreator: boolean;
  isActive: boolean;
  myActiveRouteId: any;
  showReviews: boolean = false;
  showAreYouSure: boolean = false;
  route: any;
  text: string;
  url: string;

  routeForm: FormGroup;


  constructor(
    private socialSharing: SocialSharing,
    private file: File,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private formBuilder: FormBuilder,
    private router: Router,
    private auth: AuthService) {
    this.url = window.location.pathname;
  }

  ngOnInit() {
  }

  ionViewWillLeave() {
    if (this.isRouteCreator) {
      let routeData = {
        "routeName": this.routeForm.value.name,
        "description": this.routeForm.value.description,
        "routeIsPublic": this.routeForm.value.public
      }
      console.log(routeData);
      this.api.patchRoute(this.route.id, routeData).subscribe(data => console.log(data));
    }
  }

  ionViewWillEnter() {
    let routeId = this.activatedRoute.snapshot.paramMap.get('id');
    this.api.getRoute(routeId).subscribe(data => {
      this.route = data;
      this.api.getRouteCreator(this.route.id).subscribe(data => {
        this.route.creator = data;
        this.api.getUser().then((userHref) => {
          this.isRouteCreator = userHref == this.route.creator._links.self.href;
          if(this.isRouteCreator) {
            this.routeForm = this.formBuilder.group({
              name: [this.route.routeName, Validators.required],
              description: [this.route.description],
              public: this.route.routeIsPublic
            });
          }
        });
      });
      this.api.getUser().then(userHref => {
        this.api.getMyActiveRoute(userHref).subscribe(data => {
          if (data) {
            let activeRouteResonse = <any>data;
            this.myActiveRouteId = activeRouteResonse.id;
            this.isActive = this.myActiveRouteId == this.route.id;
          }
        }, error => console.log(error));
      });
    });
  }

  initDelete(){
    this.showAreYouSure = true;
  }

  closeAreYouSure() {
    this.showAreYouSure = false;
  }

  deleteRoute() {
    this.api.deleteRoute(this.route.id).subscribe(x => console.log);
    this.router.navigateByUrl('/list-route');
  }

  setActiveRoute() {
    this.api.getUser().then(userHref => {
      this.api.setMyActiveRoute(userHref, this.route.id).subscribe(data => {
        this.isActive = true;
        this.router.navigateByUrl('/home');
      });
    });
  }

  unsetActiveRoute() {
    this.api.getUser().then(userHref => {
      this.api.unsetMyActiveRoute(userHref).subscribe(data => {
        this.isActive = false;
      });
    });
  }

  toggleReviews() {
    this.showReviews = !this.showReviews;
  }

  removeAttractionFromRoute(attractionId) {
    this.api.removeAttractionFromRoute(this.route.id, attractionId).subscribe(data => {
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
