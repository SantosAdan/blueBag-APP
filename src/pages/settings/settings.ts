import { Component } from '@angular/core';
import {NavController, AlertController, App} from 'ionic-angular';
import { LoginPage } from "../login/login";
import {AuthProvider} from "../../providers/auth/auth";
import {UserDataPage} from "../user-data/user-data";
import {AddressPage} from "../address/address";

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
          //noinspection TypeScriptUnresolvedVariable
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
    localStorage.removeItem('shopping_bag');

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
  public goToUserDataPage() {
    this.navCtrl.push(UserDataPage);
  }

  /**
   * Show user info.
   */
  public goToAddressPage() {
    this.navCtrl.push(AddressPage);
  }
}
