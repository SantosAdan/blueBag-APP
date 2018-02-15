import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {DefaultRequestOptionsProvider} from "../../providers/default-request-options/default-request-options";
import {Http, RequestOptions, Response} from "@angular/http";
import {ConfigProvider} from "../../providers/config/config";
import {RefreshTokenProvider} from "../../providers/refresh-token/refresh-token";

@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {

  public product: any;
  public BRL: any;

  constructor (public navCtrl: NavController,
               public navParams: NavParams,
               public viewCtrl: ViewController,
               public requestOptions: DefaultRequestOptionsProvider,
               public http: Http,
               public configProvider: ConfigProvider,
               private refreshJWTProvider: RefreshTokenProvider)
  {
    this.BRL = new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'});
  }

  ionViewDidLoad () {
    let product_id = this.navParams.get('id');
    this.getProductDetail(product_id);
  }

  public getProductDetail (product_id) {

    return this.http
      .get(`${this.configProvider.base_url}/products/${product_id}`, this.requestOptions.merge(new RequestOptions))
      .map((response: Response) => response.json())
      .subscribe(response => {
        //console.log(response.data);
          this.product = response.data;

          this.product.value = this.BRL.format(this.product.value);
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

                this.product.value = this.BRL.format(this.product.value);
              });
          }
        });
  }

  public closeModal () {
    this.viewCtrl.dismiss();
  }
}
