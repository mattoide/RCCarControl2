import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page'
import { ToastController } from '@ionic/angular';






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


  W = false
  A = false
  S = false
  D = false

  speed = 255


  constructor(
    private bluetoothSerial: BluetoothSerial,
    public modalController: ModalController,
    public toastController: ToastController
  ) { }



  async ngOnInit() {

    this.isBtEnabled();
    this.isBtConnected();

  }



  async presentModal() {
    this.isBtEnabled();
    this.isBtConnected();
    this.bluetoothSerial.isEnabled().then(() => {
      this.openModal();

    }).catch(() => {
      this.presentToast("Il bluetooth è disattivato")
    })
  }

  

  async openModal() {
    const modal = await this.modalController.create({
      component: ModalPage,
    });
    modal.onDidDismiss()
      .then((data) => {
        console.log(data)
        if (data.data) {
          this.btConnected = "Connesso a " + "\"" + data.data + "\""
          this.speed = 255
          this.btConnectedBool = true
          this.setSpeed(this.speed)
        }
        else {

          this.bluetoothSerial.isConnected().then(() => {
          }).catch(() => {
            this.btConnected = "Non connesso"
            this.btConnectedBool = false

          })
        }

      });

    return await modal.present();
  }

  btDisconnect() {
    this.bluetoothSerial.disconnect().then(() => {
      this.btConnected = "Non connesso"
      this.speed = 255
      this.btConnectedBool = false
    })
    this.isBtConnected();
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  isBtConnected() {
    this.bluetoothSerial.isConnected().then(connected => {
      console.log("connected: " + connected)
      this.speed = 255
      this.setSpeed(this.speed)
    })
  }

  isBtEnabled() {

    this.bluetoothSerial.isEnabled().then(() => {
      this.btState = "Attivo"
    }).catch(() => {
      this.btState = "Non attivo"
    })

  }

  whereGo() {

    this.bluetoothSerial.write("X" + "\n")

    if (this.A) {
      this.bluetoothSerial.write("A" + "\n")
    }

    if (this.D) {
      this.bluetoothSerial.write("D" + "\n")
    }

    if (!this.W && !this.A && !this.S && !this.D) {
      this.bluetoothSerial.write("X" + "\n")
    }

    if (this.W && !this.A && !this.D) {
      this.bluetoothSerial.write("W" + "\n")
    }

    if (this.W && this.A) {
      this.bluetoothSerial.write("W" + "\n")
      this.bluetoothSerial.write("A" + "\n")
    }

    if (this.W && this.D) {
      this.bluetoothSerial.write("W" + "\n")
      this.bluetoothSerial.write("D" + "\n")
    }

    if (this.S && !this.A && !this.D) {
      this.bluetoothSerial.write("S" + "\n")
    }

    if (this.S && this.A) {
      this.bluetoothSerial.write("S" + "\n")
      this.bluetoothSerial.write("A" + "\n")
    }

    if (this.S && this.D) {
      this.bluetoothSerial.write("S" + "\n")
      this.bluetoothSerial.write("D" + "\n")
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

  setSpeed(speed){
    this.bluetoothSerial.write("F" + speed + "\n")

  }

  forward(val) {
    this.W = val
    this.whereGo()
  }

  back(val) {
    this.S = val
    this.whereGo()
  }

  left(val) {
    this.A = val
    this.whereGo()
  }

  right(val) {
    this.D = val
    this.whereGo()
  }

  // stopAcc() {
  //   this.bluetoothSerial.write("X" + "\n")
  // }

  // stopTurn() {
  //   this.bluetoothSerial.write("Y" + "\n")
  // }
}
