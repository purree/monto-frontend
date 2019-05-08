import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../api.service';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-detail-route',
  templateUrl: './detail-route.page.html',
  styleUrls: ['./detail-route.page.scss'],
})
export class DetailRoutePage implements OnInit {

  private route: any;
  private routeId: any;
  private userHref: any;

  constructor(private activatedRoute: ActivatedRoute, private api: ApiService, private storage:Storage) { }

  ngOnInit() {
    this.storage.get('userHref').then((userHref) => {
      this.userHref = userHref;
    });
  }

  ionViewWillEnter() {
    this.routeId = this.activatedRoute.snapshot.paramMap.get('id');
    this.api.getRoute(this.routeId).subscribe(data => {
      this.route = data;
      this.api.getRouteCreator(this.route).subscribe(data => this.route.creator = data);
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
  }


  setActiveRoute() {
    this.api.setMyActiveRoute(this.route._links.self.href).subscribe(data => {
      console.log(data);
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
