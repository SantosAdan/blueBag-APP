import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';

import { CategoryPage } from '../pages/category/category';
import { CategoryDetailPage } from '../pages/category_detail/category_detail';
import { ShoppingBagPage } from '../pages/shopping_bag/shopping-bag';
import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { SignUpPage } from '../pages/sign-up/sign-up';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StorageProvider } from '../providers/storage/storage';
import { JwtProvider } from '../providers/jwt/jwt';
import { AuthProvider } from '../providers/auth/auth';
import { DefaultRequestOptionsProvider } from '../providers/default-request-options/default-request-options';

@NgModule({
  declarations: [
    MyApp,
    CategoryPage,
    CategoryDetailPage,
    ShoppingBagPage,
    HomePage,
    SettingsPage,
    TabsPage,
    LoginPage,
    SignUpPage
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
    CategoryPage,
    CategoryDetailPage,
    ShoppingBagPage,
    HomePage,
    SettingsPage,
    TabsPage,
    LoginPage,
    SignUpPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    StorageProvider,
    JwtProvider,
    AuthProvider,
    DefaultRequestOptionsProvider
  ]
})
export class AppModule {}
