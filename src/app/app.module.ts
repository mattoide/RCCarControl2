import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { BLE } from '@ionic-native/ble/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import {ModalPage} from './modal/modal.page';

@NgModule({
  declarations: [AppComponent, ModalPage],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, BluetoothSerial, BLE, ScreenOrientation],
  bootstrap: [AppComponent],
})
export class AppModule {}
