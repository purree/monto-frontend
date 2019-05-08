import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-list-route',
  templateUrl: './list-route.page.html',
  styleUrls: ['./list-route.page.scss'],
})
export class ListRoutePage implements OnInit {

  private routes: any;
  private myActiveRouteId: any;
  private segment: any = "All";

  constructor(private api: ApiService) {
    this.getDefualtRoutes();
  }

  ionViewWillEnter() {
    this.api.getMyActiveRoute().then(val => val.subscribe(data => {
      if(data){
        let activeRouteResonse = <any> data;
        let selfLink = activeRouteResonse._links.self.href;
        this.myActiveRouteId = selfLink.substring(selfLink.lastIndexOf('/'), selfLink.length);
      }
    }));
  }

  ngOnInit() {
  }

  getDefualtRoutes() {
    this.api.getRoutes().subscribe(data => {
      let routesResponse = <any>data;
      this.routes = routesResponse._embedded.routes;
      this.routes.forEach(route => {
        let selfLink = route._links.self.href;
        route.id = selfLink.substring(selfLink.lastIndexOf('/'), selfLink.length);
      });
    });
  }

  getMyRoutes() {
    this.api.getMyRoutes().subscribe(data => {
      let routesResponse = <any>data;
      this.routes = routesResponse._embedded.routes;
      this.routes.forEach(route => {
        let selfLink = route._links.self.href;
        route.id = selfLink.substring(selfLink.lastIndexOf('/'), selfLink.length);
      });
    });
  }

  searchRoutes() {
    // TODO: implement search by route
    // this.api.searchRoutes
  }

  segmentChanged($event) {
    this.segment = $event.target.value;
    if (this.segment == 'My') {
      this.getMyRoutes();
    } else {
      this.getDefualtRoutes();
    }
  }

}
