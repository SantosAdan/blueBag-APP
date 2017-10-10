import {Component, NgModule} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {LoginPage} from "../login/login";
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import {ConfigProvider} from "../../providers/config/config";
import {MaskDirective} from "../../directives/mask/mask";

@NgModule({
  declarations: [ MaskDirective ],
})
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {

  public user: {
    name: string;
    cpf: number;
    email: string;
    password: string;
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

  public searchInput: string = '';
  public citiesList: any;
  public showSearch: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: Http,
              public configProvider : ConfigProvider) {
  }

  ngOnInit() {
    this.user = {name: '', cpf: null, email: '', password: ''};
    this.address = {street: '', number: null, complement: '', district: '', city: '', state: '', zipcode: ''};
    this.showSearch = true;
  }

  /**
   * Return to Login Page.
   */
  goToLoginPage() {
    this.navCtrl.push(LoginPage);
  }

  findCEP() {
    this.http.get(`https://viacep.com.br/ws/${this.address.zipcode}/json/`)
        .map((res: Response) => res.json())
        .subscribe(res => {
          //noinspection TypeScriptUnresolvedVariable
          this.address = {
            street: res.logradouro,
            number: null,
            complement: res.complemento,
            district: res.bairro,
            city: res.localidade,
            state: res.uf,
            zipcode: res.cep
          }
        },
        err => {
          console.log(err);
        })
  }

  getCities() {

    if (this.searchInput == '') {
      this.citiesList = [];
      return;
    }

    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers});

    this.http
        .get(`${this.configProvider.base_url}/cities`, options)
        .map((res:Response) => res.json())
        .subscribe(res => {
          this.citiesList = res.data;
        });
  }

  setCity(city) {
    this.showSearch = false;

    this.address.city = city.name;
    this.address.state = city.state;
  }

  /**
   * SignUp a user with given credendtials.
   */
  signUp() {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers});

    let body = {
      "name": this.user.name,
      "email": this.user.email,
      "password": this.user.password,
      "cpf": this.user.cpf,

      "street": this.address.street,
      "number": this.address.number,
      "complement": this.address.complement,
      "district": this.address.district,
      "city": this.address.city,
      "state": this.address.state,
      "zipcode": this.address.zipcode
    };

    this.http
        .post(`${this.configProvider.base_url}/users`, body, options)
        .map((res:Response) => res.json())
        .subscribe(res => {
          this.goToLoginPage();
        });
  }
}
