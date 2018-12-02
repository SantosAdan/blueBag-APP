import {Component} from '@angular/core';
import {NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {DefaultRequestOptionsProvider} from "../../providers/default-request-options/default-request-options";
import {ConfigProvider} from "../../providers/config/config";
import {Http, Response, RequestOptions} from "@angular/http";
import {CardPage} from "../card/card";


@Component({
  selector: 'page-card-new',
  templateUrl: 'card-new.html',
})
export class CardNewPage {

  public userId: number;
  public mode: string;
  public card: any;

  constructor (public navCtrl: NavController,
               private http: Http,
               private navParams: NavParams,
               public viewCtrl: ViewController,
               public toastCtrl: ToastController,
               private configProvider: ConfigProvider,
               private defaultRequest: DefaultRequestOptionsProvider) {
    this.userId = this.navParams.get('user_id');
    this.mode = this.navParams.get('mode');

    this.card = {
      "number": '',
      "name": '',
      "cpf": '',
      "flag": '',
      "date": '',
      "cvc": '',
    }
  }

  ionViewDidEnter () {
    // Get address data
    if (this.mode == 'edit') {
      this.getCardById(this.navParams.get('card_id'));
    }
  }

  /**
   * Get credit card info.
   *
   * @param card_id
   * @returns {Subscription}
   */
  getCardById (card_id) {
    return this.http
      .get(`${this.configProvider.base_url}/cards/${card_id}/edit`, this.defaultRequest.merge(new RequestOptions))
      .map((res: Response) => res.json())
      .subscribe(res => {
          this.card = res.data;
          this.card.date = new Date(this.card.date);
          this.card.date = this.formatDate(this.card);
        },
        err => {
          console.log(err);
        });
  }

  /**
   * Store new credit card.
   *
   * @returns {Subscription}
   */
  storeCard () {
    let body = this.mountRequestBody();

    return this.http
      .post(`${this.configProvider.base_url}/cards`, body, this.defaultRequest.merge(new RequestOptions))
      .map((res: Response) => res.json())
      .subscribe(res => {
          this.presentToast('Cartão cadastrado com sucesso.', 'success');
          // Close modal
          this.closeModal();
        },
        err => {
          if (err.status == 500) {
            this.presentToast('Cartão não pode ser cadastrado. Tente novamente.', 'error');
          }
        });
  }

  /**
   * Update credit card info.
   *
   * @param card_id
   * @returns {Subscription}
   */
  updateCard (card_id) {
    let body = this.mountRequestBody();
    console.log(body);
    return this.http
      .put(`${this.configProvider.base_url}/cards/${card_id}`, body, this.defaultRequest.merge(new RequestOptions))
      .map((res: Response) => res.json())
      .subscribe(res => {
          this.presentToast('Cartão editado com sucesso.', 'success');
          // Close modal
          this.closeModal();
        },
        err => {
          if (err.status == 500) {
            this.presentToast('Cartão não pode ser editado. Tente novamente.', 'error');
          }
        });
  }

  /* HELPER METHODS */
  /**
   * Fill request body with address data.
   *
   * @returns {Object}
   */
  mountRequestBody() {

    this.card.number = this.card.number != null ? this.clearMask(this.card.number) : this.card.number;
    this.card.cpf = this.card.cpf != null ? this.clearMask(this.card.cpf) : this.card.cpf;
    this.card.cvc = this.card.cvc != null ? this.card.cvc.slice(0, 3) : this.card.cvc;

    let date = this.card.date.split('-');
    this.card.date = `${date[1]}/${date[0]}`;

    return {
      "user_id": this.userId,
      "number": this.card.number,
      "name": this.card.name,
      "date": this.card.date,
      "cvc": this.card.cvc,
      "cpf": this.card.cpf,
      "flag": CardPage.generateCardLogo(this.card).replace('.png', '')
    };
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
      cssClass: type,
      duration: 2000,
      position: 'top',
    });

    toast.present();
  }

  showDatePicker () {

  }

  onInput () {
    this.card.flag = CardPage.generateCardLogo(this.card);
  }

  /**
   * Format credit card due date to show only month and year
   *
   * @param {Object} card
   * @Pattern: MM/YYYY
   * @returns: {string}
   */
  formatDate (card) {
    return `${card.date.getFullYear()}-${card.date.getMonth()+1}`;
  }

  /**
   * Close modal of creating/editing.
   */
  closeModal () {
    this.viewCtrl.dismiss(this.card);
  }

  clearMask(maskedValue:string) {
    return maskedValue.replace(/\D/g,'');
  }
}
