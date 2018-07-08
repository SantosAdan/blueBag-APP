import {Component} from '@angular/core';
import {NavController, NavParams, ToastController, AlertController, ActionSheetController} from 'ionic-angular';
import {Http, RequestOptions, Response} from "@angular/http";
import {ConfigProvider} from "../../providers/config/config";
import {DefaultRequestOptionsProvider} from "../../providers/default-request-options/default-request-options";


@Component({
  selector: 'page-invoice-details',
  templateUrl: 'invoice-details.html',
})
export class InvoiceDetailsPage {

  public invoice: any;
  public address: any;
  public products: any;
  public created_hour: string;
  public BRL = new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'});
  public invoiceSubtotal;
  public invoiceTotal;
  public step1Class: string = '';
  public step3Class: string = '';
  public step2Class: string = '';
  public step4Class: string = '';
  public cards: any[] = [];
  public card: any;
  public cvv: string;

  constructor (public navCtrl: NavController,
               public navParams: NavParams,
               public http: Http,
               public toastCtrl: ToastController,
               public alertCtrl: AlertController,
               public actionSheetCtrl: ActionSheetController,
               public configProvider: ConfigProvider,
               public defaultRequest: DefaultRequestOptionsProvider) {
  }

  ionViewDidEnter () {
    let id = this.navParams.get('id');
    this.getInvoiceData(id);
  }

  getInvoiceData (id) {
    return this.http
      .get(`${this.configProvider.base_url}/invoices/${id}`, this.defaultRequest.merge(new RequestOptions))
      .map((res: Response) => res.json())
      .subscribe(res => {
          this.invoice = res.data;

          this.invoiceSubtotal = this.invoice.total;
          this.invoiceTotal = this.invoiceSubtotal + this.invoice.delivery_fee;
          this.invoiceTotal = this.BRL.format(this.invoiceTotal);

          this.invoice.total = this.BRL.format(this.invoice.total);
          this.invoice.created_at = new Date(this.invoice.created_at.date);
          this.created_hour = this.formatHour(this.invoice);
          this.invoice.created_at = Intl.DateTimeFormat('pt-BR').format(this.invoice.created_at);

          this.address = res.data.address.data;
          this.address.zipcode = this.formatZipcode(this.address.zipcode, '#####-###');

          this.products = res.data.products.data;

          this.formatProducts(this.products);

          if(this.invoice.status == 'Aprovação do pagamento' || this.invoice.status == 'Pagamento recusado') {
            this.step1Class = 'current';
          } else if (this.invoice.status == 'Separação dos produtos' || this.invoice.status == 'Produtos indisponíveis em estoque' || this.invoice.status == 'Pedido reprocessado manualmente') {
            this.step1Class = 'visited';
            this.step2Class = 'current';
          } else if (this.invoice.status == 'Pedido separado para entrega') {
            this.step1Class = 'visited';
            this.step2Class = 'visited';
            this.step3Class = 'current';
          } else {
            this.step1Class = 'visited';
            this.step2Class = 'visited';
            this.step3Class = 'visited';
            this.step4Class = 'current';
          }

          if (this.invoice.status == 'Pagamento recusado') {
            this.getCreditCards()
          }
        },
        err => {
          console.log(err)
        })
  }

  redoPayment () {
    let body = {
      invoiceId: this.invoice.id,
      cardId: this.card.id,
      cardCVV: this.card.cvc
    };

    this.http
      .post(`${this.configProvider.base_url}/redo`, body, this.defaultRequest.merge(new RequestOptions))
      // .map((res: Response) => res.json())
      .subscribe(res => {
        if (res.status === 201) {
          this.presentToast('Pagamento realizado com sucesso!', 'success');
          this.getInvoiceData(this.invoice.id);
        }
      },
        err => {
          this.presentToast('Oops! Ocorreu um erro inesperado.', 'error');
          console.log(err);
        });
  }

  /**
   * Get all user credit cards.
   */
  getCreditCards () {
    return this.http
      .get(`${this.configProvider.base_url}/cards?user_id=${this.invoice.user_id}`, this.defaultRequest.merge(new RequestOptions))
      .map((res: Response) => res.json())
      .subscribe(res => {
          this.cards = res.data

          this.cards.map((card) => {
            card.date = new Date(card.date)
            card.date = this.formatCardDate(card)
            card.number = this.formatCardNumber(card)
          })
        },
        err => {
          console.log(err)
          this.getCreditCards()
        })
  }

  /**
   * Abre a seleção para escolher um nobo cartão.
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

  /**
   * Seleciona o cartão a ser usado.
   * @param card Cartão selecionado
   */
  selectCard (card) {
    // Seleciona o cartão a ser usado
    this.card = card;

    // Abre o input do cvv
    this.openCVVPrompt();
  }

  openCVVPrompt () {
    let alert = this.alertCtrl.create({
      title: 'Informe o CVV',
      message: 'Dígitos de segurança (verso do cartão)',
      inputs: [
        {
          name: 'cvv',
          placeholder: '123'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {}
        },
        {
          text: 'Pagar com este cartão',
          handler: data => {
            if (data.cvv != '') {
              this.card.cvc = data.cvv
              this.redoPayment()
            } else {
              this.presentToast('Por favor, insira o CVV!', 'error');
            }
          }
        }
      ]
    });

    alert.present();
  }

  /**
   * Formata o cep para o formato brasileiro
   * @param value Valor do CEP
   * @param pattern Padrão desejado
   */
  formatZipcode (value, pattern) {
    let i = 0,
      v = value.toString();
    return pattern.replace(/#/g, _ => v[i++]);
  }

  /**
   * Format products attributes.
   */
  private formatProducts (products) {
    products.map(product => {
      //product.value = Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(product.value);
      product.value = product.invoice_price;
      product.amount = product.invoice_amount;
      product.variety = (product.variety == '...' || product.variety == 'vazio') ? '' : product.variety;
      product.package = (product.package == '...' || product.package == 'vazio') ? '' : product.package;
    });
  }

  /**
   * Format credit card date.
   * @param card
   */
  formatCardDate (card) {
    return `${card.date.getMonth()}/${card.date.getFullYear()}`;
  }

  /**
   * Format credit card number.
   * @param card
   */
  formatCardNumber (card) {
    return `${card.number.replace(/(\d{4})/g, '$1 ').replace(/(^\s+|\s+$)/,'')}`;
  }

  formatDate(invoice) {
    return `${invoice.created_at.getDate()}/${invoice.created_at.getMonth()+1}/${invoice.created_at.getFullYear()}`;
  }

  formatHour(invoice) {
    return `${invoice.created_at.getHours()}:${invoice.created_at.getMinutes()}`;
  }

  /**
   * Show toast message.
   *
   * @param message
   * @param type
   */
  presentToast (message: string, type: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1500,
      position: 'top',
      cssClass: type
    });
    toast.present();
  }
}
