import {Component} from '@angular/core';
import {NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {Http, RequestOptions, Response} from "@angular/http";
import {ConfigProvider} from "../../providers/config/config";
import {DefaultRequestOptionsProvider} from "../../providers/default-request-options/default-request-options";

@Component({
    selector: 'page-address-new',
    templateUrl: 'address-new.html',
})
export class AddressNewPage {
    public userId: number;
    public mode: string;

    public address: {
        id: number;
        street: string;
        number: number;
        complement: string;
        district: string;
        city: string;
        state: string;
        zipcode: string;
    };

    constructor(public navCtrl: NavController,
                private http: Http,
                private navParams: NavParams,
                public viewCtrl: ViewController,
                public toastCtrl: ToastController,
                private configProvider: ConfigProvider,
                private defaultRequest: DefaultRequestOptionsProvider) {
        this.userId = this.navParams.get('user_id');
        this.mode = this.navParams.get('mode');
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
    }

    ionViewDidEnter() {
        // Get address data
        if (this.mode == 'edit') {
            this.getAddressbyId(this.navParams.get('address_id'));
        }
    }

    /**
     * Get address data.
     *
     * @param address_id
     * @returns {Subscription}
     */
    getAddressbyId(address_id) {
        return this.http
            .get(`${this.configProvider.base_url}/addresses/${address_id}/edit`, this.defaultRequest.merge(new RequestOptions))
            .map((res: Response) => res.json())
            .subscribe(res => {
                    this.address = res;
                },
                err => {
                    console.log(err);
                });
    }

    /**
     * Request address data by given zipcode.
     * API: ViaCep
     */
    findCEP() {
        let id = this.mode == 'new' ? null : this.navParams.get('address_id');

        this.http.get(`https://viacep.com.br/ws/${this.address.zipcode}/json/`)
            .map((res: Response) => res.json())
            .subscribe(res => {
                    //noinspection TypeScriptUnresolvedVariable
                    this.address = {
                        id: id,
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
                });
    }

    /**
     * Save new address.
     *
     * @returns {Subscription}
     */
    storeAddress() {
        let body = this.mountRequestBody();

        return this.http
            .post(`${this.configProvider.base_url}/addresses`, body, this.defaultRequest.merge(new RequestOptions))
            .map((res: Response) => res.json())
            .subscribe(res => {
                    this.presentToast('Endereço cadastrado com sucesso.', 'success');
                    // Close modal
                    this.closeModal();
                },
                err => {
                    if (err.status == 500) {
                        this.presentToast('Endereço não pode ser cadastrado. Tente novamente.', 'error');
                    }
                });
    }

    updateAddress(address_id) {
        let body = this.mountRequestBody();

        return this.http
            .put(`${this.configProvider.base_url}/addresses/${address_id}`, body, this.defaultRequest.merge(new RequestOptions))
            .map((res: Response) => res.json())
            .subscribe(res => {
                    this.presentToast('Endereço editado com sucesso.', 'success');
                    // Close modal
                    this.closeModal();
                },
                err => {
                    if (err.status == 500) {
                        this.presentToast('Endereço não pode ser editado. Tente novamente.', 'error');
                    }
                });
    }

    /**
     * Fill request body with address data.
     *
     * @returns {Object}
     */
    mountRequestBody() {
        this.address.zipcode = this.address.zipcode.toString().replace('-', '');

        return {
            "user_id": this.userId,
            "street": this.address.street,
            "number": this.address.number,
            "complement": this.address.complement,
            "district": this.address.district,
            "city": this.address.city,
            "state": this.address.state,
            "zipcode": this.address.zipcode
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

    /**
     * Close modal of creating/editing.
     */
    closeModal() {
        this.viewCtrl.dismiss(this.address);
    }
}
