import {Injectable} from "@angular/core";
import {StorageProvider} from "../storage/storage";
import * as _ from "lodash";
import {Events} from "ionic-angular";
import {Http, RequestOptions, Response} from "@angular/http";
import {DefaultRequestOptionsProvider} from "../default-request-options/default-request-options";
import {ConfigProvider} from "../config/config";

const BAG_KEY = 'shopping_bag';

@Injectable()
export class ShoppingBagProvider {

  /**
   * Shopping Bag array of objects.
   *
   * @type {Array}
   */
  public bag: any[] = [];

  constructor (private storageProvider: StorageProvider, public events: Events, private http: Http, private requestOptions: DefaultRequestOptionsProvider, private configProvider: ConfigProvider) {
    // Get products already in local storage
    this.bag = this.storageProvider.getObject(BAG_KEY);

    this.publishBagAmountUpdated();
  }

  /**
   * Get from server data of products in shopping bag.
   *
   * @returns {Observable<any>}
   */
  getProductsData () {
    let products_ids = this.getProductsId();

    let body = {
      "products_ids": products_ids
    };

    return this.http
      .post(`${this.configProvider.base_url}/products/shopping-bag`, body, this.requestOptions.merge(new RequestOptions))
      .map((res: Response) => res.json())
  }

  /**
   * Search array of objects based on product id.
   * If it's in there return it's index, otherwise returns -1
   *
   * @param product_id
   * @returns {number}
   */
  find (product_id) {
    // Get products already in local storage
    this.bag = this.storageProvider.getObject(BAG_KEY);

    return _.findIndex(this.bag, {'id': product_id});
  }

  /**
   * Get products ids from shopping bag.
   *
   * @returns {array<number>}
   */
  getProductsId () {
    // Get products already in local storage
    this.bag = this.storageProvider.getObject(BAG_KEY);

    // Extract only the ids values
    return _.map(this.bag, 'id');
  }

  /**
   * Sets the amount to a product.
   *
   * @param {string} product_id
   * @param {number} amount
   */
  setAmount (product_id: string, amount: number) {
    // Search the shopping bag looking for product
    let index = this.find(product_id);

    if (index == -1) {
      // Pushes new product to shopping bag
      this.bag.push({id: product_id, amount: amount});
    } else {
      // Add one to the amount of this product
      this.bag[index] = {id: product_id, amount: amount};
    }

    // Stores the shopping bag data into local storage
    this.storageProvider.setObject(BAG_KEY, this.bag);

    this.publishBagAmountUpdated();
  }

  /**
   * Add a product to the shopping bag.
   *
   * @param product_id
   * @param amount
   */
  add (product_id: string, amount: number) {
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

    this.publishBagAmountUpdated();
  }

  /**
   * Remove a product from shopping bag.
   *
   * @param product_id
   */
  remove (product_id) {
    // Search the shopping bag looking for product
    let index = this.find(product_id);

    // If it's in there, remove it
    if (index != -1) {
      let removed = _.remove(this.bag, {'id': product_id});

      if (removed) {
        // Updates the shopping bag data into local storage
        this.storageProvider.setObject(BAG_KEY, this.bag);

        this.publishBagAmountUpdated();
      }

      return removed;
    }
  }

  /**
   * Assign shopping bag amounts to products array.
   *
   * @param products
   * @returns {any}
   */
  adjustShoppingBag (products) {
    this.bag.map((valueFromBag) => {
      products.map((value) => {

        // Setting products amount based on local storage data
        if (valueFromBag.id == value.id)
          value.amount = valueFromBag.amount;
      });
    });

    // Ordering
    //noinspection TypeScriptUnresolvedFunction
    return products = _.orderBy(products, 'name', 'asc');
  }

  /**
   * Publish event to updated the products amount in shopping bag icon.
   */
  publishBagAmountUpdated () {
    let amount = this.bag.reduce((sum, product) => {
      return sum + product.amount;
    }, 0);

    this.events.publish('bag:updated', amount);
  }

}
