import {Component} from "@angular/core";
import {Events, ModalController, NavController, ToastController} from "ionic-angular";
import {Http, RequestOptions, Response} from "@angular/http";
import {CategoryDetailPage} from "../category_detail/category_detail";
import {DefaultRequestOptionsProvider} from "../../providers/default-request-options/default-request-options";
import "rxjs/add/operator/map";
import {ConfigProvider} from "../../providers/config/config";
import {StorageProvider} from "../../providers/storage/storage";
import {RefreshTokenProvider} from "../../providers/refresh-token/refresh-token";
import {ProductPage} from "../product/product";
import {ShoppingBagProvider} from "../../providers/shopping-bag/shopping-bag";

const VIEW_MODE: string = 'bluebag_depart_view';

@Component({
  selector: 'page-department',
  templateUrl: 'department.html',
})
export class DepartmentPage {

  public departments: any[];
  public showLoading: boolean;
  public showInList: boolean = true;
  public searchText: string = '';
  public searchResults: any[] = [];

  constructor (public navCtrl: NavController,
               public modalCtrl: ModalController,
               public toastCtrl: ToastController,
               public requestOptions: DefaultRequestOptionsProvider,
               public http: Http,
               public events: Events,
               public configProvider: ConfigProvider,
               private refreshJWTProvider: RefreshTokenProvider,
               private storageProvider: StorageProvider,
               public shoppingBagProvider: ShoppingBagProvider) {
  }

  ionViewDidLoad () {
    this.showLoading = true;
    this.showInList = this.storageProvider.get(VIEW_MODE, 'cards') == 'list';

    this.getDepartments()
  }

  onInput() {
    this.showLoading = true;

    if (this.searchText == '') {
      this.searchResults = [];
      this.showLoading = false;
    } else {
      return this.http
        .get(`${this.configProvider.base_url}/products/search?q=${this.searchText}`, this.requestOptions.merge(new RequestOptions))
        .map((response: Response) => response.json())
        .subscribe(response => {
          this.searchResults = response.data;

          this.formatProducts(this.searchResults);

          this.showLoading = false;
        });
    }
  }

  /**
   * Get all departments.
   *
   * @returns {Subscription}
   */
  getDepartments (refresher = null) {
    return this.http
      .get(`${this.configProvider.base_url}/departments`, this.requestOptions.merge(new RequestOptions))
      .map((response: Response) => response.json())
      .subscribe(
        response => {
          this.departments = response.data;
          this.showLoading = false; // Retiramos o spinner de loading

          if (refresher) {
            refresher.complete();
          }
        },
        err => {
          if (err.status === 401) {
            // Refresh token
            this.refreshJWTProvider.refresh();

            // Redo request
            this.http
              .get(`${this.configProvider.base_url}/departments`, this.requestOptions.merge(new RequestOptions))
              .map((response: Response) => response.json())
              .subscribe(response => {
                this.departments = response.data;
                this.showLoading = false; // Retiramos o spinner de loading

                if (refresher) {
                  refresher.complete();
                }
              });
          }
        }
      );
  }

  /**
   * Navigate to the Products Page of a given Category.
   *
   * @param categoryName
   * @param categoryIcon
   * @param categoryId
   */
  goToProductsPage (categoryName: string, categoryIcon: string, categoryId: number) {
    this.navCtrl.push(CategoryDetailPage, {
      catName: categoryName,
      catIcon: categoryIcon,
      catId: categoryId
    });
  }

  /**
   *
   * @param product_id
   */
  showProductDetails (product_id) {
    let modal = this.modalCtrl.create(ProductPage, {id: product_id});
    modal.present();
  }

  /**
   * Add product to shopping bag.
   *
   * @param product_id
   */
  addToChart (product_id) {
    let amount = this.shoppingBagProvider.bag.reduce((sum, product) => {
      return sum + product.amount;
    }, 0);

    this.shoppingBagProvider.add(product_id, 1);
    this.events.publish('bag:updated', ++amount);

    this.presentToast('success');
  }

  /**
   * Show toast message.
   *
   * @param type
   */
  private presentToast (type: string) {
    let toast = this.toastCtrl.create({
      message: 'Produto adicionado à sacola com sucesso!',
      duration: 2000,
      position: 'top',
      cssClass: type
    });
    toast.present();
  }

  /**
   * Refresh listener.
   *
   * @param refresher
   */
  refresh (refresher) {
    this.getDepartments(refresher);
  }

  changeViewMode () {
    let mode: string;
    this.showInList = !this.showInList;

    // Save preference to storage
    mode = this.showInList == true ? 'list' : 'cards';
    this.storageProvider.set(VIEW_MODE, mode);
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

  // sendSuperpay () {
  //   // Prepare body request
  //   let body = {
  //     "codigoEstabelecimento": 1505142582390,
  //     "codigoFormaPagamento": 381,
  //     "transacao": {
  //       "numeroTransacao": 1241,
  //       "valor": 6666,
  //       "valorDesconto": 0,
  //       "parcelas": 1,
  //       "urlCampainha": "http://seusite.com.br/campainha",
  //       "urlResultado": "http://seusite.com.br/retorno",
  //       "ip": "192.168.0.107",
  //       "idioma": 1,
  //       "campoLivre1": "",
  //       "campoLivre2": "",
  //       "campoLivre3": "",
  //       "campoLivre4": "",
  //       "campoLivre5": "",
  //       "dataVencimentoBoleto": ""
  //     },
  //     "dadosCartao": {
  //       "nomePortador": "Teste Teste",
  //       "numeroCartao": "5547220000000102",
  //       "codigoSeguranca": "123",
  //       "dataValidade": "12/2026"
  //     },
  //     "itensDoPedido": [
  //       {
  //         "codigoProduto": 1,
  //         "nomeProduto": "Produto 1",
  //         "codigoCategoria": 1,
  //         "nomeCategoria": "categoria",
  //         "quantidadeProduto": 1,
  //         "valorUnitarioProduto": 6666
  //       }
  //     ],
  //     "dadosCobranca": {
  //       "codigoCliente": 1,
  //       "tipoCliente": 1,
  //       "nome": "Teste 123",
  //       "email": "teste@teste.com",
  //       "dataNascimento": "",
  //       "sexo": "M",
  //       "documento": "",
  //       "documento2": "",
  //       "endereco": {
  //         "logradouro": "Rua",
  //         "numero": "123",
  //         "complemento": "",
  //         "cep": "12345-678",
  //         "bairro": "Bairro",
  //         "cidade": "Cidade",
  //         "estado": "SP",
  //         "pais": "BR"
  //       },
  //       "telefone": [
  //         {
  //           "tipoTelefone": "1",
  //           "ddi": "55",
  //           "ddd": "12",
  //           "telefone": "1234-5678"
  //         }
  //       ]
  //     },
  //     "dadosEntrega": {
  //       "nome": "Teste 123",
  //       "email": "teste@teste.com",
  //       "dataNascimento": "",
  //       "sexo": "M",
  //       "documento": "",
  //       "documento2": "",
  //       "endereco": {
  //         "logradouro": "Rua",
  //         "numero": "123",
  //         "complemento": "",
  //         "cep": "12345-678",
  //         "bairro": "Bairro",
  //         "cidade": "Cidade",
  //         "estado": "SP",
  //         "pais": "BR"
  //       },
  //       "telefone": [
  //         {
  //           "tipoTelefone": "1",
  //           "ddi": "55",
  //           "ddd": "12",
  //           "telefone": "1234-5678"
  //         }
  //       ]
  //     }
  //   };
  //
  //   // Prepare header request
  //   let headers = new Headers();
  //   headers.append('Content-Type', 'application/json');
  //   headers.append('usuario', '{"login": "superpay", "senha": "superpay"}');
  //   let options = new RequestOptions({headers: headers});
  //
  //   // Make the request call
  //   this.http.post(`https://homologacao.superpay.com.br/checkout/api/v2/transacao`, body, options)
  //     .map((res: Response) => res.json())
  //     .subscribe(
  //       data => {
  //         console.log(data);
  //       },
  //       err => {
  //         console.log(err);
  //       }
  //     );
  // }
}
