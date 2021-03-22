import { Component, Input, OnInit } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { BLE } from '@ionic-native/ble/ngx';
import { element } from 'protractor';



@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  @Input() getConnectedTo: string;

  pairedDevices: []
  connectedTo;

  constructor(
    private bluetoothSerial: BluetoothSerial,
    public modalController: ModalController,
    public toastController: ToastController,
    private ble: BLE,
  ) { }

  async ngOnInit() {
    await this.discoverBtDevices()
  }

  isBtConnected() {
    this.bluetoothSerial.isConnected().then(() => {


    }).catch(() => {
      this.connectedTo = "";
    })
  }

  async presentToast(device) {
    const toast = await this.toastController.create({
      message: "Indirizzo: " + device.address,
      duration: 2000
    });
    toast.present();
  }

  async presentToastMsg(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
  async discoverBtDevices() {

    this.connectedTo = this.getConnectedTo
    await this.isBtConnected();
    this.bluetoothSerial.list().then(devices => {
      devices.forEach((element, index, arr) => {

        if (element.address == this.connectedTo) {
          element.connected = true
        }

        if (index == arr.length - 1)
          this.pairedDevices = devices


      });

    })
  }

  async connectTo(device) {

    this.bluetoothSerial.isEnabled().then(() => {
      this.bluetoothSerial.connect(device.address).subscribe(() => {
        this.modalController.dismiss(device)
        this.connectedTo = device.address
      }, (err) => {
        this.modalController.dismiss(false)
        this.presentToastMsg("Impossibile connettersi")
      });
    }).catch(() => {
      this.modalController.dismiss(false)
      this.presentToastMsg("Attiva il Bluetooth")

    })


  }


}
