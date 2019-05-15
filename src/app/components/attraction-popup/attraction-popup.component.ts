import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-attraction-popup',
  templateUrl: './attraction-popup.component.html',
  styleUrls: ['./attraction-popup.component.scss'],
})
export class AttractionPopupComponent implements OnInit {

  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Input() attraction: any;

  constructor() { }

  ngOnInit() { }

  closePopup() {
    this.close.emit();
  }


}
