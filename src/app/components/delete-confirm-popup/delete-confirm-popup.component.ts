import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-confirm-popup',
  templateUrl: './delete-confirm-popup.component.html',
  styleUrls: ['./delete-confirm-popup.component.scss'],
})
export class DeleteConfirmPopupComponent implements OnInit {

  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Output() delete: EventEmitter<void> = new EventEmitter<void>();


  constructor() { }

  ngOnInit() {}

  closePopup() {
    this.close.emit();
  }

  onDelete(){
    this.delete.emit();
  }

}
