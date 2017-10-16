import {Component} from "@angular/core";
import {NavController, NavParams, ToastController, Events} from "ionic-angular";
import {Http, Response, RequestOptions} from "@angular/http";
import {DefaultRequestOptionsProvider} from "../../providers/default-request-options/default-request-options";
import {ConfigProvider} from "../../providers/config/config";
import {JwtProvider} from "../../providers/jwt/jwt";
import {ShoppingBagProvider} from "../../providers/shopping-bag/shopping-bag";
import "rxjs/add/operator/map";
import * as _ from 'lodash';

@Component({
    selector: 'page-category_detail',
    templateUrl: 'category_detail.html'
})
export class CategoryDetailPage {

    public department: {name: string, icon: string, id: number};
    public products: any[];
    public showLoading: boolean;

    constructor(public navCtrl: NavController,
                private navParams: NavParams,
                public toastCtrl: ToastController,
                public requestOptions: DefaultRequestOptionsProvider,
                public http: Http,
                private jwtProvider: JwtProvider,
                public configProvider: ConfigProvider,
                public shoppingBagProvider: ShoppingBagProvider,
                public events: Events) {

    }

    ngOnInit() {
        this.showLoading = true;
        this.department = {
            name: this.navParams.get('catName'),
            icon: this.navParams.get('catIcon'),
            id: this.navParams.get('catId')
        };
        this.getProducts();
    }

    /**
     *
     *
     * @returns {Subscription}
     */
    public getProducts() {
        return this.http
            .get(`${this.configProvider.base_url}/departments/products/${this.department.id}`, this.requestOptions.merge(new RequestOptions))
            .map((response: Response) => response.json())
            .subscribe(
                response => {
                    this.products = response.data;
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
                                        this.showLoading = false;
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
