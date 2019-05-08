import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-detail-route',
  templateUrl: './detail-route.page.html',
  styleUrls: ['./detail-route.page.scss'],
})
export class DetailRoutePage implements OnInit {

  private route: any;

  constructor(private activatedRoute: ActivatedRoute, private api: ApiService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    let routeId = this.activatedRoute.snapshot.paramMap.get('id');
    this.api.getRoute(routeId).subscribe(data => {
      this.route = data;
      this.api.getRouteCreator(this.route).subscribe(data => this.route.creator = data);
      this.api.getRouteAttractions(this.route).subscribe(data => {
        let attractionsResponse = <any>data;
        this.route.attractions = attractionsResponse._embedded.attractions;
      });
      this.api.getRouteRatings(this.route).subscribe(data => {
        let ratingsResponse = <any>data;
        this.route.ratings = ratingsResponse._embedded.ratings;
      });
    });
  }

}
