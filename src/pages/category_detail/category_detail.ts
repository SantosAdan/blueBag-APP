import {Component} from "@angular/core";
import {NavController, NavParams, ToastController, Events, ModalController} from "ionic-angular";
import {Http, Response, RequestOptions} from "@angular/http";
import {DefaultRequestOptionsProvider} from "../../providers/default-request-options/default-request-options";
import {ConfigProvider} from "../../providers/config/config";
import {JwtProvider} from "../../providers/jwt/jwt";
import {ShoppingBagProvider} from "../../providers/shopping-bag/shopping-bag";
import "rxjs/add/operator/map";
import {ProductPage} from "../product/product";
import {Subscription} from "rxjs/Subscription";
import * as _ from 'lodash';

@Component({
  selector: 'page-category_detail',
  templateUrl: 'category_detail.html'
})
export class CategoryDetailPage {

  public department: { name: string, icon: string, id: number };
  public categories: any[];
  public products: any[] = [];
  public productsPagination: any;
  public highlighted: any[] = [];
  public showLoading: boolean;
  public selectedCategory: string = 'all';

  constructor (public navCtrl: NavController,
               private navParams: NavParams,
               public toastCtrl: ToastController,
               public modalCtrl: ModalController,
               public requestOptions: DefaultRequestOptionsProvider,
               public http: Http,
               private jwtProvider: JwtProvider,
               public configProvider: ConfigProvider,
               public shoppingBagProvider: ShoppingBagProvider,
               public events: Events) {

  }

  ngOnInit () {
    this.showLoading = true;
    this.department = {
      name: this.navParams.get('catName'),
      icon: this.navParams.get('catIcon'),
      id: this.navParams.get('catId')
    };
    this.getCategories();
    this.getHighlightedProducts();
    this.getProducts();
  }

  /**
   * Get all products of a department.
   *
   * @returns {Subscription}
   */
  getProducts () {
    return this.http
      .get(`${this.configProvider.base_url}/departments/products/${this.department.id}`, this.requestOptions.merge(new RequestOptions))
      .map((response: Response) => response.json())
      .subscribe(
        response => {
          this.products = response.data;

          this.productsPagination = response.meta.pagination;

          this.formatProducts(this.products);

          this.showLoading = false;
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
                  .get(`${this.configProvider.base_url}/departments/products/${this.department.id}`, this.requestOptions.merge(new RequestOptions))
                  .map((response: Response) => response.json())
                  .subscribe(response => {
                    this.products = response.data;
                    this.productsPagination = response.meta.pagination;

                    this.formatProducts(this.products);

                    this.showLoading = false;
                  });
              });
          }
        }
      );
  }

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
   * Get all categories of a department.
   *
   * @returns {Subscription}
   */
  getCategories () {
    return this.http
      .get(`${this.configProvider.base_url}/departments/${this.department.id}?include=categories`, this.requestOptions.merge(new RequestOptions))
      .map((response: Response) => response.json())
      .subscribe(
        response => {
          this.categories = response.data.categories.data;

          this.categories = _.orderBy(this.categories, 'name', 'asc');
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
                  .get(`${this.configProvider.base_url}/departments/${this.department.id}?include=categories`, this.requestOptions.merge(new RequestOptions))
                  .map((response: Response) => response.json())
                  .subscribe(response => {
                    this.categories = response.data.categories.data;

                    this.categories = _.orderBy(this.categories, 'name', 'asc');
                  });
              });
          }
        }
      );
  }

  getHighlightedProducts (): Subscription {

    return this.http
      .get(`${this.configProvider.base_url}/products/highlighted/department/${this.department.id}`, this.requestOptions.merge(new RequestOptions))
      .map((response: Response) => response.json())
      .subscribe(
        response => {
          this.highlighted = response.data;

          this.formatProducts(this.highlighted);
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
                  .get(`${this.configProvider.base_url}/products/highlighted/department/${this.department.id}`, this.requestOptions.merge(new RequestOptions))
                  .map((response: Response) => response.json())
                  .subscribe(response => {
                    this.highlighted = response.data;

                    this.formatProducts(this.highlighted);
                  });
              });
          }
        }
      );
  }

  getHighlightedProductsByCategory (): Subscription {

    return this.http
      .get(`${this.configProvider.base_url}/products/highlighted/${this.selectedCategory}`, this.requestOptions.merge(new RequestOptions))
      .map((response: Response) => response.json())
      .subscribe(
        response => {
          this.highlighted = response.data;

          this.formatProducts(this.highlighted);
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
                  .get(`{this.configProvider.base_url}/products/highlighted/${this.selectedCategory}`, this.requestOptions.merge(new RequestOptions))
                  .map((response: Response) => response.json())
                  .subscribe(response => {
                    this.highlighted = response.data;

                    this.formatProducts(this.highlighted);
                  });
              });
          }
        }
      );
  }

  /**
   * Get all products of a category.
   *
   * @returns {Subscription}
   */
  getProductsByCategory (): Subscription {

    if (this.selectedCategory == 'all') {
      this.getHighlightedProducts();
      this.getProducts();
    } else {
      return this.http
        .get(`${this.configProvider.base_url}/categories/products/${this.selectedCategory}`, this.requestOptions.merge(new RequestOptions))
        .map((response: Response) => response.json())
        .subscribe(
          response => {
            this.products = response.data;
            this.productsPagination = response.meta.pagination;

            this.formatProducts(this.products);

            this.getHighlightedProductsByCategory();
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
                    .get(`${this.configProvider.base_url}/categories/products/${this.selectedCategory}`, this.requestOptions.merge(new RequestOptions))
                    .map((response: Response) => response.json())
                    .subscribe(response => {
                      this.products = response.data;
                      this.productsPagination = response.meta.pagination;

                      this.formatProducts(this.products);

                      this.getHighlightedProductsByCategory();
                    });
                });
            }
          }
        );
    }
  }

  /**
   * Add product to shopping bag.
   *
   * @param product_id
   */
  addToChart (product_id) {
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
      product.value = Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(product.value);
      product.variety = (product.variety == '...' || product.variety == 'vazio') ? '' : product.variety;
      product.package = (product.package == '...' || product.package == 'vazio') ? '' : product.package;
    });
  }

  /**
   *
   * @param product_id
   */
  showProductDetails (product_id) {
    let modal = this.modalCtrl.create(ProductPage, {id: product_id});
    modal.present();
  }

  /**
   * Show toast message.
   *
   * @param type
   */
  private presentToast (type: string) {
    let toast = this.toastCtrl.create({
      message: 'Produto adicionado à sacola com sucesso!',
      duration: 2000,
      position: 'top',
      cssClass: type
    });
    toast.present();
  }
}
