import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-category_detail',
  templateUrl: 'category_detail.html'
})
export class CategoryDetailPage {

  public category: { name: string, icon: string};

  constructor(public navCtrl: NavController, private navParams: NavParams, public toastCtrl: ToastController) {

  }

  ngOnInit() {
    this.category = {
      name: this.navParams.get('catName'), 
      icon: this.navParams.get('catIcon')
    };
  }

  // Add product to cart
  addToChart() {
    this.presentToast('success');
  }

  // Show toast message
  presentToast(type: string) {
    let toast = this.toastCtrl.create({
      message: 'Produto adicionado ao carrinho com sucesso!',
      duration: 2000,
      position: 'top',
      cssClass: type
    });
    toast.present();
  }
}
