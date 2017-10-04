import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from "@ionic-native/network";

import { DepartmentPage } from '../pages/department/department';
import { CategoryDetailPage } from '../pages/category_detail/category_detail';
import { ShoppingBagPage } from '../pages/shopping_bag/shopping-bag';
import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { SignUpPage } from '../pages/sign-up/sign-up';
import {UserDataPage} from "../pages/user-data/user-data";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StorageProvider } from '../providers/storage/storage';
import { JwtProvider } from '../providers/jwt/jwt';
import { AuthProvider } from '../providers/auth/auth';
import { DefaultRequestOptionsProvider } from '../providers/default-request-options/default-request-options';
import { MaskDirective } from '../directives/mask/mask';
import { ConfigProvider } from '../providers/config/config';


@NgModule({
  declarations: [
    MyApp,
    DepartmentPage,
    CategoryDetailPage,
    ShoppingBagPage,
    HomePage,
    SettingsPage,
    TabsPage,
    LoginPage,
    SignUpPage,
    UserDataPage,
    MaskDirective
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DepartmentPage,
    CategoryDetailPage,
    ShoppingBagPage,
    HomePage,
    SettingsPage,
    TabsPage,
    LoginPage,
    SignUpPage,
    UserDataPage
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
    ConfigProvider
  ]
})
export class AppModule {}
