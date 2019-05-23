import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-predefined-routes',
  templateUrl: './predefined-routes.component.html',
  styleUrls: ['./predefined-routes.component.scss'],
})
export class PredefinedRoutesComponent implements OnInit {

  @Output() selectRoute: EventEmitter<any> = new EventEmitter<any>();
  @Input() activeRoute:any;

  routes: any;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getRoutesByUser(1).subscribe((response) => this.routes = response._embedded.routes);
  }

  onRouteSelect(route) {
    this.selectRoute.emit(route);
  }

}
