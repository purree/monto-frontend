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
  private searchTerm: string = '';
  private segment: any = "All";

  constructor(private api: ApiService) {
  }

  ionViewWillEnter() {
    this.api.getUser().then(userHref => {
      this.api.getMyActiveRoute(userHref).subscribe(data => {
        if (data) {
          let activeRouteResonse = <any>data;
          this.myActiveRouteId = activeRouteResonse.id;
        }
        this.getDefualtRoutes();
      });
    });
  }

  ngOnInit() {
  }

  getDefualtRoutes() {
    this.api.getRoutes().subscribe(data => {
      let routesResponse = <any>data;
      this.routes = routesResponse._embedded.routes;
    });
  }

  getMyRoutes() {
    this.api.getUser().then(userHref => {
      this.api.getMyRoutes(userHref).subscribe(data => {
        let routesResponse = <any>data;
        this.routes = routesResponse._embedded.routes;
      });
    });
  }

  searchRoutes() {
    if (this.searchTerm == '') {
      this.getDefualtRoutes();
      return;
    }
    this.api.searchRouteByTitle(this.searchTerm).subscribe(response => {
      let routesResponse = <any> response;
      this.routes = routesResponse._embedded.routes;
    });
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
