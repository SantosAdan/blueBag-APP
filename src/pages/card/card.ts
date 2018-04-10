import {Component} from '@angular/core';
import {
  ActionSheetController, AlertController, ModalController, NavController,
  ToastController
} from 'ionic-angular';
import {AuthProvider} from "../../providers/auth/auth";
import {Http, Response, RequestOptions} from "@angular/http";
import {ConfigProvider} from "../../providers/config/config";
import {DefaultRequestOptionsProvider} from "../../providers/default-request-options/default-request-options";
import * as _ from 'lodash';
import {CardNewPage} from "../card-new/card-new";

@Component({
  selector: 'page-card',
  templateUrl: 'card.html',
})
export class CardPage {

  public cards: any[] = [];
  private userId: string;

  constructor (public navCtrl: NavController,
               private auth: AuthProvider,
               public modalCtrl: ModalController,
               public toastCtrl: ToastController,
               public alertCtrl: AlertController,
               public actionSheetCtrl: ActionSheetController,
               private http: Http,
               private configProvider: ConfigProvider,
               private defaultRequest: DefaultRequestOptionsProvider) {
  }

  ionViewDidEnter () {
    this.getCreditCards();
  }

  /**
   * Get user's credit cards.
   */
  getCreditCards () {
    this.auth.getUser().subscribe(
      res => {
        this.userId = res.data.id;
        this.cards = res.data.cards.data;

        this.cards.map((card) => {
          card.number = CardPage.formatCardNumber(card.number, 4).join(' ');
          card.date = new Date(card.date.date);
          card.date = CardPage.formatDate(card);
          card.flag = CardPage.generateCardLogo(card);
        });

        // Ordering
        this.cards = _.orderBy(this.cards, 'number', 'asc');

      },
      err => {
        console.log(err);
      }
    );
  }

  /**
   * Deletes selected credit card.
   *
   * @param card_id
   */
  deleteCard(card_id) {
    this.http
      .delete(`${this.configProvider.base_url}/cards/${card_id}`, this.defaultRequest.merge(new RequestOptions))
      .map((res: Response) => res.json())
      .subscribe(res => {
          // Remove o cartão do array
          let removed = _.remove(this.cards, {'id': card_id});

          // Exibe toast de sucesso
          if (res == null && removed) {
            this.presentToast('Cartão apagado com sucesso.', 'success');
          }
        },
        err => {
          if (err.status == 500) {
            // Exibe toast de erro
            this.presentToast('Cartão não foi apagado.', 'error');
          }
        });
  }

  /**
   * Show confirm removing card alert.
   *
   */
  showConfirm(card_id) {
    let alert = this.alertCtrl.create({
      title: '',
      message: 'Deseja apagar este cartão?',
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
            this.deleteCard(card_id);
          }
        }
      ]
    });

    alert.present();
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
      dismissOnPageChange: true,
    });

    toast.present();
  }

  /**
   *
   */
  presentActionSheet (card_id) {
    let actionSheet = this.actionSheetCtrl.create({
      title: '',
      buttons: [
        {
          text: 'Remover',
          icon: 'trash',
          role: 'destructive',
          handler: () => {
            this.showConfirm(card_id);
          }
        }, {
          text: 'Editar',
          icon: 'create',
          handler: () => {
            this.presentEditCardModal(card_id);
          }
        }
      ]
    });
    actionSheet.present();
  }

  /**
   * Show modal for new credit card form.
   */
  presentNewCardModal() {
    const newAddressModal = this.modalCtrl.create(CardNewPage, {
      user_id: this.userId,
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
   * Show modal for edit card form.
   */
  presentEditCardModal(card_id) {
    const editCardModal = this.modalCtrl.create(CardNewPage, {
      user_id: this.userId,
      card_id: card_id,
      mode: 'edit'
    });

    // When modal closes
    editCardModal.onDidDismiss(data => {
      if (data) {
        this.updateCardArray(data);
      }
    });

    editCardModal.present();
  }

  /**
   * Format credit card due date to show only month and year
   *
   * @param {Object} card
   * @Pattern: MM/YYYY
   * @returns: {string}
   */
  static formatDate (card) {
    return `${card.date.getMonth()+1}/${card.date.getFullYear()}`;
  }

  /**
   * Format credit card number adding spaces after 4 characters.
   *
   * @param {string} cardNumber
   * @param {number} numChar
   * @returns {Array}
   */
  static formatCardNumber (cardNumber : string, numChar : number) {
    let formattedString = [];
    let i = 0;

    while (i < cardNumber.length) {
      formattedString.push(cardNumber.substr(i, numChar));
      i += numChar;
    }

    return formattedString;
  };

  /**
   * Verify credit card number to discover which enterprise it belongs.
   *
   * @param card
   * @returns {string}
   */
  static generateCardLogo (card) {
    let cardLogo: string;
    let firstDigit: string = card.number.charAt(0);
    let twoDigits: string = card.number.substring(0, 2);
    let threeDigits: string = card.number.substring(0, 3);
    let fourDigits: string = card.number.substring(0, 4);

    if (firstDigit == '4') {
      cardLogo = 'visa.png';
    } else if (twoDigits == '50') {
      cardLogo = 'aura.png';
    } else if (firstDigit == '5') {
      cardLogo = 'mastercard.png';
    } else if (twoDigits == '35') {
      cardLogo = 'jcb.png';
    } else if (twoDigits == '34' || twoDigits == '37') {
      cardLogo = 'amex.png';
    } else if (twoDigits == '36' || twoDigits == '38' || threeDigits == '301' || threeDigits == '305') {
      cardLogo = 'diners.png';
    } else if (threeDigits == '622' || twoDigits == '64' || twoDigits == '65' || fourDigits == '6011') {
      cardLogo = 'discover.png';
    } else if (card.number == '') {
      cardLogo = '';
    }
    else {
      cardLogo = 'elo.png';
    }

    return cardLogo;
  }

  /**
   * Update cards array to match created/updated values.
   *
   * @param data
   */
  updateCardArray (data) {
    data.number = CardPage.formatCardNumber(data.number, 4).join(' ');
    data.flag = CardPage.generateCardLogo(data);

    this.cards = _.reject(this.cards, {id: data.id}); // Removes card from array
    this.cards.push(data); // Push new/updated value
    this.cards = _.orderBy(this.cards, 'number', 'asc'); // Ordering
  }
}
