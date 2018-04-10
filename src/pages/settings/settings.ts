import {Component} from '@angular/core';
import {NavController, AlertController, App, ModalController, ActionSheetController} from 'ionic-angular';
import {LoginPage} from "../login/login";
import {AuthProvider} from "../../providers/auth/auth";
import {UserDataPage} from "../user-data/user-data";
import {AddressPage} from "../address/address";
import {RefreshTokenProvider} from "../../providers/refresh-token/refresh-token";
import {InvoicePage} from "../invoice/invoice";
import {CardPage} from "../card/card";
import {PoliceTermsPage} from "../police-terms/police-terms";
import {UseTermsPage} from "../use-terms/use-terms";
import {FaqPage} from "../faq/faq";
import {OpenCasePage} from "../open-case/open-case";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  user_name: string;

  constructor (public navCtrl: NavController,
               public alertCtrl: AlertController,
               public modalCtrl: ModalController,
               public actionSheetCtrl: ActionSheetController,
               public app: App,
               public auth: AuthProvider,
               private refreshJWTProvider: RefreshTokenProvider) {
  }

  ionViewDidLoad () {
    this.auth.getUser().subscribe(
      res => {
        //noinspection TypeScriptUnresolvedVariable
        this.user_name = res.data.name;
      },
      err => {
        if (err.status === 401) {
          // Refresh token
          this.refreshJWTProvider.refresh();

          // Redo request
          this.auth.getUser().subscribe(
            res => {
              //noinspection TypeScriptUnresolvedVariable
              this.user_name = res.data.name;
            });
        }
      }
    );
  }

  /**
   * Logout method.
   */
  logout () {
    // Remove token from localstorage
    localStorage.removeItem('token');
    localStorage.removeItem('shopping_bag');

    // Return to login page
    this.app.getRootNav().setRoot(LoginPage); // use app.getRootNav() to fix showing tabs after logout
    this.navCtrl.popToRoot();
  }

  /**
   * Show confirm logout alert.
   */
  showAlert () {
    let alert = this.alertCtrl.create({
      title: 'Deseja mesmo sair?',
      message: 'Sentiremos sua falta :(',
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
            this.logout();
          }
        }
      ]
    });

    alert.present();
  }

  /**
   * Show user info.
   */
  goToUserDataPage () {
    this.navCtrl.push(UserDataPage);
  }

  /**
   * Show user info.
   */
  goToAddressPage () {
    this.navCtrl.push(AddressPage);
  }

  goToInvoicesPage () {
    this.navCtrl.push(InvoicePage);
  }

  goToCardsPage () {
    this.navCtrl.push(CardPage);
  }

  /**
   * Show modal for new credit card form.
   */
  presentPoliceTermsModal() {
    const policeTermsModal = this.modalCtrl.create(PoliceTermsPage);

    policeTermsModal.present();
  }

  presentUseTermsModal() {
    const policeTermsModal = this.modalCtrl.create(UseTermsPage);

    policeTermsModal.present();
  }

  presentFAQModal() {
    const faqModal = this.modalCtrl.create(FaqPage);

    faqModal.present();
  }

  gotoOpenCasePage () {
    this.navCtrl.push(OpenCasePage);
  }

  openActionSheet () {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Contato',
      enableBackdropDismiss: true,
      buttons: [
        {
          text: 'Perguntas Frequentes',
          icon: 'help',
          handler: () => {
            this.presentFAQModal();
          }
        },
        {
          text: 'Abrir Chamado',
          icon: 'call',
          handler: () => {
            this.gotoOpenCasePage();
          }
        }
      ]
    });

    actionSheet.present();
  }
}
