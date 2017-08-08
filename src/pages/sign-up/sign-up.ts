import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {LoginPage} from "../login/login";

@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {

  public user: {
    name: string;
    email: string;
    password: string;
  };

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit() {
    this.user = {name: '', email: '', password: ''};
  }

  /**
   * Return to Login Page method.
   */
  goToLoginPage() {
    this.navCtrl.push(LoginPage);
  }

  /**
   *
   */
  signUp() {

  }
}
