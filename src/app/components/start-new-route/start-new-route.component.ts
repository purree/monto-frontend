import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-start-new-route',
  templateUrl: './start-new-route.component.html',
  styleUrls: ['./start-new-route.component.scss'],
})
export class StartNewRouteComponent implements OnInit {

  @Output() startRoute: EventEmitter<void> = new EventEmitter<void>();
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Input() activeRoute: any;

  constructor() { }

  ngOnInit() {
    console.log(this.activeRoute)
  }

  handleStartRoute(){
    this.startRoute.emit();
  }

  handleClose() {
    this.close.emit();
  }

}
