import {NgModule, ErrorHandler} from '@angular/core';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {IonicStorageModule} from '@ionic/storage';
import {Network} from "@ionic-native/network";

import {DepartmentPage} from '../pages/department/department';
import {CategoryDetailPage} from '../pages/category_detail/category_detail';
import {ShoppingBagPage} from '../pages/shopping_bag/shopping-bag';
import {HomePage} from '../pages/home/home';
import {SettingsPage} from '../pages/settings/settings';
import {TabsPage} from '../pages/tabs/tabs';
import {LoginPage} from '../pages/login/login';
import {SignUpPage} from '../pages/sign-up/sign-up';
import {UserDataPage} from "../pages/user-data/user-data";
import {AddressPage} from "../pages/address/address";
import {AddressNewPage} from "../pages/address-new/address-new";
import {CheckoutPage} from "../pages/checkout/checkout";
import {InvoicePage} from "../pages/invoice/invoice";
import {InvoiceDetailsPage} from "../pages/invoice-details/invoice-details";
import {CardPage} from "../pages/card/card";
import {CardNewPage} from "../pages/card-new/card-new";
import {ProductPage} from "../pages/product/product";
import {UseTermsPage} from "../pages/use-terms/use-terms";
import {PoliceTermsPage} from "../pages/police-terms/police-terms";

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StorageProvider} from '../providers/storage/storage';
import {JwtProvider} from '../providers/jwt/jwt';
import {AuthProvider} from '../providers/auth/auth';
import {DefaultRequestOptionsProvider} from '../providers/default-request-options/default-request-options';

import {ConfigProvider} from '../providers/config/config';
import {ShoppingBagProvider} from '../providers/shopping-bag/shopping-bag';
import {RefreshTokenProvider} from '../providers/refresh-token/refresh-token';
import {ReadMoreComponent} from "../pages/read-more";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import {MaskDirective} from '../directives/mask/mask';
import {FaqPage} from "../pages/faq/faq";
import {OpenCasePage} from "../pages/open-case/open-case";


@NgModule({
  declarations: [
    MyApp,
    DepartmentPage,
    CategoryDetailPage,
    ProductPage,
    ShoppingBagPage,
    HomePage,
    SettingsPage,
    TabsPage,
    LoginPage,
    SignUpPage,
    UserDataPage,
    AddressPage,
    AddressNewPage,
    CheckoutPage,
    InvoicePage,
    InvoiceDetailsPage,
    CardPage,
    CardNewPage,
    UseTermsPage,
    PoliceTermsPage,
    FaqPage,
    OpenCasePage,
    MaskDirective,
    ReadMoreComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DepartmentPage,
    CategoryDetailPage,
    ProductPage,
    ShoppingBagPage,
    HomePage,
    SettingsPage,
    TabsPage,
    LoginPage,
    SignUpPage,
    UserDataPage,
    AddressPage,
    AddressNewPage,
    CheckoutPage,
    InvoicePage,
    InvoiceDetailsPage,
    CardPage,
    CardNewPage,
    UseTermsPage,
    PoliceTermsPage,
    FaqPage,
    OpenCasePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Network,
    StorageProvider,
    JwtProvider,
    AuthProvider,
    DefaultRequestOptionsProvider,
    ConfigProvider,
    ShoppingBagProvider,
    RefreshTokenProvider
  ]
})
export class AppModule {
}
