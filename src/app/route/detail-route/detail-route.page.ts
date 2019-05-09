import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../api.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

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
  routeForm: FormGroup;


  constructor(
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private formBuilder: FormBuilder) {
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
    this.api.getRoute(this.routeId).subscribe(data => {
      this.route = data;
      this.routeForm = this.formBuilder.group({
        name: [this.route.routeName, Validators.required],
        description: [this.route.description],
        public: this.route.public
      });
      this.api.getRouteCreator(this.route).subscribe(data => {
        this.route.creator = data;
        this.api.getUser().then((userHref) => this.isRouteCreator = userHref == this.route.creator._links.self.href);
      });
      this.api.getRouteAttractions(this.route).subscribe(data => {
        let attractionsResponse = <any>data;
        this.route.attractions = attractionsResponse._embedded.attractions;
        this.route.attractions.forEach(attraction => {
          let selfLink = attraction._links.self.href;
          attraction.id = selfLink.substring(selfLink.lastIndexOf('/'), selfLink.length);
        });
      });
      this.api.getRouteRatings(this.route).subscribe(data => {
        let ratingsResponse = <any>data;
        this.route.ratings = ratingsResponse._embedded.ratings;
      });
    });
    this.api.getMyActiveRoute().then(val => val.subscribe(data => {
      if (data) {
        let activeRouteResonse = <any>data;
        let selfLink = activeRouteResonse._links.self.href;
        this.myActiveRouteId = selfLink.substring(selfLink.lastIndexOf('/') + 1, selfLink.length);
        this.isActive = this.myActiveRouteId == this.routeId;
      }
    }));
  }


  setActiveRoute() {
    this.api.setMyActiveRoute(this.route._links.self.href).subscribe(data => {
      this.isActive = true;
    });
  }

  removeAttractionFromRoute(attractionId) {
    this.api.removeAttractionFromRoute(this.routeId, attractionId).subscribe(data => {
      if (!data) {
        this.route.attractions = this.route.attractions.filter(x => x.id !== attractionId);
      }
    });
  }

}
