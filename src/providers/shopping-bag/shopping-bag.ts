import {Injectable} from "@angular/core";
import {StorageProvider} from "../storage/storage";
import * as _ from "lodash";
import {Events} from "ionic-angular";

const BAG_KEY = 'shopping_bag';

@Injectable()
export class ShoppingBagProvider {

    /**
     * Shopping Bag array of objects.
     *
     * @type {Array}
     */
    public bag: any[] = [];

    constructor(private storageProvider: StorageProvider, public events: Events) {
        // Get products already in local storage
        this.bag = this.storageProvider.getObject(BAG_KEY);

        this.publishBagUpdated();
    }

    /**
     * Search array of objects based on product id.
     * If it's in there return it's index, otherwise returns -1
     *
     * @param product_id
     * @returns {number}
     */
    public find(product_id) {
        // Get products already in local storage
        this.bag = this.storageProvider.getObject(BAG_KEY);

        return _.findIndex(this.bag, {'id': product_id});
    }

    /**
     * Get products ids from shopping bag.
     *
     * @returns {array<number>}
     */
    public getProductsId() {
        // Get products already in local storage
        this.bag = this.storageProvider.getObject(BAG_KEY);

        // Extract only the ids values
        return _.map(this.bag, 'id');
    }

    /**
     * Add a product to the shopping bag.
     *
     * @param product_id
     * @param amount
     */
    public add(product_id: string, amount: number) {
        // Search the shopping bag looking for product
        let index = this.find(product_id);

        if (index == -1) {
            // Pushes new product to shopping bag
            this.bag.push({id: product_id, amount: amount});
        } else {
            // Add one to the amount of this product
            this.bag[index] = {id: product_id, amount: this.bag[index].amount + amount};
        }

        // Stores the shopping bag data into local storage
        this.storageProvider.setObject(BAG_KEY, this.bag);

        this.publishBagUpdated();
    }

    /**
     * Remove a product from shopping bag.
     *
     * @param product_id
     */
    public remove(product_id) {
        // Search the shopping bag looking for product
        let index = this.find(product_id);

        // If it's in there, remove it
        if (index != -1) {
            let removed = _.remove(this.bag, {'id': product_id});

            if (removed) {
                // Updates the shopping bag data into local storage
                this.storageProvider.setObject(BAG_KEY, this.bag);

                this.publishBagUpdated();
            }

            return removed;
        }
    }

    publishBagUpdated() {
        let amount = this.bag.reduce((sum, product) => {
            return sum + product.amount;
        }, 0);

        this.events.publish('bag:updated', amount);
    }

}
