import {Component} from '@angular/core';
import {NavController, NavParams, ActionSheetController, ModalController} from 'ionic-angular';
import {AuthProvider} from "../../providers/auth/auth";
import * as _ from 'lodash';
import {Http, RequestOptions, Response} from "@angular/http";
import {ConfigProvider} from "../../providers/config/config";
import {DefaultRequestOptionsProvider} from "../../providers/default-request-options/default-request-options";
import {ShoppingBagProvider} from "../../providers/shopping-bag/shopping-bag";
import {InvoiceDetailsPage} from "../invoice-details/invoice-details";
import {CardNewPage} from "../card-new/card-new";
import {CardPage} from "../card/card";
import {TabsPage} from "../tabs/tabs";

@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {

  public addresses: any[] = [];
  public cards: any[] = [];
  public products: any[] = [];
  public selectedAddress: number = null;
  public selectedCard: number = null;
  public selectedInstallment: string = '';
  // public totalAmount: string = '';
  public subtotalValue: string = '';
  public totalValue: string = '';
  public numPayments: number = 1;
  public paymentInstallments: any[] = [];
  public user_id: number = null;
  public is_balcony: boolean = false;
  public deliveryFee: string;
  public deliveryFeeNumber: number;
  public cvv: string;

  public address: any;
  public card: any;

  public showAddress: boolean;
  public showCard: boolean;
  public show_spinner: boolean = false;
  public showCvvInput: boolean = false;

  constructor (public navCtrl: NavController,
               public navParams: NavParams,
               public auth: AuthProvider,
               public http: Http,
               public modalCtrl: ModalController,
               public actionSheetCtrl: ActionSheetController,
               public configProvider: ConfigProvider,
               public defaultRequest: DefaultRequestOptionsProvider,
               private shoppingBagProvider: ShoppingBagProvider) {
    this.subtotalValue = this.navParams.get('total_value');
    this.showAddress = false;
    this.showCard = false;
  }

  ionViewDidEnter () {
    this.showCvvInput = false;
    this.cvv = null;

    this.getDeliveryFee();
    this.getAddresses();
    setTimeout(() => {
      this.getCreditCards();
    }, 1000);
    this.getProducts();
    this.getPaymentInstallments();
    this.selectInstallment();
  }

  getDeliveryFee () {
    if (this.is_balcony) {
      this.deliveryFeeNumber = 0.00;
      this.deliveryFee = Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(this.deliveryFeeNumber);

      let total: number = parseFloat(this.subtotalValue.replace(',','.'));
      this.totalValue = Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(total);

      return;
    }

    return this.http
      .get(`${this.configProvider.base_url}/delivery-fee?price=${this.subtotalValue}`, this.defaultRequest.merge(new RequestOptions))
      .map((res: Response) => res.json())
      .subscribe(res => {
        this.deliveryFeeNumber = parseFloat(res);

        this.deliveryFee = Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(this.deliveryFeeNumber);

        let total: number = parseFloat(this.subtotalValue.replace(',','.')) + this.deliveryFeeNumber;

        this.totalValue = Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(total);
        },
        err => {
          console.log(err);
        });
  }
  /**
   * Get all Addresses of logged user.
   */
  getAddresses () {
    this.auth.getUser().subscribe(
      res => {
        this.user_id = res.data.id // user_id to send on request
        this.addresses = res.data.addresses.data

        // Ordering
        this.addresses = _.orderBy(this.addresses, 'street', 'asc')

        // Remove addresses out of itajubá
        this.addresses = _.remove([...this.addresses], {'city': 'Itajubá'})

        // Select Main Address
        this.address = _.remove([...this.addresses], {'is_principal': true})[0]

        this.showAddress = true
      },
      err => {
        console.log(err)
      }
    )
  }

  getCreditCards () {
    return this.http
      .get(`${this.configProvider.base_url}/cards?user_id=${this.user_id}`, this.defaultRequest.merge(new RequestOptions))
      .map((res: Response) => res.json())
      .subscribe(res => {
          this.cards = res.data

          this.cards.map((card) => {
            card.date = new Date(card.date.date)
            card.date = this.formatDate(card)
          })

          this.card = this.cards[0]

          this.showCard = true
        },
        err => {
          console.log(err)
          this.getCreditCards()
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

        this.formatProducts(this.products);

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
    let num_installments: number = 1;

    // Calculate the installments values
    for (let i = 1; i <= num_installments; i++) {
      let installment = parseFloat(this.totalValue.replace(',', '.')) / i;

      // Push to array with correct money format
      this.paymentInstallments.push({value: i, text: `${i}x - ${BRL.format(installment)}`});
    }
  }

  createInvoice () {
    if (!this.cvv) {
      this.showCvvInput = true;
      return;
    }

    this.showCvvInput = false;
    this.show_spinner = !this.show_spinner;

    // Adiciona o cvv ao cartão
    this.card.cvc = this.cvv;

    let body = {
      address_id: this.address.id,
      user_id: this.user_id,
      products: this.products.map(item => {
        return {id: item.id, amount: item.amount, value: item.value};
      }),
      total: this.products.reduce((sum, product) => {
        return sum + (product.value * product.amount)
      }, 0),
      total_in_client: this.products.reduce((sum, product) => {
        return sum + (product.real_value * product.amount)
      }, 0),
      delivery_fee: this.deliveryFeeNumber,
      is_delivery: !this.is_balcony,
      installments: this.selectedInstallment['value'],
      card_flag: this.card.flag,
      card: this.card
    };

    this.http
      .post(`${this.configProvider.base_url}/invoices`, body, this.defaultRequest.merge(new RequestOptions))
      // .map((res: Response) => res.json())
      .subscribe(res => {

        if (res.status === 201) {
          let data = res.json();

          this.clearShoppingBag();
          this.goToInvoicePage(data.id);
        }

      },
        err => {
          console.log(err);
        });
  }

  /**
   *
   */
  selectInstallment () {
    this.selectedInstallment = _.find(this.paymentInstallments, {value: this.numPayments});
  }

  /**
   * Show modal for new credit card form.
   */
  presentNewCardModal() {
    const newAddressModal = this.modalCtrl.create(CardNewPage, {
      user_id: this.user_id,
      mode: 'new'
    });

    // When modal closes
    newAddressModal.onDidDismiss(data => {
      if (data.number != '') {
        this.updateCardArray(data);
      }
    });

    newAddressModal.present();
  }

  /**
   *
   */
  openAddressSelector () {
    let data: any[] = [];

    for (let address of this.addresses) {
      data.push({
        text: `${address.street}, ${address.number}. ${address.city}-${address.state}`,
        handler: () => {
          this.selectAddress(address);
        }
      })
    }

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Endereços fora da área de entrega não são exibidos.',
      subTitle: '',
      enableBackdropDismiss: true,
      buttons: data
    });

    actionSheet.present();
  }

  selectAddress (address) {
    this.address = address;
  }

  /**
   *
   */
  openCardSelector () {
    let data: any[] = [];

    for (let card of this.cards) {
      data.push({
        text: `${card.number} - Val: ${card.date} (${card.name})`,
        handler: () => {
          this.selectCard(card);
        }
      })
    }

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Selecionar cartão de crédito',
      enableBackdropDismiss: true,
      buttons: data
    });

    actionSheet.present();
  }

  selectCard (card) {
    this.card = card;
  }

  /**
   * Remove all products from shopping bag.
   */
  clearShoppingBag () {
    localStorage.removeItem('shopping_bag');
  }

  goToInvoicePage (invoice_id) {
    this.navCtrl.setRoot(TabsPage);
    this.navCtrl.popToRoot();
    this.navCtrl.push(InvoiceDetailsPage, {
      id: invoice_id
    });
  }

  formatDate (card) {
    return `${card.date.getMonth()}/${card.date.getFullYear()}`;
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
   * Update cards array to match created/updated values.
   *
   * @param data
   */
  updateCardArray (data) {
    data.number = CardPage.formatCardNumber(data.number, 4).join(' ')
    data.flag = CardPage.generateCardLogo(data)

    this.cards = _.reject(this.cards, {id: data.id}) // Removes card from array
    this.cards.push(data) // Push new/updated value
    this.cards = _.orderBy(this.cards, 'number', 'asc') // Ordering

    // Seta cartão principal
    this.card = this.cards[0]

    // Atualiza flag
    this.showCard = true
  }
}
