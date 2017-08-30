import { Component } from '@angular/core';
import {NavController, Platform, ToastController} from 'ionic-angular';
import { Network } from "@ionic-native/network";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private platform: Platform, public toastCtrl: ToastController, private network: Network) {

  }

  ionViewDidEnter() {
    this.checkNetwork();
  }

  public checkNetwork() {
    this.platform.ready().then(() => {
      this.network.onConnect().subscribe(data => {
        console.log(data)
        this.displayNetworkUpdate(data.type);
      }, error => console.error(error));

      this.network.onDisconnect().subscribe(data => {
        console.log(data)
        this.displayNetworkUpdate(data.type);
      }, error => console.error(error));
    });
  }

  displayNetworkUpdate(connectionState: string){
    this.toastCtrl.create({
      message: `Você está ${connectionState}`,
      duration: 3000
    }).present();
  }
}
