import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-list-route',
  templateUrl: './list-route.page.html',
  styleUrls: ['./list-route.page.scss'],
})
export class ListRoutePage implements OnInit {

  private routes: any;

  constructor(private api: ApiService) {
    this.getDefualtRoutes();
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

  searchRoutes() {
    // TODO: implement search by route
    // this.api.searchRoutes
  }

}
