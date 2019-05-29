import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { apiUrl } from '../../../environments/environment';

@Component({
  selector: 'app-route-completed',
  templateUrl: './route-completed.component.html',
  styleUrls: ['./route-completed.component.scss'],
})
export class RouteCompletedComponent implements OnInit {

  @Input() activeRoute: any;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit() { }

  closePopup() {
    this.close.emit();
  }

  shareRoute() {
    const nav = <any>navigator;
    if (nav.share) {
      nav.share({
        title: 'I just walked this route!',
        text: 'I just finished walking this awesome statue tour, and learned so much new stuff 🧠 #monto#stockholm',
        url: `${apiUrl}/detail-route/${this.activeRoute.id}`
      })
        .then(() => {
          console.log('Thanks for sharing!');
        })
        .catch((err) => {
          console.log('Could not share because ', err.message);
        });
    } else {
      console.log('This browser is not supported!')
    }
  }
}
