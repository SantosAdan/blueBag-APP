import { Component } from '@angular/core';
import { NavController } from "ionic-angular";

import { CategoryPage } from '../category/category';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { SettingsPage } from '../settings/settings';
import { LoginPage } from "../login/login";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = CategoryPage;
  tab3Root = ContactPage;
  tab4Root = SettingsPage;

  constructor(public navCtrl: NavController) {
    let token = localStorage.getItem('token');

    if (token === null ) {
      this.goToLoginPage();
    }
  }

  /**
   *   Redirect method if not logged in.
   */
  goToLoginPage() {
    this.navCtrl.push(LoginPage);
  }
}
