import {Component} from '@angular/core';
import {NavController, ToastController, AlertController} from 'ionic-angular';
import {HeaderScroller} from '../header-scroller';

@Component({
  selector: 'page-shopping-bag',
  templateUrl: 'shopping-bag.html',
})
export class ShoppingBagPage {

  public products: Array<any>;

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public alertCtrl: AlertController) {
    this.products = [
      // {name: 'Produto Genérico 1', value: 12.45, amount: 2},
      // {name: 'Produto Genérico 2', value: 2.92, amount: 1},
      // {name: 'Produto Genérico 3', value: 7.35, amount: 4},
      // {name: 'Produto Genérico 4', value: 1.45, amount: 1},
      // {name: 'Produto Genérico 5', value: 21.09, amount: 1},
      // {name: 'Produto Genérico 6', value: 0.99, amount: 1}
    ];
  }

  /**
   *  Get total cost of shopping bag.
   *
   * @returns {string}
   */
  public getTotal(): string {
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
  public getNumberItems(): number {
    let total: number = 0;

    for (let product of this.products) {
      total += product.amount;
    }

    return total;
  }

  /**
   * Remove a product from shopping bag.
   *
   * @param index
   */
  removeProduct(index) {
    this.products.splice(index, 1)
    this.presentToast('Produto removido da sacola com sucesso!', 'success')
  }

  public addAmount(index) {
    this.products[index].amount++;
  }

  public removeAmount(index) {
    if (this.products[index].amount != 1) {
      this.products[index].amount--;
    } else {
        this.showConfirm(index);
    }
  }

  /**
   * Show toast message.
   *
   * @param message
   * @param type
   */
  presentToast(message: string, type: string) {
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
   */
  public showConfirm(index) {
    let confirmed: boolean = false;

    let alert = this.alertCtrl.create({
      title: '',
      message: 'Deseja remover este produto da sua sacola?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Sim',
          handler: () => {
            this.removeProduct(index);
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
  refresh(refresher) {
    setTimeout(() => {
      this.products = [
        {name: 'Produto Genérico 1', value: 12.45, amount: 2},
        {name: 'Produto Genérico 2', value: 2.92, amount: 1},
        {name: 'Produto Genérico 3', value: 7.35, amount: 4},
        {name: 'Produto Genérico 4', value: 1.45, amount: 1},
        {name: 'Produto Genérico 5', value: 21.09, amount: 1},
        {name: 'Produto Genérico 6', value: 0.99, amount: 1}
      ];

      refresher.complete();
    }, 2000);
  }
}
