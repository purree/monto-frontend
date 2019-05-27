import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-fact-packet-popup',
  templateUrl: './fact-packet-popup.component.html',
  styleUrls: ['./fact-packet-popup.component.scss'],
})
export class FactPacketPopupComponent implements OnInit {

  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();
  @Input() fact: any;

  constructor() { }

  ngOnInit() { }

  closeFactPopup() {
    this.close.emit();
  }

  handleDelete() {
    this.delete.emit({ spot: this.fact, categoryId: 3 });
  }

}
