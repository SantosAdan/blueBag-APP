import {Component, ViewChild} from '@angular/core';
import {Content, ModalController, NavController} from 'ionic-angular';
import {LoginPage} from "../login/login";
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import {ConfigProvider} from "../../providers/config/config";
import {PoliceTermsPage} from "../police-terms/police-terms";
import {UseTermsPage} from "../use-terms/use-terms";

@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  @ViewChild(Content) content: Content;

  public user: {
    name: string;
    cpf: number;
    birthday_date: string;
    email: string;
    password: string;
    password_confirmation: string;
  };

  public address: {
    street: string;
    number: number;
    complement: string;
    district: string;
    city: string;
    state: string;
    zipcode: string;
  };

  public showCityOutofDeliveryRangeAlert: boolean;
  public isAddressFilled: boolean;
  public errors: any[] = [];

  constructor(public navCtrl: NavController,
              public http: Http,
              public configProvider : ConfigProvider,
              public modalCtrl: ModalController) {
    this.showCityOutofDeliveryRangeAlert = false
    this.isAddressFilled = false
  }

  ngOnInit() {
    this.user = {name: '', cpf: null, birthday_date: '', email: '', password: '', password_confirmation: ''}
    this.address = {street: '', number: null, complement: '', district: '', city: '', state: '', zipcode: ''}
  }

  /**
   * Return to Login Page.
   */
  goToLoginPage() {
    this.navCtrl.push(LoginPage)
  }

  /**
   * Make call to ViaCep API to find address info for typed Zipcode.
   */
  findCEP() {
    this.http.get(`https://viacep.com.br/ws/${this.address.zipcode}/json/`)
        .map((res: Response) => res.json())
        .subscribe(res => {
          if (res.localidade != 'Itajubá') {

            this.showCityOutofDeliveryRangeAlert = true

          } else {

            this.address = {
              street: res.logradouro,
              number: null,
              complement: res.complemento,
              district: res.bairro,
              city: res.localidade,
              state: res.uf,
              zipcode: res.cep
            }

            this.isAddressFilled = true
            this.showCityOutofDeliveryRangeAlert = false
          }
        },
        err => {

        })
  }

  /**
   * SignUp a user with given credendtials.
   */
  signUp() {
    let headers = new Headers()
    headers.append('Accept', 'application/json')
    headers.append('Content-Type', 'application/json')
    let options = new RequestOptions({ headers: headers})

    let body = {
      "name": this.user.name,
      "email": this.user.email,
      "birthday_date": this.user.birthday_date,
      "password": this.user.password,
      "password_confirmation": this.user.password_confirmation,
      "cpf": this.user.cpf,

      "street": this.address.street,
      "number": this.address.number,
      "complement": this.address.complement,
      "district": this.address.district,
      "city": this.address.city,
      "state": this.address.state,
      "zipcode": this.address.zipcode
    }

    this.http
        .post(`${this.configProvider.base_url}/users`, body, options)
        .map((res:Response) => res.json())
        .subscribe(res => {
          this.goToLoginPage()
        },
          err => {
            this.errors = err.json().errors
            this.scrollToTop()
          })
  }

  /**
   * Show modal for new credit card form.
   */
  presentUseTermsModal() {
    const useTermsModal = this.modalCtrl.create(UseTermsPage);

    useTermsModal.present();
  }

  /**
   * Show modal for new credit card form.
   */
  presentPoliceTermsModal() {
    const policeTermsModal = this.modalCtrl.create(PoliceTermsPage);

    policeTermsModal.present();
  }

  scrollToTop () {
    this.content.scrollToTop();
  }
}
