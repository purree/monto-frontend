import { Component, OnInit } from '@angular/core';
import { ToastController, Events } from '@ionic/angular';

@Component({
  selector: 'app-fact-packet-toast',
  templateUrl: './fact-packet-toast.component.html',
  styleUrls: ['./fact-packet-toast.component.scss'],
})
export class FactPacketToastComponent implements OnInit {

  constructor(private ev: Events,private toastController: ToastController) {
    this.ev.subscribe('factInRange', () => this.presentToast());
  }

  ngOnInit() { }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'You unlocked a new fact packet!',
      duration: 2500,
      position: 'top',
      cssClass: 'offset-top',
    });
    toast.present();
  }

}
