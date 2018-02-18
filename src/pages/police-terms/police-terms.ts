import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';


@Component({
  selector: 'page-police-terms',
  templateUrl: 'police-terms.html',
})
export class PoliceTermsPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {

  }

  public closeModal () {
    this.viewCtrl.dismiss();
  }

}
