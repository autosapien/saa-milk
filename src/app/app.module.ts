import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { GooglePlusMock } from './mock/mock';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MilkEntryPage } from './milk-entry/milk-entry.page';

import { AuthGuardService } from './services/auth-guard.service';
import { DeptDataService } from './services/dept-data.service';

@NgModule({
  declarations: [AppComponent, MilkEntryPage],
  entryComponents: [MilkEntryPage],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthGuardService,
    DeptDataService,
    GooglePlus,
    GooglePlusMock,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
