import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-route-completed',
  templateUrl: './route-completed.component.html',
  styleUrls: ['./route-completed.component.scss'],
})
export class RouteCompletedComponent implements OnInit {

  @Input() activeRoute:any;

  constructor() { }

  ngOnInit() {}

}
