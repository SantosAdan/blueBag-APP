import {Component, ViewChild} from '@angular/core';
import {Content, NavController, NavParams, Slides} from 'ionic-angular';
import {AuthProvider} from "../../providers/auth/auth";
import {find, orderBy} from 'lodash';
import {Http, RequestOptions, Response} from "@angular/http";
import {ConfigProvider} from "../../providers/config/config";
import {DefaultRequestOptionsProvider} from "../../providers/default-request-options/default-request-options";
import {ShoppingBagProvider} from "../../providers/shopping-bag/shopping-bag";

@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {
  @ViewChild('checkoutSlider') checkoutSlider: Slides;
  @ViewChild(Content) content: Content;

  public addresses: any[] = [];
  public cards: any[] = [];
  public products: any[] = [];
  public selectedAddress: number = null;
  public selectedCard: number = null;
  // public totalAmount: string = '';
  public totalValue: string = '';
  public numPayments: number = 1;
  public paymentInstallments: any[] = [];

  public address: {
    id: number
    street: string
    number: number
    complement: string
    district: string
    city: string
    state: string
    zipcode: string
  };

  public card: {
    id: number
    name: string
    number: string
    due_date: string
  };

  constructor (public navCtrl: NavController,
               public navParams: NavParams,
               public auth: AuthProvider,
               public http: Http,
               public configProvider: ConfigProvider,
               public defaultRequest: DefaultRequestOptionsProvider,
               private shoppingBagProvider: ShoppingBagProvider) {
    this.address = {
      id: null,
      street: '',
      number: null,
      complement: '',
      district: '',
      city: '',
      state: '',
      zipcode: ''
    };

    this.card = {
      id: null,
      name: '',
      number: '',
      due_date: ''
    };

    // this.totalAmount = this.navParams.get('total_amount');
    this.totalValue = this.navParams.get('total_value');
  }

  ionViewDidEnter () {
    this.checkoutSlider.lockSwipes(true);

    this.cards = [
      {
        id: 1,
        name: 'Adan R D Santos',
        number: '1234 xxxx xxx 1111',
        due_date: '10/20'
      },
      {
        id: 2,
        name: 'Adan R D Santos',
        number: '5678 1234 0000 1111',
        due_date: '10/25'
      }
    ];

    this.getAddresses();
    this.getProducts();
    this.getPaymentInstallments();
  }

  /**
   * Get all Addresses of logged user.
   */
  getAddresses () {
    this.auth.getUser().subscribe(
      res => {
        //noinspection TypeScriptUnresolvedVariable
        this.addresses = res.data.addresses.data

        // Ordering
        this.addresses = orderBy(this.addresses, 'street', 'asc')

        // Close loading spinner
        // this.showLoading = false;
      },
      err => {
        console.log(err)
      }
    )
  }

  /**
   * Get address data.
   *
   * @param address_id
   * @returns {Subscription}
   */
  getAddressbyId (address_id) {
    return this.http
      .get(`${this.configProvider.base_url}/addresses/${address_id}/edit`, this.defaultRequest.merge(new RequestOptions))
      .map((res: Response) => res.json())
      .subscribe(res => {
          this.address = res
        },
        err => {
          console.log(err)
        })
  }

  /**
   * Get products data from shopping bag.
   *
   * @returns {Subscription}
   */
  getProducts () {
    return this.shoppingBagProvider.getProductsData()
      .subscribe(res => {
        this.products = res.data;

        // Ajustando quantidade de acordo com a sacola
        this.products = this.shoppingBagProvider.adjustShoppingBag(this.products);
      });
  }

  /**
   * Calculate the installments value up to 12x.
   *
   */
  getPaymentInstallments () {
    // Format money to BRL
    let BRL = new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'});
    let num_installments: number = 6;

    // Calculate the installments values
    for (let i = 1; i <= num_installments; i++) {
      let installment = parseFloat(this.totalValue.replace(',', '.')) / i;

      // Push to array with correct money format
      this.paymentInstallments.push({value: i, text: `${i}x - ${BRL.format(installment)}`});
    }
  }

  /**
   * Select an address to delivery.
   *
   * @param address_id
   */
  selectAddress (address_id) {
    this.selectedAddress = address_id;
    this.getAddressbyId(address_id);
  }

  /**
   * Select payment method, i.e., select credit card.
   *
   * @param card_id
   */
  selectCard (card_id) {
    this.selectedCard = card_id;
    this.card = find(this.cards, {id: card_id});
  }

  /**
   * Go to next step.
   */
  nextSlide () {
    this.checkoutSlider.lockSwipes(false);
    this.checkoutSlider.slideNext();
    this.checkoutSlider.lockSwipes(true);

    this.scrollToTop();
  }

  /**
   * Go to previous step.
   */
  prevSlide () {
    this.checkoutSlider.lockSwipes(false);
    this.checkoutSlider.slidePrev();
    this.checkoutSlider.lockSwipes(true);

    this.scrollToTop();
  }

  /**
   * Scroll to top.
   */
  scrollToTop () {
    this.content.scrollToTop();
  }

}
