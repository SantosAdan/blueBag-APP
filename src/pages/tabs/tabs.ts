import { Component } from '@angular/core';
import {NavController, Events, AlertController} from "ionic-angular";
import { AppVersion } from '@ionic-native/app-version';
import { Market } from '@ionic-native/market';
import {Http, RequestOptions, Response} from "@angular/http";

import { DepartmentPage } from '../department/department';
import { ShoppingBagPage } from '../shopping_bag/shopping-bag';
import { HomePage } from '../home/home';
import { SettingsPage } from '../settings/settings';
import 'rxjs/add/operator/map';
import {ShoppingBagProvider} from "../../providers/shopping-bag/shopping-bag";
import {ConfigProvider} from "../../providers/config/config";
import {DefaultRequestOptionsProvider} from "../../providers/default-request-options/default-request-options";

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
  currentAppVersion: string;

  constructor(public navCtrl: NavController,
              public http: Http,
              public events: Events,
              public alertCtrl: AlertController,
              public shoppingBagProvider: ShoppingBagProvider,
              public configProvider: ConfigProvider,
              public defaultRequest: DefaultRequestOptionsProvider,
              private appVersion: AppVersion,
              private market: Market) {
    if (shoppingBagProvider.bag.length > 0) {
      this.selectedIndex = 2;
    }

    // Check if app is up-to-date
    this.getAppVersion();

    // Subscribe to an event published every time the shopping bag changes
    this.events.subscribe('bag:updated', (count) => {
      this.productsInBagCount = count;
    });
  }

  /**
   * Check if app is up-to-date
   */
  async getAppVersion() {
    const app_version = await this.appVersion.getVersionNumber();
    // const app_version = '1.2.2';

    this.http
      .get(`${this.configProvider.base_url}/app-version`, this.defaultRequest.merge(new RequestOptions))
      .map((res: Response) => res.json())
      .subscribe(res => {
        this.currentAppVersion = res;

        if (this.currentAppVersion != app_version) {
          let alert = this.alertCtrl.create({
            title: 'Versão antiga detectada',
            message: 'Olá, parece que seu app está desatualizado para desfrutar de todas as funcionalidades, por favor atualize!',
            buttons: [
              {
                text: 'Fechar',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'Atualizar',
                handler: () => {
                  this.market.open('bb.bluebag.marketplace');
                }
              }
            ]
          });
          alert.present();
        }
      });
  }
}
