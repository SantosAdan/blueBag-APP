import { Component } from '@angular/core';
import {NavController, AlertController, App} from 'ionic-angular';
import { LoginPage } from "../login/login";
import {AuthProvider} from "../../providers/auth/auth";
import {UserDataPage} from "../user-data/user-data";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  user_name: string;

  constructor(
      public navCtrl: NavController,
      public alertCtrl: AlertController,
      public app: App,
      public auth: AuthProvider) {}

  ionViewDidLoad() {
    this.auth.getUser().subscribe(
        res => {
          this.user_name = res.data.name;
        },
        err => {
          console.log(err);
        }
    );
  }

  /**
   * Logout method.
   */
  public logout() {
    // Remove token from localstorage
    localStorage.removeItem('token');

    // Return to login page
    this.app.getRootNav().setRoot(LoginPage); // use app.getRootNav() to fix showing tabs after logout
    this.navCtrl.popToRoot();
  }

  /**
   * Show confirm logout alert.
   */
  public showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Deseja mesmo sair?',
      message: 'Sentiremos sua falta :(',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Sim',
          handler: () => {
              this.logout();
          }
        }
      ]
    });

    alert.present();
  }

  /**
   * Show user info.
   */
  public presentUserData() {
    this.navCtrl.push(UserDataPage);
  }
}
