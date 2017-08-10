import { Component } from '@angular/core';
import { NavController, AlertController, App } from 'ionic-angular';
import { LoginPage } from "../login/login";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public app: App) {

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
}
