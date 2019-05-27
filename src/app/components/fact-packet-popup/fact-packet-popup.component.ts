import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-fact-packet-popup',
  templateUrl: './fact-packet-popup.component.html',
  styleUrls: ['./fact-packet-popup.component.scss'],
})
export class FactPacketPopupComponent implements OnInit {

  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Input() fact: any;

  constructor() { }

  ngOnInit() {}

  closeFactPopup() {
    this.close.emit();
  }

}
