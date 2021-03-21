import { Component, OnInit } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  pairedDevices: []

  constructor(
    private bluetoothSerial: BluetoothSerial,
    public modalController: ModalController,
    public toastController: ToastController) { }

  async ngOnInit() {
    await this.discoverBtDevices()
  }

  async presentToast(device) {
    const toast = await this.toastController.create({
      message: "Indirizzo: " + device.address,
      duration: 2000 
    });
    toast.present();
  }
  discoverBtDevices() {
    this.bluetoothSerial.list().then(devices => {
      // console.log(devices)
      this.pairedDevices = devices
    })
  }

  async connectTo(device){
     
    this.bluetoothSerial.isEnabled().then( () =>{
      this.bluetoothSerial.connect(device.address).subscribe(connected =>{
        if(connected)
          this.modalController.dismiss(device.name)
          
      });
    }).catch(()=>{
      this.modalController.dismiss(false)
    })


  }

  success(){
    console.log("succ")
  }
  failure(){
    console.log("fail")
  }

}
