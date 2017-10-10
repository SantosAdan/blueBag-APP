import { Component } from '@angular/core';
import {NavController, Events} from "ionic-angular";

import { DepartmentPage } from '../department/department';
import { ShoppingBagPage } from '../shopping_bag/shopping-bag';
import { HomePage } from '../home/home';
import { SettingsPage } from '../settings/settings';
import {ShoppingBagProvider} from "../../providers/shopping-bag/shopping-bag";
import 'rxjs/add/operator/map';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = DepartmentPage;
  tab3Root = ShoppingBagPage;
  tab4Root = SettingsPage;
  public productsInBagCount: number = 0;

  constructor(public navCtrl: NavController, public events: Events) {
    this.events.subscribe('bag:updated', (count) => {
      this.productsInBagCount = count;
    });
  }
}
