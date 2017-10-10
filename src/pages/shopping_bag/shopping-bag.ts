import {Component} from "@angular/core";
import {NavController, ToastController, AlertController} from "ionic-angular";
import {Http, Response, RequestOptions} from "@angular/http";
import {ConfigProvider} from "../../providers/config/config";
import {DefaultRequestOptionsProvider} from "../../providers/default-request-options/default-request-options";
import {ShoppingBagProvider} from "../../providers/shopping-bag/shopping-bag";
import * as _ from 'lodash';

@Component({
    selector: 'page-shopping-bag',
    templateUrl: 'shopping-bag.html',
})
export class ShoppingBagPage {

    public products: any[] = [];

    constructor(public navCtrl: NavController,
                public toastCtrl: ToastController,
                public alertCtrl: AlertController,
                private http: Http,
                private configProvider: ConfigProvider,
                private requestOptions: DefaultRequestOptionsProvider,
                private shoppingBagProvider: ShoppingBagProvider) {

    }

    ionViewDidEnter() {
        this.getShoppingBagData();
    }

     getShoppingBagData(refresher = null) {
        let products_ids = this.shoppingBagProvider.getProductsId();

        let body = {
            "products_ids": products_ids
        };

        return this.http
            .post(`${this.configProvider.base_url}/products/shopping-bag`, body, this.requestOptions.merge(new RequestOptions))
            .map((res: Response) => res.json())
            .subscribe(res => {
                this.products = res.data;

                this.adjustShoppingBag();

                if (refresher)
                    refresher.complete();
            });
    }

    /**
     *  Get total cost of shopping bag.
     *
     * @returns {string}
     */
    getTotal(): string {
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
    getNumberItems(): number {
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
    removeProduct(product_id) {
        this.shoppingBagProvider.remove(product_id);
        let removed = _.remove(this.products, {'id': product_id});

        if (removed)
            this.presentToast('Produto removido da sacola com sucesso!', 'success')
    }

    /**
     * Increase amount of product in shopping bag by 1.
     *
     * @param product_id
     */
    addAmount(product_id) {
        this.shoppingBagProvider.add(product_id, 1);
        this.adjustShoppingBag();
    }

    /**
     * Decrease amount of product in shopping bag by 1.
     *
     * @param product_id
     */
    removeAmount(product_id) {
        let product = _.find(this.products, {'id': product_id});

        // If there's only one left, show alert of removal
        if (product.amount != 1) {
            this.shoppingBagProvider.add(product_id, -1);
            this.adjustShoppingBag();
        } else {
            this.showConfirm(product_id);
        }
    }

    /**
     * Assign shopping bag amounts to products array.
     *
     */
    adjustShoppingBag() {
        this.shoppingBagProvider.bag.map((valueFromBag) => {
            this.products.map((value) => {

                // Setting products amount based on local storage data
                if (valueFromBag.id == value.id)
                    value.amount = valueFromBag.amount;
            });
        });

        // Ordering
        //noinspection TypeScriptUnresolvedFunction
        this.products = _.orderBy(this.products, 'name', 'asc');
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
     *
     */
    showConfirm(product_id) {
        let confirmed: boolean = false;

        let alert = this.alertCtrl.create({
            title: '',
            message: 'Deseja remover este produto da sua sacola?',
            buttons: [
                {
                    text: 'Não',
                    role: 'cancel',
                    handler: () => {
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
    refresh(refresher) {
        this.getShoppingBagData(refresher);
    }
}
