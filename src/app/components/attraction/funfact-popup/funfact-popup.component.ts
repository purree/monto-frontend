import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-funfact-popup',
  templateUrl: './funfact-popup.component.html',
  styleUrls: ['./funfact-popup.component.scss'],
})
export class FunfactPopupComponent implements OnInit {

  @Input() funFact:any;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {}

  closePopup() {
    this.close.emit();
  }

}
