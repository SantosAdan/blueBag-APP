import { Component } from '@angular/core';
import {Events, ModalController, NavController, ToastController} from 'ionic-angular';
import {ShoppingBagProvider} from "../../providers/shopping-bag/shopping-bag";
import {ConfigProvider} from "../../providers/config/config";
import {JwtProvider} from "../../providers/jwt/jwt";
import {Http, RequestOptions, Response} from "@angular/http";
import {DefaultRequestOptionsProvider} from "../../providers/default-request-options/default-request-options";
import {Subscription} from "rxjs/Subscription";
import {ProductPage} from "../product/product";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public products: any[] = [];
  public productsPagination: any;

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public modalCtrl: ModalController,
              public events: Events,
              public requestOptions: DefaultRequestOptionsProvider,
              public http: Http,
              private jwtProvider: JwtProvider,
              public configProvider: ConfigProvider,
              public shoppingBagProvider: ShoppingBagProvider) {

  }

  ionViewDidEnter() {
    this.getHighlightedProductsRandomly();
  }

  /**
   *
   */
  getHighlightedProductsRandomly (): Subscription {
    return this.http
      .get(`${this.configProvider.base_url}/products/highlighted`, this.requestOptions.merge(new RequestOptions))
      .map((response: Response) => response.json())
      .subscribe(
        response => {
          this.products = response.data;

          this.productsPagination = response.meta.pagination;

          this.formatProducts(this.products);
        },
        err => {
          if (err.status === 401) {
            this.http.post(`${this.configProvider.base_url}/refresh_token`, {}, this.requestOptions.merge(new RequestOptions))
              .map((response: Response) => response.json())
              .subscribe(response => {
                // Setando novo token
                this.jwtProvider.token = response.token;

                // Refazendo o request
                this.http
                  .get(`${this.configProvider.base_url}/products/highlighted`, this.requestOptions.merge(new RequestOptions))
                  .map((response: Response) => response.json())
                  .subscribe(response => {
                    this.products = response.data;

                    this.productsPagination = response.meta.pagination;

                    this.formatProducts(this.products);
                  });
              });
          }
        }
      );
  }

  /**
   * Get more products from the paginated return.
   *
   * @param infiniteScroll
   */
  getMoreProducts (infiniteScroll) {
    return this.http
      .get(`${this.productsPagination.links.next}`, this.requestOptions.merge(new RequestOptions))
      .map((response: Response) => response.json())
      .subscribe(
        response => {
          this.productsPagination = response.meta.pagination;

          this.formatProducts(response.data);

          //Array.prototype.push.apply(this.products, response.data);
          this.products.push(...response.data);

          infiniteScroll.complete();
        },
        err => {
          if (err.status === 401) {
            this.http.post(`${this.configProvider.base_url}/refresh_token`, {}, this.requestOptions.merge(new RequestOptions))
              .map((response: Response) => response.json())
              .subscribe(response => {
                // Setando novo token
                this.jwtProvider.token = response.token;

                // Refazendo o request
                this.http
                  .get(`${this.productsPagination.links.next}`, this.requestOptions.merge(new RequestOptions))
                  .map((response: Response) => response.json())
                  .subscribe(response => {
                    this.productsPagination = response.meta.pagination;

                    this.formatProducts(response.data);

                    //Array.prototype.push.apply(this.products, response.data);
                    this.products.push(...response.data);

                    infiniteScroll.complete();
                  });
              });
          }
        }
      );
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
  }

  /**
   * Format products attributes.
   */
  private formatProducts (products) {
    products.map(product => {
      //product.value = Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(product.value);
      product.variety = (product.variety == '...' || product.variety == 'vazio') ? '' : product.variety;
      product.package = (product.package == '...' || product.package == 'vazio') ? '' : product.package;
    });
  }

  /**
   *
   * @param product_id
   */
  public showProductDetails(product_id) {
    let modal = this.modalCtrl.create(ProductPage, {id: product_id});
    modal.present();
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
