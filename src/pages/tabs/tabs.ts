import { Component } from '@angular/core';
import { NavController } from "ionic-angular";

import { CategoryPage } from '../category/category';
import { ShoppingBagPage } from '../shopping_bag/shopping-bag';
import { HomePage } from '../home/home';
import { SettingsPage } from '../settings/settings';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = CategoryPage;
  tab3Root = ShoppingBagPage;
  tab4Root = SettingsPage;

  constructor(public navCtrl: NavController) {

  }
}
