import {Component} from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import { AuthProvider } from "../../providers/auth/auth";

@Component({
  selector: 'page-user-data',
  templateUrl: 'user-data.html',
})
export class UserDataPage {

  public user: {
    id: number,
    name: string,
    email: string,
    birthday_date: any;
    cpf: number,
    phone: number,
    password: string
  };

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public auth: AuthProvider,
      public toastCtrl: ToastController) {
      this.user = {id: null, name: '', email: '', birthday_date: '', cpf: null, phone: null, password: null};
  }

  ionViewDidLoad() {
    this.auth.getUser().subscribe(
        res => {
          //noinspection TypeScriptUnresolvedVariable
          this.user = {
            id: res.data.id,
            name: res.data.name,
            email: res.data.email,
            birthday_date: res.data.birthday_date,
            cpf: res.data.cpf,
            phone: res.data.phone,
            password: null,
          };
          this.user.birthday_date = new Date(this.user.birthday_date.date);
          this.user.birthday_date = this.formatDate(this.user.birthday_date);
        },
        err => {
          console.log(err);
        }
    );
  }

  public editUserData() {
    let toast = this.toastCtrl.create({
      message: 'Dados alterados com sucesso!',
      duration: 1500,
      position: 'top',
      cssClass: 'success'
    });

    this.auth.editUser(this.user).subscribe(
        res => {
          toast.present();
        },
        err => {
          console.log(err);
        }
    );
  }

  /**
   * Format birthday date to show correct pattern
   *
   * @Pattern: DD/MM/YYYY
   * @returns: {string}
   * @param date
   */
  formatDate (date) {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  }

}
