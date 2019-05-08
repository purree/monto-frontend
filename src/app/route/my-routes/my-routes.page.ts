import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-my-routes',
  templateUrl: './my-routes.page.html',
  styleUrls: ['./my-routes.page.scss'],
})
export class MyRoutesPage implements OnInit {

  private myRoutes:any;
  private myActiveRoute:any;

  constructor(private api: ApiService, private storage: Storage) { }

  ngOnInit() {
    this.storage.get('userHref').then((userHref) => {
      this.api.getMyRoutes().subscribe(data => {
        let routesResponse = <any>data;
        this.myRoutes = routesResponse._embedded.routes;
        this.myRoutes.forEach(route => {
          let selfLink = route._links.self.href;
          route.id = selfLink.substring(selfLink.lastIndexOf('/'), selfLink.length);
        });
      });
      this.api.getMyActiveRoute().subscribe(data => {
        if(data){
          let activeRouteResonse = <any> data;
          this.myActiveRoute = activeRouteResonse._links.self.href;
          console.log(this.myActiveRoute);
        }
      });
    });
  }

  activeRouteChange(event) {
    if (event.target.value !== this.myActiveRoute) {
      this.api.setMyActiveRoute(event.target.value).subscribe(data => {
        console.log(data);
      });
    }
  }

}
