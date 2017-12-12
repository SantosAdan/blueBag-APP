import {Component} from "@angular/core";
import {NavController, ToastController, AlertController} from "ionic-angular";
import {ShoppingBagProvider} from "../../providers/shopping-bag/shopping-bag";
import * as _ from 'lodash';
import {CheckoutPage} from "../checkout/checkout";
import {ConfigProvider} from "../../providers/config/config";
import {RefreshTokenProvider} from "../../providers/refresh-token/refresh-token";
import {DepartmentPage} from "../department/department";

@Component({
  selector: 'page-shopping-bag',
  templateUrl: 'shopping-bag.html',
})
export class ShoppingBagPage {

  public products: any[] = [];
  public showLoading: boolean;

  constructor (public navCtrl: NavController,
               public toastCtrl: ToastController,
               public alertCtrl: AlertController,
               private shoppingBagProvider: ShoppingBagProvider,
               private configProvider: ConfigProvider,
               private refreshJWTProvider: RefreshTokenProvider) {

  }

  ionViewDidEnter () {
    this.showLoading = true;
    this.getShoppingBagData();
  }

  /**
   * Get from server products data.
   *
   * @param {any} refresher
   * @returns {Subscription}
   */
  getShoppingBagData (refresher = null) {
    return this.shoppingBagProvider.getProductsData()
      .subscribe(res => {
          this.products = res.data;
          this.showLoading = false; // Retiramos o spinner de loading

          this.products = this.shoppingBagProvider.adjustShoppingBag(this.products);
          this.shoppingBagProvider.publishBagAmountUpdated();

          if (refresher) {
            refresher.complete();
          }
        },
        err => {
          // If token wasn't valid, do the refresh
          if (err.status === 401) {

            // Refresh token
            this.refreshJWTProvider.refresh();

            // Redo request
            return this.shoppingBagProvider.getProductsData()
              .subscribe(res => {
                this.products = res.data;
                this.showLoading = false; // Retiramos o spinner de loading

                this.products = this.shoppingBagProvider.adjustShoppingBag(this.products);
                this.shoppingBagProvider.publishBagAmountUpdated();

                if (refresher) {
                  refresher.complete();
                }
              });
          }
        });
  }

  /**
   *  Get total cost of shopping bag.
   *
   * @returns {string}
   */
  getTotal (): string {
    let total: number = 0;

    for (let product of this.products) {
      total += product.value * product.amount;
    }

    return total.toFixed(2).toString().replace('.', ',');
  }

  /**
   *
   * @returns {number}
   */
  getNumberItems (): number {
    let total: number = 0;

    for (let product of this.products) {
      total += product.amount;
    }

    return total;
  }

  /**
   * Remove a product from shopping bag.
   *
   * @param product_id
   */
  removeProduct (product_id) {
    this.shoppingBagProvider.remove(product_id);
    let removed = _.remove(this.products, {'id': product_id});

    if (removed) {
      this.presentToast('Produto removido da sacola com sucesso!', 'success')
    }
  }

  /**
   * Increase amount of product in shopping bag by 1.
   *
   * @param product_id
   */
  addAmount (product_id) {
    this.shoppingBagProvider.add(product_id, 1);
    this.products = this.shoppingBagProvider.adjustShoppingBag(this.products);
  }

  /**
   * Decrease amount of product in shopping bag by 1.
   *
   * @param product_id
   */
  removeAmount (product_id) {
    let product = _.find(this.products, {'id': product_id});

    // If there's only one left, show alert of removal
    if (product.amount != 1) {
      this.shoppingBagProvider.add(product_id, -1);
      this.products = this.shoppingBagProvider.adjustShoppingBag(this.products);
    } else {
      this.showConfirm(product_id);
    }
  }

  /**
   * Sets product amount to a specific value.
   *
   * @param product_id
   */
  updateAmount (product_id) {
    let product = _.find(this.products, {'id': product_id});

    // If there's only one left, show alert of removal
    if (product.amount >= 1) {
      this.shoppingBagProvider.setAmount(product_id, product.amount);
      this.products = this.shoppingBagProvider.adjustShoppingBag(this.products);
    } else {
      this.showConfirm(product_id);
    }
  }

  /**
   * Show toast message.
   *
   * @param message
   * @param type
   */
  presentToast (message: string, type: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1500,
      position: 'top',
      cssClass: type
    });
    toast.present();
  }

  /**
   * Show confirm removing product alert.
   *
   */
  showConfirm (product_id) {
    let alert = this.alertCtrl.create({
      title: '',
      message: 'Deseja remover este produto da sua sacola?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          handler: () => {
            // Do nothing for the moment
          }
        },
        {
          text: 'Sim',
          handler: () => {
            this.removeProduct(product_id);
          }
        }
      ]
    });

    alert.present();
  }

  /**
   * Refresh listener.
   *
   * @param refresher
   */
  refresh (refresher) {
    this.getShoppingBagData(refresher);
  }

  /**
   * Go to Checkout Page.
   */
  goToCheckoutPage () {
    this.navCtrl.push(CheckoutPage, {
      total_amount: this.getNumberItems(),
      total_value: this.getTotal()
    });
  }

  goToDepartmentsPage () {
    this.navCtrl.setRoot(DepartmentPage);
    this.navCtrl.popToRoot();
  }
}
