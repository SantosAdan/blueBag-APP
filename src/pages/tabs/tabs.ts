import { Component } from '@angular/core';
import {NavController, Events} from "ionic-angular";

import { DepartmentPage } from '../department/department';
import { ShoppingBagPage } from '../shopping_bag/shopping-bag';
import { HomePage } from '../home/home';
import { SettingsPage } from '../settings/settings';
import 'rxjs/add/operator/map';
import {ShoppingBagProvider} from "../../providers/shopping-bag/shopping-bag";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = DepartmentPage;
  tab3Root = ShoppingBagPage;
  tab4Root = SettingsPage;
  public productsInBagCount: number = 0;
  selectedIndex: number = 0;

  constructor(public navCtrl: NavController, public events: Events, public shoppingBagProvider: ShoppingBagProvider) {
    if (shoppingBagProvider.bag.length > 0) {
      this.selectedIndex = 2;
    }

    // Subscribe to an event published every time the shopping bag changes
    this.events.subscribe('bag:updated', (count) => {
      this.productsInBagCount = count;
    });
  }
}
