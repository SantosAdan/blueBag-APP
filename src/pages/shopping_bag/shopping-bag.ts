import { Component } from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';

@Component({
  selector: 'page-shopping-bag',
  templateUrl: 'shopping-bag.html'
})
export class ShoppingBagPage {

  public products: Array<any>;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController) {

  }

  ngOnInit() {
    this.products = [
      {name: 'Produto Genérico 1', value: 12.45, amount: 2},
      {name: 'Produto Genérico 2', value: 2.92, amount: 1},
      {name: 'Produto Genérico 3', value: 7.35, amount: 4},
      {name: 'Produto Genérico 4', value: 1.45, amount: 1},
      {name: 'Produto Genérico 5', value: 21.09, amount: 1},
      {name: 'Produto Genérico 6', value: 0.99, amount: 1}
    ];
  }

  getTotal() {
    let total: number = 0;

    for (let product of this.products) {
      total += product.value * product.amount;
    }

    return total.toFixed(2).toString().replace('.', ',');
  }

  removeProduct(index) {
    this.products.splice(index, 1);
    this.presentToast('success');
  }

  // Show toast message
  presentToast(type: string) {
    let toast = this.toastCtrl.create({
      message: 'Produto removido da sacola com sucesso!',
      duration: 2000,
      position: 'bottom',
      cssClass: type
    });
    toast.present();
  }

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
