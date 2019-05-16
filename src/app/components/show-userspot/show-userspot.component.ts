import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-show-userspot',
  templateUrl: './show-userspot.component.html',
  styleUrls: ['./show-userspot.component.scss'],
})
export class ShowUserspotComponent implements OnInit {

  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Input() userSpot: any;

  constructor() { }

  ngOnInit() {}

  closeUserSpotPopup() {
    this.close.emit();
  }

}
