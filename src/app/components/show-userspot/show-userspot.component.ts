import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-show-userspot',
  templateUrl: './show-userspot.component.html',
  styleUrls: ['./show-userspot.component.scss'],
})
export class ShowUserspotComponent implements OnInit {

  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();
  @Input() userSpot: any;
  @Input() isRouteCreator: boolean;

  constructor() { }

  ngOnInit() { }

  closeUserSpotPopup() {
    this.close.emit();
  }

  handleDelete() {
    this.delete.emit({ spot: this.userSpot, categoryId: 2 });
  }

}
