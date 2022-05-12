import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { ToastController } from '@ionic/angular';
import { BLE } from '@ionic-native/ble/ngx';
import { ChangeDetectorRef } from '@angular/core';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';





@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {

  btState;
  btConnected;
  btConnectedBool;

  btEnabled;
  btEnabledBool;

  connetcedTo;


  W = false;
  A = false;
  S = false;
  D = false;

  speed = 255;
  height = '60%';
  alignItems = 'flex-end';

  constructor(
    private bluetoothSerial: BluetoothSerial,
    public modalController: ModalController,
    public toastController: ToastController,
    private ble: BLE,
    private changeRef: ChangeDetectorRef,
    private screenOrientation: ScreenOrientation
  ) { }

  ngOnInit() {

    this.ble.startStateNotifications().subscribe(state => {

      if (state == 'on') {
        this.onBtOn();

      } else {
        this.onBtOff();
      }
      this.bluetoothSerial.isConnected().then(()=>{
        this.btConnectedBool = true;
      }).catch(()=>{
        this.btConnectedBool = false;
      }).finally(()=>{
        this.isBtConnected();
      });

      this.changeRef.detectChanges();
    });

    this.screenOrientation.onChange().subscribe(
      () => {

        if(this.screenOrientation.type === 'landscape-primary'){
          this.height = '0%';
          this.alignItems = 'center';
        } else {
          this.height = '60%';
          this.alignItems = 'flex-end';
        }
        this.changeRef.detectChanges();

      });

  }


  async presentModal() {

    this.ble.isEnabled().then(()=>{
      this.openModal();

    }).catch(() => {
      this.presentToast('Il bluetooth è disattivato');
    });

  }



  async openModal() {

    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        getConnectedTo: this.connetcedTo,

      }
    });

    modal.onDidDismiss()
      .then((data) => {

        if (data.data) {
          this.connetcedTo = data.data.address;
          this.btConnected = 'Connesso a ' + '"' + data.data.name + '"';
          this.speed = 255;
          this.btConnectedBool = true;
          this.setSpeed(this.speed);
        }
        else {

          this.bluetoothSerial.isConnected().then(() => {
          }).catch(() => {
            this.btConnected = 'Non connesso';
            this.btConnectedBool = false;
            this.connetcedTo = '';


          });
        }

      });

    return await modal.present();
  }

  btDisconnect() {

    this.bluetoothSerial.disconnect().then(() => {
      this.disconnect();

    });
  }
  disconnect(){
    this.btConnected = 'Non connesso';
    this.speed = 255;
    this.btConnectedBool = false;
    this.connetcedTo = '';
    this.changeRef.detectChanges();
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  isBtConnected() {
    this.bluetoothSerial.isConnected().then(() => {
      this.speed = 255;
      this.setSpeed(this.speed);
    }).catch(()=>{
      this.disconnect();
    });
  }

  onBtOn() {
    this.btState = 'Attivo';
    this.btEnabledBool = true;
  }

  onBtOff() {
    this.btState = 'Non attivo';
    this.btEnabledBool = false;
    this.btConnectedBool = false;
  }


  whereGo() {

    this.bluetoothSerial.write('X' + '\n');

    if (this.A) {
      this.bluetoothSerial.write('A' + '\n');
    }

    if (this.D) {
      this.bluetoothSerial.write('D' + '\n');
    }

    if (!this.W && !this.A && !this.S && !this.D) {
      this.bluetoothSerial.write('X' + '\n');
    }

    if (this.W && !this.A && !this.D) {
      this.bluetoothSerial.write('W' + '\n');
    }

    if (this.W && this.A) {
      this.bluetoothSerial.write('W' + '\n');
      this.bluetoothSerial.write('A' + '\n');
    }

    if (this.W && this.D) {
      this.bluetoothSerial.write('W' + '\n');
      this.bluetoothSerial.write('D' + '\n');
    }

    if (this.S && !this.A && !this.D) {
      this.bluetoothSerial.write('S' + '\n');
    }

    if (this.S && this.A) {
      this.bluetoothSerial.write('S' + '\n');
      this.bluetoothSerial.write('A' + '\n');
    }

    if (this.S && this.D) {
      this.bluetoothSerial.write('S' + '\n');
      this.bluetoothSerial.write('D' + '\n');
    }

  }

  // forward() {
  //   this.bluetoothSerial.write("W" + "\n")
  // }

  // back() {
  //   this.bluetoothSerial.write("S" + "\n")
  // }

  // left() {
  //   this.bluetoothSerial.write("A" + "\n")
  // }

  // right() {
  //   this.bluetoothSerial.write("D" + "\n")
  // }

  setSpeed(speed) {
    this.bluetoothSerial.write('F' + speed + '\n');

  }

  forward(val) {

    this.W = val;
    this.whereGo();
  }

  back(val) {
    this.S = val;
    this.whereGo();
  }

  left(val) {
    this.A = val;
    this.whereGo();
  }

  right(val) {
    this.D = val;
    this.whereGo();
  }

  // stopAcc() {
  //   this.bluetoothSerial.write("X" + "\n")
  // }

  // stopTurn() {
  //   this.bluetoothSerial.write("Y" + "\n")
  // }
}
