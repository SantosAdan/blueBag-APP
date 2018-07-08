import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';


@Component({
  selector: 'page-use-terms',
  templateUrl: 'use-terms.html',
})
export class UseTermsPage {

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
