import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../api.service';
import { assetsPath } from '../../../environments/environment';

@Component({
  selector: 'app-predefined-routes',
  templateUrl: './predefined-routes.component.html',
  styleUrls: ['./predefined-routes.component.scss'],
})
export class PredefinedRoutesComponent implements OnInit {
  assetsPath: string;
  @Output() selectRoute: EventEmitter<any> = new EventEmitter<any>();
  @Input() activeRoute:any;

  routes: any;
  routePictures:string[]= [
    '/assets/img/1.JPG',
    '/assets/img/2.JPG',
    '/assets/img/9.JPG',
    '/assets/img/4.JPG',
    '/assets/img/Nod.jpg'
  ];

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.assetsPath = assetsPath;
    this.api.getRoutesByUser(1).subscribe((response) => {
      this.routes = response._embedded.routes;
      this.routes.forEach((route,index) => route.picture = this.routePictures[index])
    });
    console.log(this.routePictures);
  }

  onRouteSelect(route) {
    this.selectRoute.emit(route);
  }

}
