import {Component} from '@angular/core';
import {Events, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {DefaultRequestOptionsProvider} from "../../providers/default-request-options/default-request-options";
import {Http, RequestOptions, Response} from "@angular/http";
import {ConfigProvider} from "../../providers/config/config";
import {RefreshTokenProvider} from "../../providers/refresh-token/refresh-token";
import {ShoppingBagProvider} from "../../providers/shopping-bag/shopping-bag";

@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {

  public product: any;

  constructor (public navCtrl: NavController,
               public navParams: NavParams,
               public toastCtrl: ToastController,
               public viewCtrl: ViewController,
               public events: Events,
               public requestOptions: DefaultRequestOptionsProvider,
               public http: Http,
               public configProvider: ConfigProvider,
               private refreshJWTProvider: RefreshTokenProvider,
               public shoppingBagProvider: ShoppingBagProvider) {
  }

  ionViewDidLoad () {
    let product_id = this.navParams.get('id');
    this.getProductDetail(product_id);
  }

  public getProductDetail (product_id) {

    return this.http
      .get(`${this.configProvider.base_url}/products/${product_id}?include=category`, this.requestOptions.merge(new RequestOptions))
      .map((response: Response) => response.json())
      .subscribe(response => {
        //console.log(response.data);
          this.product = response.data;

          this.formatProduct(this.product);
        },
        err => {
          if (err.status === 401) {
            // Refresh token
            this.refreshJWTProvider.refresh();

            // Redo request
            this.http
              .get(`${this.configProvider.base_url}/products/${product_id}`, this.requestOptions.merge(new RequestOptions))
              .map((response: Response) => response.json())
              .subscribe(response => {
                this.product = response.data;

                this.formatProduct(this.product);
              });
          }
        });
  }

  public closeModal () {
    this.viewCtrl.dismiss();
  }

  /**
   * Add product to shopping bag.
   *
   * @param product_id
   */
  public addToChart(product_id) {
    let amount = this.shoppingBagProvider.bag.reduce((sum, product) => {
      return sum + product.amount;
    }, 0);

    this.shoppingBagProvider.add(product_id, 1);
    this.events.publish('bag:updated', ++amount);

    this.presentToast('success');
    this.closeModal();
  }

  /**
   * Format products attributes.
   */
  private formatProduct (product) {
      product.value = Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(product.value);
      product.variety = (product.variety == '...' || product.variety == 'vazio') ? '' : product.variety;
      product.package = (product.package == '...' || product.package == 'vazio') ? '' : product.package;

  }

  /**
   * Show toast message.
   *
   * @param type
   */
  private presentToast(type: string) {
    let toast = this.toastCtrl.create({
      message: 'Produto adicionado à sacola com sucesso!',
      duration: 2000,
      position: 'top',
      cssClass: type
    });
    toast.present();
  }
}
